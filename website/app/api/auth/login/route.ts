import { fail, ok } from "@/lib/api-response";
import { loginSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return fail("Invalid login details", 422);
  }

  return ok(
    {
      message: "Login endpoint placeholder. JWT issuing will be connected after users table and password hashing."
    },
    202
  );
}
