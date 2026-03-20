import Link from "next/link";

import { AuthForm } from "@/components/forms/auth-form";

export default function ResetPasswordPage() {
  return (
    <div className="w-full max-w-xl space-y-4">
      <AuthForm mode="reset" />
      <div className="px-1 text-sm text-muted-foreground">
        <Link href="/login">Volver al login</Link>
      </div>
    </div>
  );
}
