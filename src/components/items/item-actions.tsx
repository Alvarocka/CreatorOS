"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Archive, Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { archiveItemAction, deleteItemAction, duplicateItemAction } from "@/lib/actions/items";

export function ItemActions({ itemId }: { itemId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            const result = await duplicateItemAction(itemId);
            if (!result.success || !result.data) {
              toast.error(result.message);
              return;
            }

            toast.success(result.message);
            router.push(`/items/${result.data.id}`);
            router.refresh();
          });
        }}
        variant="outline"
      >
        <Copy className="mr-2 h-4 w-4" />
        Duplicar
      </Button>
      <Button
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            const result = await archiveItemAction(itemId);
            if (!result.success) {
              toast.error(result.message);
              return;
            }

            toast.success(result.message);
            router.refresh();
          });
        }}
        variant="outline"
      >
        <Archive className="mr-2 h-4 w-4" />
        Archivar
      </Button>
      <Button
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            const result = await deleteItemAction(itemId);
            if (!result.success) {
              toast.error(result.message);
              return;
            }

            toast.success(result.message);
            router.push("/library");
            router.refresh();
          });
        }}
        variant="destructive"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Eliminar
      </Button>
    </div>
  );
}
