"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { AppDictionary } from "@/lib/i18n";
import { appNavigation } from "@/lib/constants/creatoros";
import { cn } from "@/lib/utils/cn";

export function MobileNav({
  dictionary
}: {
  dictionary: AppDictionary;
}) {
  const pathname = usePathname();

  return (
    <div className="fixed inset-x-4 bottom-4 z-40 rounded-full border border-white/10 bg-[#0d1324]/90 p-2 shadow-cosmic backdrop-blur-xl xl:hidden">
      <div className="grid grid-cols-5 gap-1">
        {appNavigation.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);
          return (
            <Link
              className={cn(
                "flex flex-col items-center gap-1 rounded-full px-2 py-2 text-[10px] font-medium",
                active ? "bg-white/[0.08] text-white" : "text-white/58"
              )}
              href={item.href}
              key={item.href}
            >
              <Icon className="h-4 w-4" />
              {dictionary.nav[item.labelKey]}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
