import Link from "next/link";

import { AuthForm } from "@/components/forms/auth-form";

export default function SignupPage() {
  return (
    <div className="w-full max-w-xl space-y-4">
      <AuthForm mode="signup" />
      <div className="px-1 text-sm text-muted-foreground">
        <Link href="/login">Ya tengo cuenta</Link>
      </div>
    </div>
  );
}
