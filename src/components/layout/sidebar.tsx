"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, Sparkles } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type { AppDictionary } from "@/lib/i18n";
import { appNavigation } from "@/lib/constants/creatoros";
import { cn } from "@/lib/utils/cn";
import type { Profile } from "@/lib/types/app";

export function Sidebar({
  profile,
  dictionary
}: {
  profile: Profile | null;
  dictionary: AppDictionary;
}) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[320px] flex-col gap-6 xl:flex">
      <div className="glass-panel p-5">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/12 bg-[linear-gradient(135deg,#ff7a00_0%,#ff2c96_58%,#7c3aed_100%)] text-2xl font-black text-white shadow-neon">
            CO
          </div>
          <div>
            <p className="text-3xl font-black tracking-[-0.04em] text-white">CreatorOS</p>
            <p className="text-base text-white/58">{dictionary.shell.brandCopy}</p>
          </div>
        </div>
        <Link className={cn(buttonVariants(), "h-14 w-full justify-start gap-3 px-6 text-xl")} href="/items/new?type=text">
          <Plus className="h-5 w-5" />
          {dictionary.common.newPiece}
        </Link>
        <nav className="mt-6 space-y-3">
          {appNavigation.map((item) => {
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                className={cn(
                  "flex items-center gap-3 rounded-[22px] border px-4 py-3.5 text-xl font-semibold tracking-[-0.02em] transition-all",
                  active
                    ? "border-white/14 bg-black/35 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_24px_rgba(0,0,0,0.35)]"
                    : "border-transparent text-white/72 hover:border-white/10 hover:bg-white/[0.05] hover:text-white"
                )}
                href={item.href}
                key={item.href}
              >
                <Icon className="h-5 w-5" />
                {dictionary.nav[item.labelKey]}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(45,31,45,0.9),rgba(24,22,33,0.98))] p-5 shadow-cosmic">
        <div className="absolute right-4 top-4 text-yellow-300">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="mb-4 flex items-center gap-3">
          <Avatar
            className="h-12 w-12"
            name={profile?.display_name || profile?.username || "Creator"}
            src={profile?.avatar_url}
          />
          <div>
            <p className="text-2xl font-black tracking-[-0.03em] text-white">
              {profile?.display_name || "Creator"}
            </p>
            <p className="text-base text-white/55">@{profile?.username || "preview"}</p>
          </div>
        </div>
        <Badge variant="warm">{dictionary.shell.publicProfileBadge}</Badge>
        <p className="mt-4 text-base leading-7 text-white/72">
          {dictionary.shell.publicProfileBody}
        </p>
        <div className="mt-4 rounded-[20px] border border-white/12 bg-black/24 px-4 py-3 text-base font-bold text-white">
          {dictionary.shell.publicProfileCta}
        </div>
      </div>
    </aside>
  );
}
