import Link from "next/link";

import { CtaBanner } from "@/components/marketing/cta-banner";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { Hero } from "@/components/marketing/hero";
import { ProductPreview } from "@/components/marketing/product-preview";

export default function LandingPage() {
  return (
    <main className="pb-10">
      <header className="container-shell flex items-center justify-between py-5">
        <Link className="flex items-center gap-3" href="/">
          <div className="rounded-2xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">
            CO
          </div>
          <div>
            <p className="font-semibold">CreatorOS</p>
            <p className="text-xs text-muted-foreground">Archivo creativo personal y público</p>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <Link className="rounded-full border border-input bg-white/80 px-4 py-2 text-sm" href="/login">
            Login
          </Link>
          <Link className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground" href="/signup">
            Registrarme
          </Link>
        </div>
      </header>
      <Hero />
      <FeatureGrid />
      <ProductPreview />
      <CtaBanner />
    </main>
  );
}
