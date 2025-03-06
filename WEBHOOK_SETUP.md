# Webhook Integration Setup

This document explains how to use the webhook integration for user management events.

## Configuration

1. Set the webhook secret in your environment:
   - The webhook secret is configured in `apps/login/.env.local`
   - Current webhook secret: `whsec_f8e7d6c5b4a3921f0e9d8c7b6a5f4e3d2c1b0a9`
   - Keep this secret secure and do not commit it to version control

## Supported Events

The webhook endpoint supports the following user-related events:
- `user.created`: Triggered when a new user is registered
- `user.updated`: Triggered when user information is updated
- `user.deleted`: Triggered when a user is deleted

## Webhook URL

The webhook endpoint is available at: `/api/webhooks`

## Security

- All webhook requests must include the `x-webhook-signature` header
- The signature is verified using HMAC SHA-256
- Requests without valid signatures will be rejected

## Testing

To test the webhook integration:

1. Use the webhook secret to generate a signature:
```javascript
const crypto = require('crypto');
const secret = 'whsec_f8e7d6c5b4a3921f0e9d8c7b6a5f4e3d2c1b0a9';
const payload = JSON.stringify({ type: 'user.created', data: { ... } });
const signature = crypto
  .createHmac('sha256', secret)
  .update(payload)
  .digest('hex');
```

2. Send a test request:
```bash
curl -X POST https://your-domain/api/webhooks \
  -H "x-webhook-signature: [signature]" \
  -H "Content-Type: application/json" \
  -d '{"type": "user.created", "data": { ... }}'
```