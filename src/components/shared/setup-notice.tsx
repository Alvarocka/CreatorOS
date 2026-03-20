import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export function SetupNotice() {
  return (
    <Card className="border-dashed border-white/15 bg-white/[0.05]">
      <CardHeader>
        <CardTitle>Conecta Supabase para activar CreatorOS</CardTitle>
        <CardDescription>
          La estructura del MVP ya está lista. Para usar autenticación, base de datos, storage y perfil
          público, agrega tus variables en <code>.env.local</code> y ejecuta la migración SQL incluida.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        <Link className={cn(buttonVariants())} href="/">
          Volver a la landing
        </Link>
        <Link className={cn(buttonVariants({ variant: "outline" }))} href="/login">
          Ir a login
        </Link>
      </CardContent>
    </Card>
  );
}
