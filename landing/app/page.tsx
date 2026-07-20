import { AudienceLinks } from "@/components/AudienceLinks";
import { BackgroundFX } from "@/components/BackgroundFX";
import { CtaSection } from "@/components/CtaSection";
import { Engine } from "@/components/Engine";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Hypotheses } from "@/components/Hypotheses";
import { Nav } from "@/components/Nav";
import { Problem } from "@/components/Problem";
import { Process } from "@/components/Process";
import { RecipeAssembly } from "@/components/RecipeAssembly";
import { ProofStrip } from "@/components/ProofStrip";
import { SectionDivider } from "@/components/SectionDivider";
import { NAV_LINKS_ROOT } from "@/lib/content";

export default function Page() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-100 focus:rounded-br-xl focus:bg-accent focus:px-4 focus:py-2.5 focus:text-on-accent"
      >
        К содержимому
      </a>

      <BackgroundFX />
      <Nav links={NAV_LINKS_ROOT} />

      <main id="main">
        <Hero />
        <ProofStrip />
        <Problem />

        {/* Главная механика: продукты собираются в блюдо, блюдо распадается
            в КБЖУ и список покупок. Полноэкранная закреплённая сцена, поэтому
            обходится без разделителей вокруг. */}
        <RecipeAssembly />

        <Engine />

        <SectionDivider />
        {/* Специалисты (b2b2c) и дома (b2c) — разные страницы, здесь только
            развилка между ними. */}
        <AudienceLinks />

        <SectionDivider />
        <Process />

        <SectionDivider />
        <Hypotheses />

        <SectionDivider />
        <CtaSection />
      </main>

      <Footer />
    </>
  );
}
