import { z } from "zod";

export const profileSchema = z.object({
  username: z
    .string()
    .min(3, "Tu username debe tener al menos 3 caracteres.")
    .max(24, "Máximo 24 caracteres.")
    .regex(/^[a-z0-9_]+$/, "Usa solo minúsculas, números y guion bajo."),
  display_name: z.string().min(2, "Agrega un nombre visible.").max(80, "Máximo 80 caracteres."),
  bio: z.string().max(280, "Máximo 280 caracteres.").optional().or(z.literal("")),
  avatar_url: z.string().optional().or(z.literal(""))
});
