import { AuthForm } from "@/components/auth-form";

export const metadata = { title: "Email OTP Login" };

export default function RegisterPage() {
  return (
    <main>
      <section className="section alt auth-page">
        <div className="container auth-center">
          <AuthForm mode="register" />
        </div>
      </section>
    </main>
  );
}
