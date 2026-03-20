"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, resetPasswordSchema, signupSchema } from "@/lib/validations/auth";
import { loginAction, resetPasswordAction, signupAction } from "@/lib/actions/auth";

type Mode = "login" | "signup" | "reset";

type FormValues = {
  email: string;
  password?: string;
  username?: string;
  display_name?: string;
};

const copyMap: Record<
  Mode,
  {
    title: string;
    description: string;
    button: string;
  }
> = {
  login: {
    title: "Bienvenido de vuelta",
    description: "Entra a tu archivo creativo y retoma ideas, proyectos y piezas públicas.",
    button: "Entrar"
  },
  signup: {
    title: "Crea tu CreatorOS",
    description: "Empieza tu biblioteca creativa personal y pública desde una sola base.",
    button: "Crear cuenta"
  },
  reset: {
    title: "Restablece tu acceso",
    description: "Te enviaremos un enlace para volver a entrar sin perder tu archivo.",
    button: "Enviar enlace"
  }
};

export function AuthForm({ mode }: { mode: Mode }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<FormValues>({
    defaultValues: {
      display_name: "",
      email: "",
      password: "",
      username: ""
    }
  });

  const copy = copyMap[mode];

  async function onSubmit(values: FormValues) {
    startTransition(async () => {
      const parsed =
        mode === "login"
          ? loginSchema.safeParse(values)
          : mode === "signup"
            ? signupSchema.safeParse(values)
            : resetPasswordSchema.safeParse(values);

      if (!parsed.success) {
        toast.error(parsed.error.issues[0]?.message || "Revisa los datos del formulario.");
        return;
      }

      const result =
        mode === "login"
          ? await loginAction(parsed.data)
          : mode === "signup"
            ? await signupAction(parsed.data)
            : await resetPasswordAction(parsed.data);

      if (!result?.success) {
        toast.error(result?.message || "No pudimos completar la acción.");
        return;
      }

      toast.success(result.message);

      if (mode === "signup" || mode === "reset") {
        router.push("/login");
      }
    });
  }

  return (
    <Card className="w-full max-w-xl">
      <CardHeader className="space-y-3">
        <CardTitle className="text-3xl">{copy.title}</CardTitle>
        <CardDescription>{copy.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          {mode === "signup" ? (
            <div>
              <Label htmlFor="display_name">Nombre visible</Label>
              <Input id="display_name" placeholder="Tu nombre o alias creativo" {...form.register("display_name")} />
            </div>
          ) : null}

          {mode === "signup" ? (
            <div>
              <Label htmlFor="username">Username</Label>
              <Input id="username" placeholder="creator_handle" {...form.register("username")} />
            </div>
          ) : null}

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="hola@tudominio.com" type="email" {...form.register("email")} />
          </div>

          {mode !== "reset" ? (
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" placeholder="Mínimo 8 caracteres" type="password" {...form.register("password")} />
            </div>
          ) : null}

          <Button className="w-full" disabled={isPending} type="submit">
            {isPending ? "Procesando..." : copy.button}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
