"use server";

type NotifyUserRegistrationParams = {
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isIdpRegistration?: boolean;
  idpId?: string;
};

export async function notifyUserRegistration(params: NotifyUserRegistrationParams) {
  // Replace WEBHOOK_URL with your actual webhook endpoint
  const webhookUrl = process.env.USER_REGISTRATION_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.warn('No webhook URL configured for user registration notifications');
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: params.userId,
        email: params.email,
        firstName: params.firstName,
        lastName: params.lastName,
        registrationType: params.isIdpRegistration ? 'idp' : 'direct',
        idpId: params.idpId,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      console.error('Failed to send registration webhook notification:', await response.text());
    }
  } catch (error) {
    console.error('Error sending registration webhook notification:', error);
  }
}