import { itemTypes } from "@/lib/constants/creatoros";
import { getWorkspaceOptions } from "@/lib/data/creatoros";
import { PageHeader } from "@/components/shared/page-header";
import { ItemForm } from "@/components/forms/item-form";

export default async function NewItemPage({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const data = await getWorkspaceOptions();
  const requestedType = typeof searchParams.type === "string" ? searchParams.type : "text";
  const preselectedType = itemTypes.includes(requestedType as (typeof itemTypes)[number])
    ? (requestedType as (typeof itemTypes)[number])
    : "text";

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Nueva pieza"
        description="Captura una idea en el formato que tengas más cerca ahora mismo. Luego podrás reorganizarla, editarla, archivarla o publicarla."
        title="Crear contenido"
      />
      <ItemForm preselectedType={preselectedType} projects={data.projects} />
    </div>
  );
}
