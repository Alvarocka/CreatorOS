"use server";

import { revalidatePath } from "next/cache";

import { getActionUser, normalizeOptional, type ActionResult, upsertShareForEntity } from "@/lib/actions/utils";
import { projectSchema } from "@/lib/validations/projects";

export async function saveProjectAction(values: unknown): Promise<ActionResult<{ id: string }>> {
  const parsed = projectSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "No pudimos guardar el proyecto."
    };
  }

  const { supabase, user } = await getActionUser();
  const payload = {
    title: parsed.data.title.trim(),
    description: normalizeOptional(parsed.data.description),
    cover_image_url: normalizeOptional(parsed.data.cover_image_url),
    status: parsed.data.status,
    visibility: parsed.data.visibility
  };

  let projectId = parsed.data.id;

  if (projectId) {
    const { error } = await supabase
      .from("projects")
      .update(payload)
      .eq("id", projectId)
      .eq("user_id", user.id);

    if (error) {
      return {
        success: false,
        message: error.message
      };
    }
  } else {
    const { data, error } = await supabase
      .from("projects")
      .insert({
        ...payload,
        user_id: user.id
      })
      .select("id")
      .single();

    if (error || !data) {
      return {
        success: false,
        message: error?.message || "No pudimos crear el proyecto."
      };
    }

    projectId = data.id;
  }

  await upsertShareForEntity({
    entityId: projectId!,
    entityType: "project",
    title: parsed.data.title,
    userId: user.id,
    visible: parsed.data.visibility === "public"
  });

  revalidatePath("/dashboard");
  revalidatePath("/projects");
  revalidatePath(`/projects/${projectId}`);

  return {
    success: true,
    message: parsed.data.id ? "Proyecto actualizado." : "Proyecto creado.",
    data: {
      id: projectId!
    }
  };
}

export async function deleteProjectAction(id: string): Promise<ActionResult> {
  const { supabase, user } = await getActionUser();
  const { error } = await supabase.from("projects").delete().eq("id", id).eq("user_id", user.id);

  if (error) {
    return {
      success: false,
      message: error.message
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/projects");
  revalidatePath("/library");

  return {
    success: true,
    message: "Proyecto eliminado."
  };
}
