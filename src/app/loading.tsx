import { Skeleton } from "@/components/ui/skeleton";

export default function RootLoading() {
  return (
    <main className="container-shell py-10">
      <div className="space-y-6">
        <Skeleton className="h-12 w-60 rounded-full" />
        <Skeleton className="h-48 w-full rounded-3xl" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-40 rounded-3xl" />
          <Skeleton className="h-40 rounded-3xl" />
          <Skeleton className="h-40 rounded-3xl" />
        </div>
      </div>
    </main>
  );
}
