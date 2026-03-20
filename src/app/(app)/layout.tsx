import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { getDictionary } from "@/lib/i18n";
import { getCurrentLocale } from "@/lib/i18n/server";
import { getViewerContext } from "@/lib/data/creatoros";

export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const viewer = await getViewerContext();
  const locale = getCurrentLocale();
  const dictionary = getDictionary(locale);

  if (viewer.isConfigured && !viewer.user) {
    redirect("/login");
  }

  return (
    <AppShell dictionary={dictionary} isConfigured={viewer.isConfigured} profile={viewer.profile}>
      {children}
    </AppShell>
  );
}
