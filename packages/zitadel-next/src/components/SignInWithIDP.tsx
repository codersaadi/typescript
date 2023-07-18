import { ReactNode } from "react";

import {
  ZitadelServer,
  settings,
  GetActiveIdentityProvidersResponse,
  IdentityProvider,
  IdentityProviderType,
} from "@zitadel/server";
import {
  SignInWithGitlab,
  SignInWithAzureAD,
  SignInWithGoogle,
  SignInWithGithub,
} from "@zitadel/react";

export interface SignInWithIDPProps {
  children?: ReactNode;
  server: ZitadelServer;
  orgId?: string;
}

function getIdentityProviders(
  server: ZitadelServer,
  orgId?: string
): Promise<IdentityProvider[] | undefined> {
  const settingsService = settings.getSettings(server);
  console.log("req");
  return settingsService
    .getActiveIdentityProviders(
      orgId ? { ctx: { orgId } } : { ctx: { instance: true } },
      {}
    )
    .then((resp: GetActiveIdentityProvidersResponse) => {
      return resp.identityProviders;
    });
}

export async function SignInWithIDP(props: SignInWithIDPProps) {
  const identityProviders = await getIdentityProviders(
    props.server,
    props.orgId
  );

  console.log(identityProviders);

  return (
    <div className="ztdl-next-flex ztdl-next-flex-col ztdl-next-w-full ztdl-next-space-y-2 ztdl-next-text-sm">
      {identityProviders &&
        identityProviders.map((idp, i) => {
          switch (idp.type) {
            case IdentityProviderType.IDENTITY_PROVIDER_TYPE_GITHUB:
              return <SignInWithGithub key={`idp-${i}`}></SignInWithGithub>;
            case IdentityProviderType.IDENTITY_PROVIDER_TYPE_GITHUB_ES:
              return <SignInWithGithub key={`idp-${i}`}></SignInWithGithub>;
            case IdentityProviderType.IDENTITY_PROVIDER_TYPE_AZURE_AD:
              return <SignInWithAzureAD key={`idp-${i}`}></SignInWithAzureAD>;
            case IdentityProviderType.IDENTITY_PROVIDER_TYPE_GOOGLE:
              return <SignInWithGoogle key={`idp-${i}`}></SignInWithGoogle>;
            case IdentityProviderType.IDENTITY_PROVIDER_TYPE_GITLAB:
              return <SignInWithGitlab key={`idp-${i}`}></SignInWithGitlab>;
            case IdentityProviderType.IDENTITY_PROVIDER_TYPE_GITLAB_SELF_HOSTED:
              return <SignInWithGitlab key={`idp-${i}`}></SignInWithGitlab>;
            default:
              return <div></div>;
          }
        })}
      {props.children}
    </div>
  );
}

SignInWithIDP.displayName = "SignInWithIDP";
