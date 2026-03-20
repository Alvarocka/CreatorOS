import { z } from "zod";

import { itemTypes, noteTypes, visibilityOptions, workflowStatuses } from "@/lib/constants/creatoros";

export const itemSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, "Agrega un título claro.").max(120, "Máximo 120 caracteres."),
  description: z.string().max(280, "Máximo 280 caracteres.").optional().or(z.literal("")),
  content_text: z.string().optional().or(z.literal("")),
  type: z.enum(itemTypes),
  file_url: z.string().optional().or(z.literal("")),
  thumbnail_url: z.string().optional().or(z.literal("")),
  project_id: z.string().optional().or(z.literal("")),
  status: z.enum(workflowStatuses),
  visibility: z.enum(visibilityOptions),
  is_favorite: z.boolean().default(false),
  tags: z.array(z.string()).default([])
});

export const itemFormSchema = itemSchema.extend({
  tags_input: z.string().optional().or(z.literal(""))
});

export const itemNoteSchema = z.object({
  creative_item_id: z.string().uuid("Item inválido."),
  note_type: z.enum(noteTypes),
  content_text: z.string().min(2, "Escribe una nota para guardarla."),
  timestamp_seconds: z.number().nullable().optional()
});
