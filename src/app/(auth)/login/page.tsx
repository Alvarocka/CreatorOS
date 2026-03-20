import Link from "next/link";

import { AuthForm } from "@/components/forms/auth-form";

export default function LoginPage() {
  return (
    <div className="w-full max-w-xl space-y-4">
      <AuthForm mode="login" />
      <div className="flex flex-wrap items-center justify-between gap-3 px-1 text-sm text-muted-foreground">
        <Link href="/reset-password">Olvidé mi contraseña</Link>
        <Link href="/signup">Todavía no tengo cuenta</Link>
      </div>
    </div>
  );
}
