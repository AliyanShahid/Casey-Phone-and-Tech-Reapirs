import { AuthForm } from "@/components/auth-form";

export const metadata = { title: "Login" };

export default function LoginPage() {
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
