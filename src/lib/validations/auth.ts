import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Ingresa un email válido."),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres.")
});

export const signupSchema = z.object({
  email: z.string().email("Ingresa un email válido."),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
  username: z
    .string()
    .min(3, "Tu username debe tener al menos 3 caracteres.")
    .max(24, "Tu username no puede tener más de 24 caracteres.")
    .regex(/^[a-z0-9_]+$/, "Usa solo minúsculas, números y guion bajo."),
  display_name: z.string().min(2, "Agrega tu nombre visible.")
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Ingresa un email válido.")
});
