import type { Metadata } from "next";
import { AmbientIngredients } from "@/components/AmbientIngredients";
import { AudienceHero } from "@/components/AudienceHero";
import { BackgroundFX } from "@/components/BackgroundFX";
import { ComparisonSection } from "@/components/ComparisonSection";
import { CtaSection } from "@/components/CtaSection";
import { DishAssemblyScene } from "@/components/DishAssemblyScene";
import { Footer } from "@/components/Footer";
import { GoalsSection } from "@/components/GoalsSection";
import { Nav } from "@/components/Nav";
import { PainChaos } from "@/components/PainChaos";
import { SectionDivider } from "@/components/SectionDivider";
import { TakesSection } from "@/components/TakesSection";
import { BasilikToggleProvider } from "@/lib/basilikToggle";
import { FOOTER_GROUPS_HOME, HOME, NAV_LINKS_HOME } from "@/lib/content";

export const metadata: Metadata = {
  title: "Базилик дома — готовь то, что уже есть",
  description:
    "Меню на неделю, список покупок и готовка по шагам — без «что на ужин» и без выброшенной еды.",
};

export default function HomePage() {
  return (
    <BasilikToggleProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-100 focus:rounded-br-xl focus:bg-accent focus:px-4 focus:py-2.5 focus:text-on-accent"
      >
        К содержимому
      </a>

      <BackgroundFX />
      <AmbientIngredients />
      <Nav links={NAV_LINKS_HOME} />

      <main id="main">
        <AudienceHero
          eyebrow={HOME.eyebrow}
          h1={
            <>
              {HOME.hero.titleTop} <span className="text-accent-deep">{HOME.hero.titleAccent}</span>
            </>
          }
          lead={HOME.hero.lead}
          caption={HOME.hero.chainCaption}
        />

        <SectionDivider />
        <PainChaos />

        <SectionDivider />
        <TakesSection />

        <DishAssemblyScene />

        <SectionDivider />
        <ComparisonSection />

        <SectionDivider />
        <GoalsSection />

        <SectionDivider />
        <CtaSection final={HOME.final} showChain hideRoute="/home" />
      </main>

      <Footer groups={FOOTER_GROUPS_HOME} />
    </BasilikToggleProvider>
  );
}
