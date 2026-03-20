import Link from "next/link";
import { Search, Settings } from "lucide-react";

import { GlobalMediaPlayer } from "@/components/layout/global-media-player";
import { MobileNav } from "@/components/layout/mobile-nav";
import { QuickCaptureFab } from "@/components/layout/quick-capture-fab";
import { Sidebar } from "@/components/layout/sidebar";
import { SetupNotice } from "@/components/shared/setup-notice";
import { Avatar } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import type { AppDictionary } from "@/lib/i18n";
import type { Profile } from "@/lib/types/app";
import { cn } from "@/lib/utils/cn";

export function AppShell({
  children,
  profile,
  isConfigured,
  dictionary
}: {
  children: React.ReactNode;
  profile: Profile | null;
  isConfigured: boolean;
  dictionary: AppDictionary;
}) {
  return (
    <div className="min-h-screen">
      <div className="container-shell py-4 lg:py-7">
        <div className="flex gap-6 xl:gap-8">
          <Sidebar dictionary={dictionary} profile={profile} />
          <div className="min-w-0 flex-1 space-y-6">
            <header className="glass-panel relative overflow-hidden px-5 py-4 sm:px-6">
              <div className="absolute inset-y-0 right-0 w-52 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15),transparent_62%)]" />
              <div className="absolute left-8 top-0 h-16 w-16 rounded-full bg-fuchsia-500/10 blur-2xl" />
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="space-y-2">
                  <p className="text-[11px] uppercase tracking-[0.5em] text-white/42">CreatorOS</p>
                  <p className="max-w-3xl text-xl font-black tracking-[-0.04em] text-white sm:text-3xl">
                    {dictionary.shell.banner}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    className="flex h-14 min-w-[220px] flex-1 items-center gap-3 rounded-full border border-white/12 bg-white/[0.04] px-5 text-base text-white/74 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_16px_32px_rgba(2,6,23,0.28)] transition-all hover:border-white/20 hover:text-white sm:min-w-[320px]"
                    href="/search"
                  >
                    <Search className="h-5 w-5" />
                    {dictionary.shell.searchPlaceholder}
                  </Link>
                  <Link
                    className={cn(
                      buttonVariants({ size: "icon", variant: "outline" }),
                      "h-14 w-14 rounded-full"
                    )}
                    href="/settings"
                  >
                    <Settings className="h-5 w-5" />
                  </Link>
                  <div className="flex items-center gap-3 rounded-full border border-white/12 bg-white/[0.05] px-2 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_16px_32px_rgba(2,6,23,0.28)]">
                    <Avatar
                      className="h-12 w-12"
                      name={profile?.display_name || profile?.username || "Creator"}
                      src={profile?.avatar_url}
                    />
                    <div className="hidden min-w-[92px] text-left sm:block">
                      <p className="text-base font-bold leading-none text-white">
                        {profile?.display_name || "Creator"}
                      </p>
                      <p className="mt-1 text-sm text-white/55">@{profile?.username || "preview"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {!isConfigured ? <SetupNotice /> : null}

            <main className="pb-36 lg:pb-10">{children}</main>
          </div>
        </div>
      </div>
      <QuickCaptureFab label={dictionary.common.quickCapture} />
      <MobileNav dictionary={dictionary} />
      <GlobalMediaPlayer />
    </div>
  );
}
