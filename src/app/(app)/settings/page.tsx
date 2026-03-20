import Link from "next/link";

import { PreferencesForm } from "@/components/forms/preferences-form";
import { ProfileForm } from "@/components/forms/profile-form";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getViewerContext } from "@/lib/data/creatoros";
import { getDictionary } from "@/lib/i18n";
import { getCurrentLocale } from "@/lib/i18n/server";
import { logoutAction } from "@/lib/actions/auth";

export default async function SettingsPage() {
  const viewer = await getViewerContext();
  const locale = getCurrentLocale();
  const dictionary = getDictionary(locale);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={dictionary.settings.eyebrow}
        description={dictionary.settings.description}
        title={dictionary.settings.title}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <ProfileForm dictionary={dictionary} profile={viewer.profile} />
        <div className="space-y-6">
          <PreferencesForm dictionary={dictionary} locale={locale} />
          <Card>
            <CardHeader>
              <CardTitle>{dictionary.settings.publicUrlTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
              <Badge variant="accent">{dictionary.settings.publicUrlBadge}</Badge>
              <p>
                {dictionary.settings.publicUrlBody}{" "}
                <Link className="text-primary underline-offset-4 hover:underline" href={viewer.profile?.username ? `/u/${viewer.profile.username}` : "#"}>
                  /u/{viewer.profile?.username || "username"}
                </Link>
              </p>
              <p>{dictionary.settings.publicUrlHint}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{dictionary.settings.sessionTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
              <p>{dictionary.settings.sessionBody}</p>
              <form action={logoutAction}>
                <button className="rounded-full border border-white/12 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(2,6,23,0.24)] transition-colors hover:bg-white/[0.1]" type="submit">
                  {dictionary.common.logout}
                </button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
