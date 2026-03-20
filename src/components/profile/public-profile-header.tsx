import { Globe2 } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Profile } from "@/lib/types/app";

export function PublicProfileHeader({ profile }: { profile: Profile }) {
  return (
    <div className="overflow-hidden rounded-[36px] border border-white/70 bg-studio-ink px-6 py-8 text-white shadow-soft md:px-10 md:py-12">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <Avatar
            className="h-16 w-16 rounded-[24px]"
            name={profile.display_name || profile.username}
            src={profile.avatar_url}
          />
          <div className="space-y-3">
            <Badge variant="sand">Perfil público</Badge>
            <div>
              <h1 className="text-4xl font-semibold">{profile.display_name || profile.username}</h1>
              <p className="mt-1 text-sm text-white/65">@{profile.username}</p>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-white/75">
              {profile.bio || "Un archivo creativo público construido desde CreatorOS."}
            </p>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-white/8 px-4 py-2 text-sm text-white/75">
          <Globe2 className="h-4 w-4" />
          creator showcase
        </div>
      </div>
    </div>
  );
}
