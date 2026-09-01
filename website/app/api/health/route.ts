import { ok } from "@/lib/api-response";

export async function GET() {
  return ok({
    service: "casey-phone-tech-repairs-website",
    status: "healthy",
    phase: "phase-1-foundation"
  });
}
