"use server";

import {
  getLoginSettings,
  getUserByID,
  startIdentityProviderFlow,
} from "@/lib/zitadel";
import { headers } from "next/headers";
import { getNextUrl } from "../client";
import { getServiceUrlFromHeaders } from "../service";
import { checkEmailVerification } from "../verify-helper";
import { createSessionForIdpAndUpdateCookie } from "./cookie";

export type StartIDPFlowCommand = {
  idpId: string;
  successUrl: string;
  failureUrl: string;
};

export async function startIDPFlow(command: StartIDPFlowCommand) {
  const _headers = await headers();
  const { serviceUrl } = getServiceUrlFromHeaders(_headers);
  const host = _headers.get("host");

  if (!host) {
    return { error: "Could not get host" };
  }

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return startIdentityProviderFlow({
    serviceUrl,
    idpId: command.idpId,
    urls: {
      successUrl: `${host.includes("localhost") ? "http://" : "https://"}${host}${basePath}${command.successUrl}`,
      failureUrl: `${host.includes("localhost") ? "http://" : "https://"}${host}${basePath}${command.failureUrl}`,
    },
  }).then((response) => {
    if (
      response &&
      response.nextStep.case === "authUrl" &&
      response?.nextStep.value
    ) {
      return { redirect: response.nextStep.value };
    }
  });
}

type CreateNewSessionCommand = {
  userId: string;
  idpIntent: {
    idpIntentId: string;
    idpIntentToken: string;
  };
  loginName?: string;
  password?: string;
  organization?: string;
  requestId?: string;
};

export async function createNewSessionFromIdpIntent(
  command: CreateNewSessionCommand,
) {
  const _headers = await headers();
  const { serviceUrl } = getServiceUrlFromHeaders(_headers);
  const host = _headers.get("host");

  if (!host) {
    return { error: "Could not get domain" };
  }

  if (!command.userId || !command.idpIntent) {
    throw new Error("No userId or loginName provided");
  }

  const userResponse = await getUserByID({
    serviceUrl,

    userId: command.userId,
  });

  if (!userResponse || !userResponse.user) {
    return { error: "User not found in the system" };
  }

  // Notify about the IDP-based registration
  const { notifyUserRegistration } = await import('./notifyWebhook');
  await notifyUserRegistration({
    userId: command.userId,
    email: userResponse.user.details?.emailAddress || '',
    firstName: userResponse.user.human?.profile?.firstName,
    lastName: userResponse.user.human?.profile?.lastName,
    isIdpRegistration: true,
    idpId: command.idpIntent.idpIntentId,
  });

  const loginSettings = await getLoginSettings({
    serviceUrl,

    organization: userResponse.user.details?.resourceOwner,
  });

  const session = await createSessionForIdpAndUpdateCookie(
    command.userId,
    command.idpIntent,
    command.requestId,
    loginSettings?.externalLoginCheckLifetime,
  );

  if (!session || !session.factors?.user) {
    return { error: "Could not create session" };
  }

  const humanUser =
    userResponse.user.type.case === "human"
      ? userResponse.user.type.value
      : undefined;

  // check to see if user was verified
  const emailVerificationCheck = checkEmailVerification(
    session,
    humanUser,
    command.organization,
    command.requestId,
  );

  if (emailVerificationCheck?.redirect) {
    return emailVerificationCheck;
  }

  // TODO: check if user has MFA methods
  // const mfaFactorCheck = checkMFAFactors(session, loginSettings, authMethods, organization, requestId);
  // if (mfaFactorCheck?.redirect) {
  //   return mfaFactorCheck;
  // }

  const url = await getNextUrl(
    command.requestId && session.id
      ? {
          sessionId: session.id,
          requestId: command.requestId,
          organization: session.factors.user.organizationId,
        }
      : {
          loginName: session.factors.user.loginName,
          organization: session.factors.user.organizationId,
        },
    loginSettings?.defaultRedirectUri,
  );

  if (url) {
    return { redirect: url };
  }
}
