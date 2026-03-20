import type { Metadata } from "next";

import "@/app/globals.css";
import { getCurrentLocale } from "@/lib/i18n/server";
import { AppProviders } from "@/providers/app-providers";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "CreatorOS",
    template: "%s | CreatorOS"
  },
  description:
    "CreatorOS organiza tu archivo creativo vivo: ideas, audios, notas, imágenes, proyectos y piezas públicas en un solo lugar.",
  openGraph: {
    title: "CreatorOS",
    description:
      "El hub creativo personal y público para capturar, organizar, reescribir y publicar tu trabajo.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = getCurrentLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
