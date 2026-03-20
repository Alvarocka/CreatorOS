import Link from "next/link";
import { notFound } from "next/navigation";

import { ItemCard } from "@/components/items/item-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPublicProjectBySlug } from "@/lib/data/creatoros";

export default async function PublicProjectPage({ params }: { params: { slug: string } }) {
  const data = await getPublicProjectBySlug(params.slug);

  if (!data) {
    notFound();
  }

  const author = (data.author || null) as { username?: string; display_name?: string | null } | null;

  return (
    <main className="container-shell space-y-6 py-8 md:py-12">
      <div className="space-y-3">
        <Badge variant="accent">Proyecto público</Badge>
        <h1 className="text-4xl font-semibold">{data.project.title}</h1>
        <p className="text-sm text-muted-foreground">
          Por{" "}
          {author?.username ? (
            <Link className="text-primary underline-offset-4 hover:underline" href={`/u/${author.username}`}>
              {author.display_name || author.username}
            </Link>
          ) : (
            <span>{author?.display_name || "Creator"}</span>
          )}
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Acerca del proyecto</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-7 text-muted-foreground">
            {data.project.description || "Proyecto público compartido desde CreatorOS."}
          </p>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.project.items?.map((item) => (
          <ItemCard href={item.share ? `/share/item/${item.share.slug}` : `/share/project/${params.slug}`} item={item} key={item.id} />
        ))}
      </div>
    </main>
  );
}
