import { AuthForm } from "@/components/auth-form";

export const metadata = { title: "Email OTP Login" };

export default function ForgotPasswordPage() {
  return (
    <main>
      <section className="section alt auth-page">
        <div className="container auth-center">
          <AuthForm mode="login" />
        </div>
      </section>
    </main>
  );
}
