"use client";

import { useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { FileUploadField } from "@/components/forms/file-upload-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { itemTypes, mediaAcceptMap, statusLabelMap, typeLabelMap, visibilityLabelMap, workflowStatuses } from "@/lib/constants/creatoros";
import { saveItemAction } from "@/lib/actions/items";
import type { CreativeItemWithRelations, Project } from "@/lib/types/app";
import { itemFormSchema } from "@/lib/validations/items";

type ItemFormValues = z.infer<typeof itemFormSchema>;

export function ItemForm({
  item,
  projects,
  preselectedType
}: {
  item?: CreativeItemWithRelations | null;
  projects: Project[];
  preselectedType?: (typeof itemTypes)[number];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: {
      content_text: item?.content_text || "",
      description: item?.description || "",
      file_url: item?.file_url || "",
      id: item?.id,
      is_favorite: item?.is_favorite || false,
      project_id: item?.project_id || "",
      status: item?.status || "idea",
      tags: item?.tags?.map((tag) => tag.name) || [],
      tags_input: item?.tags?.map((tag) => tag.name).join(", ") || "",
      thumbnail_url: item?.thumbnail_url || "",
      title: item?.title || "",
      type: item?.type || preselectedType || "text",
      visibility: item?.visibility || "private"
    }
  });

  const selectedType = form.watch("type");
  const showTextEditor = useMemo(() => ["text", "note", "audio", "video", "link"].includes(selectedType), [selectedType]);

  function submit(values: ItemFormValues) {
    const tags = values.tags_input
      ? values.tags_input
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];

    startTransition(async () => {
      const result = await saveItemAction({
        ...values,
        tags
      });

      if (!result.success || !result.data) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.push(`/items/${result.data.id}`);
      router.refresh();
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{item ? "Editar pieza" : "Crear nueva pieza"}</CardTitle>
        <p className="text-sm leading-6 text-muted-foreground">
          Todo puede vivir aquí: una idea rápida, una letra, un audio, un link de referencia o un archivo
          importante.
        </p>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={form.handleSubmit(submit)}>
          <div className="grid gap-5 lg:grid-cols-2">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input id="title" placeholder="Ej: Demo acústica del puente" {...form.register("title")} />
            </div>
            <div>
              <Label htmlFor="type">Tipo</Label>
              <Select
                id="type"
                onChange={(event) => form.setValue("type", event.target.value as ItemFormValues["type"])}
                options={itemTypes.map((type) => ({ label: typeLabelMap[type], value: type }))}
                value={selectedType}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descripción breve</Label>
            <Textarea
              id="description"
              placeholder="Qué es esta pieza, qué contexto tiene y por qué vale la pena volver a verla."
              rows={3}
              {...form.register("description")}
            />
          </div>

          {showTextEditor ? (
            <div>
              <Label htmlFor="content_text">Texto principal / notas / letra</Label>
              <Textarea
                className="min-h-[220px]"
                id="content_text"
                placeholder="Escribe la idea, la letra, el outline, las observaciones o el contenido editable principal."
                {...form.register("content_text")}
              />
            </div>
          ) : null}

          {selectedType === "audio" || selectedType === "image" || selectedType === "video" || selectedType === "file" ? (
            <FileUploadField
              accept={mediaAcceptMap[selectedType]}
              label={selectedType === "video" ? "Video o enlace compartido" : "Archivo principal"}
              onChange={(value) => form.setValue("file_url", value)}
              value={form.watch("file_url")}
            />
          ) : null}

          {selectedType === "link" ? (
            <div>
              <Label htmlFor="file_url">URL del link</Label>
              <Input id="file_url" placeholder="https://..." {...form.register("file_url")} />
            </div>
          ) : null}

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <Label>Proyecto</Label>
              <Select
                onChange={(event) => form.setValue("project_id", event.target.value)}
                options={[
                  { label: "Sin proyecto", value: "" },
                  ...projects.map((project) => ({ label: project.title, value: project.id }))
                ]}
                value={form.watch("project_id") || ""}
              />
            </div>
            <div>
              <Label>Estado</Label>
              <Select
                onChange={(event) => form.setValue("status", event.target.value as ItemFormValues["status"])}
                options={workflowStatuses.map((status) => ({
                  label: statusLabelMap[status],
                  value: status
                }))}
                value={form.watch("status")}
              />
            </div>
            <div>
              <Label>Visibilidad</Label>
              <Select
                onChange={(event) =>
                  form.setValue("visibility", event.target.value as ItemFormValues["visibility"])
                }
                options={[
                  { label: visibilityLabelMap.private, value: "private" },
                  { label: visibilityLabelMap.public, value: "public" }
                ]}
                value={form.watch("visibility")}
              />
            </div>
            <div className="rounded-[24px] border border-input bg-white/60 px-4 py-3">
              <Label className="mb-3">Favorito</Label>
              <label className="flex items-center gap-3 text-sm text-muted-foreground">
                <input
                  checked={form.watch("is_favorite")}
                  onChange={(event) => form.setValue("is_favorite", event.target.checked)}
                  type="checkbox"
                />
                Marcar como pieza importante
              </label>
            </div>
          </div>

          <div>
            <Label htmlFor="tags_input">Tags</Label>
            <Input
              id="tags_input"
              placeholder="canción, demo, idea, campaña, hook"
              {...form.register("tags_input")}
            />
            <p className="mt-2 text-xs text-muted-foreground">Sepáralos con comas. Se crearán automáticamente si no existen.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button disabled={isPending} type="submit">
              {isPending ? "Guardando..." : item ? "Guardar cambios" : "Crear pieza"}
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
