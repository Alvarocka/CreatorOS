"use server";

import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { loginSchema, resetPasswordSchema, signupSchema } from "@/lib/validations/auth";

export async function loginAction(values: unknown) {
  const parsed = loginSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Revisa tus datos e inténtalo de nuevo."
    };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return {
      success: false,
      message: error.message
    };
  }

  redirect("/dashboard");
}

export async function signupAction(values: unknown) {
  const parsed = signupSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Revisa tus datos e inténtalo de nuevo."
    };
  }

  const supabase = await createServerSupabaseClient();
  const { email, password, username, display_name } = parsed.data;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/callback`,
      data: {
        username,
        display_name
      }
    }
  });

  if (error) {
    return {
      success: false,
      message: error.message
    };
  }

  return {
    success: true,
    message: "Te enviamos un correo para confirmar tu cuenta."
  };
}

export async function resetPasswordAction(values: unknown) {
  const parsed = resetPasswordSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Revisa tu email."
    };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/callback`
  });

  if (error) {
    return {
      success: false,
      message: error.message
    };
  }

  return {
    success: true,
    message: "Te enviamos un enlace para restablecer tu contraseña."
  };
}

export async function logoutAction() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/");
}
