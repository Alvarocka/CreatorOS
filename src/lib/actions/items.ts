"use server";

import { revalidatePath } from "next/cache";

import { getActionUser, normalizeOptional, type ActionResult, upsertShareForEntity } from "@/lib/actions/utils";
import type { CreativeItemTag, Tag } from "@/lib/types/app";
import { itemNoteSchema, itemSchema } from "@/lib/validations/items";

async function ensureTags(userId: string, tags: string[], supabase: Awaited<ReturnType<typeof getActionUser>>["supabase"]) {
  if (tags.length === 0) return [];

  const normalized = Array.from(
    new Set(
      tags
        .map((tag) => tag.trim())
        .filter(Boolean)
        .map((tag) => tag.toLowerCase())
    )
  );

  const { data: existing } = await supabase
    .from("tags")
    .select("*")
    .eq("user_id", userId)
    .in("name", normalized);

  const existingTags = (existing || []) as Tag[];
  const existingNames = new Set(existingTags.map((tag) => tag.name));
  const missing = normalized.filter((tag) => !existingNames.has(tag));

  if (missing.length > 0) {
    await supabase.from("tags").insert(
      missing.map((name, index) => ({
        color: ["#B9633B", "#0E6B6D", "#5D6D4D", "#D0A95B"][index % 4],
        name,
        user_id: userId
      }))
    );
  }

  const { data: allTags } = await supabase.from("tags").select("*").eq("user_id", userId).in("name", normalized);
  return ((allTags || []) as Tag[]);
}

export async function saveItemAction(values: unknown): Promise<ActionResult<{ id: string }>> {
  const parsed = itemSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "No pudimos guardar la pieza."
    };
  }

  const { supabase, user } = await getActionUser();
  const payload = parsed.data;

  const itemData = {
    title: payload.title.trim(),
    content_text: normalizeOptional(payload.content_text),
    type: payload.type,
    file_url: normalizeOptional(payload.file_url),
    thumbnail_url: normalizeOptional(payload.thumbnail_url),
    description: normalizeOptional(payload.description),
    project_id: normalizeOptional(payload.project_id),
    status: payload.status,
    visibility: payload.visibility,
    is_favorite: payload.is_favorite
  };

  let itemId = payload.id;

  if (itemId) {
    const { error } = await supabase
      .from("creative_items")
      .update(itemData)
      .eq("id", itemId)
      .eq("user_id", user.id);

    if (error) {
      return {
        success: false,
        message: error.message
      };
    }
  } else {
    const { data, error } = await supabase
      .from("creative_items")
      .insert({
        ...itemData,
        user_id: user.id
      })
      .select("id")
      .single();

    if (error || !data) {
      return {
        success: false,
        message: error?.message || "No pudimos crear la pieza."
      };
    }

    itemId = data.id;
  }

  const ensuredTags = await ensureTags(user.id, payload.tags, supabase);
  await supabase.from("creative_item_tags").delete().eq("creative_item_id", itemId);

  if (ensuredTags.length > 0) {
    await supabase.from("creative_item_tags").insert(
      ensuredTags.map((tag) => ({
        creative_item_id: itemId!,
        tag_id: tag.id
      }))
    );
  }

  await upsertShareForEntity({
    entityId: itemId!,
    entityType: "item",
    title: payload.title,
    userId: user.id,
    visible: payload.visibility === "public"
  });

  revalidatePath("/dashboard");
  revalidatePath("/library");
  revalidatePath("/projects");
  revalidatePath(`/items/${itemId}`);
  revalidatePath("/search");

  return {
    success: true,
    message: payload.id ? "La pieza se actualizó." : "La pieza se creó correctamente.",
    data: {
      id: itemId!
    }
  };
}

export async function deleteItemAction(id: string): Promise<ActionResult> {
  const { supabase, user } = await getActionUser();
  const { error } = await supabase.from("creative_items").delete().eq("id", id).eq("user_id", user.id);

  if (error) {
    return {
      success: false,
      message: error.message
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/library");
  revalidatePath("/projects");
  return {
    success: true,
    message: "La pieza se eliminó."
  };
}

export async function duplicateItemAction(id: string): Promise<ActionResult<{ id: string }>> {
  const { supabase, user } = await getActionUser();
  const { data: item, error } = await supabase
    .from("creative_items")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !item) {
    return {
      success: false,
      message: error?.message || "No encontramos la pieza."
    };
  }

  const { data: copy, error: copyError } = await supabase
    .from("creative_items")
    .insert({
      ...item,
      id: undefined,
      title: `${item.title} (copia)`,
      visibility: "private",
      is_favorite: false,
      archived_at: null
    })
    .select("id")
    .single();

  if (copyError || !copy) {
    return {
      success: false,
      message: copyError?.message || "No pudimos duplicar la pieza."
    };
  }

  const { data: itemTags } = await supabase.from("creative_item_tags").select("*").eq("creative_item_id", id);
  const duplicatedItemTags = (itemTags || []) as CreativeItemTag[];

  if (duplicatedItemTags.length) {
    await supabase.from("creative_item_tags").insert(
      duplicatedItemTags.map((tag) => ({
        creative_item_id: copy.id,
        tag_id: tag.tag_id
      }))
    );
  }

  revalidatePath("/dashboard");
  revalidatePath("/library");

  return {
    success: true,
    message: "La pieza se duplicó.",
    data: { id: copy.id }
  };
}

export async function toggleFavoriteAction(id: string, nextValue: boolean): Promise<ActionResult> {
  const { supabase, user } = await getActionUser();
  const { error } = await supabase
    .from("creative_items")
    .update({ is_favorite: nextValue })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return {
      success: false,
      message: error.message
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/library");
  revalidatePath(`/items/${id}`);
  return {
    success: true,
    message: nextValue ? "Se agregó a favoritos." : "Se quitó de favoritos."
  };
}

export async function archiveItemAction(id: string): Promise<ActionResult> {
  const { supabase, user } = await getActionUser();
  const { error } = await supabase
    .from("creative_items")
    .update({
      archived_at: new Date().toISOString(),
      status: "archived"
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return {
      success: false,
      message: error.message
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/library");
  revalidatePath(`/items/${id}`);
  return {
    success: true,
    message: "La pieza fue archivada."
  };
}

export async function saveItemNoteAction(values: unknown): Promise<ActionResult> {
  const parsed = itemNoteSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "No pudimos guardar la nota."
    };
  }

  const { supabase, user } = await getActionUser();
  const { error } = await supabase.from("creative_item_notes").insert({
    ...parsed.data,
    user_id: user.id
  });

  if (error) {
    return {
      success: false,
      message: error.message
    };
  }

  revalidatePath(`/items/${parsed.data.creative_item_id}`);
  return {
    success: true,
    message: "La nota quedó guardada."
  };
}
