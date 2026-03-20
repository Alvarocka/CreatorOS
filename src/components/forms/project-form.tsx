"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { saveProjectAction } from "@/lib/actions/projects";
import { statusLabelMap, visibilityLabelMap, workflowStatuses } from "@/lib/constants/creatoros";
import type { Project } from "@/lib/types/app";
import { projectSchema } from "@/lib/validations/projects";

type ProjectFormValues = z.infer<typeof projectSchema>;

export function ProjectForm({ project }: { project?: Project | null }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      cover_image_url: project?.cover_image_url || "",
      description: project?.description || "",
      id: project?.id,
      status: project?.status || "idea",
      title: project?.title || "",
      visibility: project?.visibility || "private"
    }
  });

  function submit(values: ProjectFormValues) {
    startTransition(async () => {
      const result = await saveProjectAction(values);

      if (!result.success || !result.data) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.push(`/projects/${result.data.id}`);
      router.refresh();
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{project ? "Editar proyecto" : "Nuevo proyecto"}</CardTitle>
        <p className="text-sm leading-6 text-muted-foreground">
          Agrupa piezas por álbum, libro, campaña, lanzamiento o cualquier proceso que quieras seguir.
        </p>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={form.handleSubmit(submit)}>
          <div>
            <Label htmlFor="title">Título</Label>
            <Input id="title" placeholder="Ej: EP invierno 2026" {...form.register("title")} />
          </div>
          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Qué reúne este proyecto, en qué etapa va y qué debería salir de aquí."
              {...form.register("description")}
            />
          </div>
          <div>
            <Label htmlFor="cover_image_url">Cover image URL</Label>
            <Input id="cover_image_url" placeholder="https://..." {...form.register("cover_image_url")} />
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <Label>Estado</Label>
              <Select
                onChange={(event) => form.setValue("status", event.target.value as ProjectFormValues["status"])}
                options={workflowStatuses.map((status) => ({ label: statusLabelMap[status], value: status }))}
                value={form.watch("status")}
              />
            </div>
            <div>
              <Label>Visibilidad</Label>
              <Select
                onChange={(event) =>
                  form.setValue("visibility", event.target.value as ProjectFormValues["visibility"])
                }
                options={[
                  { label: visibilityLabelMap.private, value: "private" },
                  { label: visibilityLabelMap.public, value: "public" }
                ]}
                value={form.watch("visibility")}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button disabled={isPending} type="submit">
              {isPending ? "Guardando..." : project ? "Guardar cambios" : "Crear proyecto"}
            </Button>
            <Button onClick={() => router.back()} type="button" variant="outline">
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
