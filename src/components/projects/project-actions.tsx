"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { deleteProjectAction } from "@/lib/actions/projects";

export function ProjectActions({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          const result = await deleteProjectAction(projectId);
          if (!result.success) {
            toast.error(result.message);
            return;
          }

          toast.success(result.message);
          router.push("/projects");
          router.refresh();
        });
      }}
      variant="destructive"
    >
      <Trash2 className="mr-2 h-4 w-4" />
      Eliminar proyecto
    </Button>
  );
}
