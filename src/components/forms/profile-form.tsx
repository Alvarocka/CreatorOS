"use client";

import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveProfileAction } from "@/lib/actions/profile";
import type { AppDictionary } from "@/lib/i18n";
import type { Profile } from "@/lib/types/app";
import { profileSchema } from "@/lib/validations/profile";

type ProfileFormValues = {
  username: string;
  display_name: string;
  bio?: string;
  avatar_url?: string;
};

export function ProfileForm({
  profile,
  dictionary
}: {
  profile: Profile | null;
  dictionary: AppDictionary;
}) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      avatar_url: profile?.avatar_url || "",
      bio: profile?.bio || "",
      display_name: profile?.display_name || "",
      username: profile?.username || ""
    }
  });

  function submit(values: ProfileFormValues) {
    startTransition(async () => {
      const result = await saveProfileAction(values);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{dictionary.profile.title}</CardTitle>
        <p className="text-sm leading-6 text-muted-foreground">
          {dictionary.profile.description}
        </p>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={form.handleSubmit(submit)}>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <Label htmlFor="display_name">{dictionary.profile.displayName}</Label>
              <Input id="display_name" {...form.register("display_name")} />
            </div>
            <div>
              <Label htmlFor="username">{dictionary.profile.username}</Label>
              <Input id="username" {...form.register("username")} />
            </div>
          </div>
          <div>
            <Label htmlFor="bio">{dictionary.profile.bio}</Label>
            <Textarea
              id="bio"
              placeholder={dictionary.profile.bioPlaceholder}
              {...form.register("bio")}
            />
          </div>
          <div>
            <Label htmlFor="avatar_url">{dictionary.profile.avatarUrl}</Label>
            <Input id="avatar_url" placeholder={dictionary.profile.avatarPlaceholder} {...form.register("avatar_url")} />
          </div>
          <Button disabled={isPending} type="submit">
            {isPending ? dictionary.profile.saving : dictionary.profile.save}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
