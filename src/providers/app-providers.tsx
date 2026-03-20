"use client";

import { Toaster } from "sonner";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          classNames: {
            toast: "rounded-2xl border border-border bg-card text-card-foreground shadow-card",
            title: "font-medium",
            description: "text-sm text-muted-foreground"
          }
        }}
      />
    </>
  );
}
