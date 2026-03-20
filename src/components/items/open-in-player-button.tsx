"use client";

import { Headphones } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/store/player-store";

export function OpenInPlayerButton({
  description,
  id,
  src,
  title
}: {
  description?: string | null;
  id: string;
  src?: string | null;
  title: string;
}) {
  const setTrack = usePlayerStore((state) => state.setTrack);

  return (
    <Button
      onClick={() => {
        if (!src) {
          toast.error("Este item todavía no tiene un audio/video listo para reproducir.");
          return;
        }

        setTrack({ description, id, src, title });
        toast.success("Reproductor listo abajo. Ya puedes seguir escribiendo.");
      }}
      variant="secondary"
    >
      <Headphones className="mr-2 h-4 w-4" />
      Abrir reproductor compacto
    </Button>
  );
}
