"use server";

import { revalidatePath } from "next/cache";

import { getActionUser, normalizeOptional, type ActionResult } from "@/lib/actions/utils";
import { profileSchema } from "@/lib/validations/profile";

export async function saveProfileAction(values: unknown): Promise<ActionResult> {
  const parsed = profileSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "No pudimos guardar tu perfil."
    };
  }

  const { supabase, user } = await getActionUser();
  const { error } = await supabase
    .from("profiles")
    .update({
      avatar_url: normalizeOptional(parsed.data.avatar_url),
      bio: normalizeOptional(parsed.data.bio),
      display_name: parsed.data.display_name.trim(),
      username: parsed.data.username.trim()
    })
    .eq("id", user.id);

  if (error) {
    return {
      success: false,
      message: error.message
    };
  }

  revalidatePath("/settings");
  revalidatePath(`/u/${parsed.data.username}`);
  return {
    success: true,
    message: "Perfil actualizado."
  };
}
