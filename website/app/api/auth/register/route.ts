import { fail, ok } from "@/lib/api-response";
import { registerSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return fail("Invalid registration details", 422);
  }

  return ok(
    {
      message: "Registration accepted. OTP email integration is planned for backend implementation.",
      user: {
        name: parsed.data.name,
        email: parsed.data.email
      }
    },
    202
  );
}
