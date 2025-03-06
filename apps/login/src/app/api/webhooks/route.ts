import { handleWebhook } from "@/lib/server/webhook";

export async function POST(request: Request) {
  return handleWebhook(request);
}