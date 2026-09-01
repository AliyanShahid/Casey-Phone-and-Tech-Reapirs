import { fail, ok } from "@/lib/api-response";
import { quoteRequestSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = quoteRequestSchema.safeParse(body);

  if (!parsed.success) {
    return fail("Invalid quote request details", 422);
  }

  return ok(
    {
      message: "Quote request accepted by placeholder endpoint. Database persistence is planned for Phase 2.",
      quoteType: "repair"
    },
    202
  );
}
