"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { emptyStates, noteTypeLabelMap, noteTypes } from "@/lib/constants/creatoros";
import type { CreativeItemNote } from "@/lib/types/app";
import { formatRelativeDate, formatTimestamp } from "@/lib/utils/format";
import { saveItemNoteAction } from "@/lib/actions/items";

export function ItemNotePanel({
  itemId,
  notes
}: {
  itemId: string;
  notes: CreativeItemNote[];
}) {
  const [content, setContent] = useState("");
  const [noteType, setNoteType] = useState<(typeof noteTypes)[number]>("general");
  const [timestamp, setTimestamp] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const sortedNotes = useMemo(
    () => [...notes].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    [notes]
  );

  function parseTimestamp(value: string) {
    if (!value.trim()) return null;

    const parts = value.split(":").map((segment) => Number(segment));
    if (parts.some(Number.isNaN)) return null;

    if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    }

    return parts[0] ?? null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notas de trabajo y referencias</CardTitle>
        <p className="text-sm leading-6 text-muted-foreground">
          Deja observaciones rápidas, letras, notas mentales o indicaciones con timestamp mientras revisas la
          pieza.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <form
          className="space-y-4 rounded-[28px] border border-input bg-white/60 p-4"
          onSubmit={(event) => {
            event.preventDefault();
            startTransition(async () => {
              const result = await saveItemNoteAction({
                content_text: content,
                creative_item_id: itemId,
                note_type: noteType,
                timestamp_seconds: parseTimestamp(timestamp)
              });

              if (!result.success) {
                toast.error(result.message);
                return;
              }

              toast.success(result.message);
              setContent("");
              setTimestamp("");
              router.refresh();
            });
          }}
        >
          <div className="grid gap-4 md:grid-cols-[0.8fr_0.5fr]">
            <div>
              <Label>Tipo de nota</Label>
              <Select
                onChange={(event) => setNoteType(event.target.value as (typeof noteTypes)[number])}
                options={noteTypes.map((type) => ({ label: noteTypeLabelMap[type], value: type }))}
                value={noteType}
              />
            </div>
            <div>
              <Label>Timestamp opcional</Label>
              <Input
                onChange={(event) => setTimestamp(event.target.value)}
                placeholder="02:13"
                value={timestamp}
              />
            </div>
          </div>
          <div>
            <Label>Contenido</Label>
            <Textarea
              onChange={(event) => setContent(event.target.value)}
              placeholder="Ej: en 02:13 debería cantar más agudo / esta frase funciona mejor en el coro / revisar textura visual del segundo bloque"
              value={content}
            />
          </div>
          <Button disabled={isPending || !content.trim()} type="submit">
            {isPending ? "Guardando..." : "Guardar nota"}
          </Button>
        </form>

        {sortedNotes.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-input bg-white/50 px-5 py-8 text-center">
            <p className="text-lg font-semibold">{emptyStates.notes.title}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{emptyStates.notes.description}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedNotes.map((note) => (
              <div className="rounded-[24px] border border-input bg-white/70 p-4" key={note.id}>
                <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded-full bg-muted px-3 py-1 font-medium text-foreground">
                    {noteTypeLabelMap[note.note_type]}
                  </span>
                  <span>{formatTimestamp(note.timestamp_seconds)}</span>
                  <span>{formatRelativeDate(note.created_at)}</span>
                </div>
                <p className="text-sm leading-7 text-foreground">{note.content_text}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
