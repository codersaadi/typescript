"use server";

import { headers } from "next/headers";
import crypto from 'crypto';

export type WebhookConfig = {
  secret: string;
  events: string[];
};

// Verify webhook signature
export function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  const expectedSignature = hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
}

// Handle webhook events
export async function handleWebhook(req: Request) {
  const webhookSecret = process.env.WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error('Webhook secret is not configured');
  }

  const signature = req.headers.get('x-webhook-signature');
  if (!signature) {
    throw new Error('Missing webhook signature');
  }

  const payload = await req.text();
  const isValid = verifyWebhookSignature(payload, signature, webhookSecret);
  
  if (!isValid) {
    throw new Error('Invalid webhook signature');
  }

  const event = JSON.parse(payload);
  
  // Handle different event types
  switch (event.type) {
    case 'user.created':
    case 'user.updated':
    case 'user.deleted':
      // Process the event
      console.log(`Received ${event.type} event:`, event);
      break;
    default:
      console.log('Unhandled event type:', event.type);
  }

  return new Response('Webhook processed successfully', { status: 200 });
}