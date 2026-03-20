import { revalidatePath } from "next/cache";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils/format";

export type ActionResult<T = void> = {
  success: boolean;
  message: string;
  data?: T;
};

export async function getActionUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Tu sesión expiró. Vuelve a iniciar sesión.");
  }

  return { supabase: supabase as any, user };
}

export function normalizeOptional(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export async function upsertShareForEntity({
  entityId,
  entityType,
  title,
  userId,
  visible
}: {
  entityId: string;
  entityType: "item" | "project";
  title: string;
  userId: string;
  visible: boolean;
}) {
  const supabase = (await createServerSupabaseClient()) as any;

  if (!visible) {
    await supabase
      .from("public_shares")
      .delete()
      .eq("user_id", userId)
      .eq("entity_type", entityType)
      .eq("entity_id", entityId);
    return;
  }

  const baseSlug = slugify(title) || `${entityType}-${entityId.slice(0, 8)}`;
  const slug = `${baseSlug}-${entityId.slice(0, 8)}`;

  await supabase.from("public_shares").upsert(
    {
      entity_id: entityId,
      entity_type: entityType,
      slug,
      user_id: userId
    },
    {
      onConflict: "entity_type,entity_id"
    }
  );
}

export function revalidateCreatorPaths(paths: string[]) {
  paths.forEach((path) => revalidatePath(path));
}
