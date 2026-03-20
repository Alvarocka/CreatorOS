"use client";

import { useRef, useState } from "react";
import { Loader2, UploadCloud } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export function FileUploadField({
  accept,
  label,
  onChange,
  value
}: {
  accept?: string;
  label: string;
  onChange: (value: string) => void;
  value?: string;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(file?: File) {
    if (!file) return;
    setIsUploading(true);

    try {
      const supabase = createBrowserSupabaseClient();
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Necesitas iniciar sesión para subir archivos.");
        return;
      }

      const extension = file.name.split(".").pop() || "bin";
      const path = `${user.id}/${crypto.randomUUID()}.${extension}`;
      const { error } = await supabase.storage.from("creative-assets").upload(path, file, {
        cacheControl: "3600",
        upsert: false
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      onChange(path);
      toast.success("Archivo subido correctamente.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No pudimos subir el archivo.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      <div className="flex flex-col gap-3 rounded-3xl border border-dashed border-input bg-white/60 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
            type="button"
            variant="outline"
          >
            {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
            {isUploading ? "Subiendo..." : "Seleccionar archivo"}
          </Button>
          <p className="text-xs text-muted-foreground">O pega una URL/path manualmente si ya existe en storage.</p>
        </div>
        <input
          accept={accept}
          className="hidden"
          onChange={(event) => handleFileChange(event.target.files?.[0])}
          ref={inputRef}
          type="file"
        />
        <Input onChange={(event) => onChange(event.target.value)} placeholder="https://... o path del bucket" value={value || ""} />
      </div>
    </div>
  );
}
