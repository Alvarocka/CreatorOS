"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { saveLocalePreferenceAction } from "@/lib/actions/preferences";
import type { AppDictionary, AppLocale } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export function PreferencesForm({
  locale,
  dictionary
}: {
  locale: AppLocale;
  dictionary: AppDictionary;
}) {
  const [isPending, startTransition] = useTransition();
  const [selectedLocale, setSelectedLocale] = useState<AppLocale>(locale);
  const router = useRouter();

  function submit() {
    startTransition(async () => {
      const result = await saveLocalePreferenceAction({ locale: selectedLocale });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.refresh();
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{dictionary.settings.languageTitle}</CardTitle>
        <p className="text-sm leading-6 text-muted-foreground">{dictionary.settings.languageBody}</p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <Label htmlFor="workspace-language">{dictionary.common.language}</Label>
          <Select
            className="mt-2"
            id="workspace-language"
            onChange={(event) => setSelectedLocale(event.target.value as AppLocale)}
            options={[
              { label: dictionary.common.spanish, value: "es" },
              { label: dictionary.common.english, value: "en" }
            ]}
            value={selectedLocale}
          />
        </div>
        <Button disabled={isPending} onClick={submit} type="button">
          {isPending ? dictionary.common.saving : dictionary.common.save}
        </Button>
      </CardContent>
    </Card>
  );
}
