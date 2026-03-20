import { z } from "zod";

import { visibilityOptions, workflowStatuses } from "@/lib/constants/creatoros";

export const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, "Agrega un nombre para el proyecto.").max(120, "Máximo 120 caracteres."),
  description: z.string().max(400, "Máximo 400 caracteres.").optional().or(z.literal("")),
  cover_image_url: z.string().optional().or(z.literal("")),
  status: z.enum(workflowStatuses),
  visibility: z.enum(visibilityOptions)
});
