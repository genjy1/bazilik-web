import type { Metadata } from "next";
import { AmbientIngredients } from "@/components/AmbientIngredients";
import { AudienceHero } from "@/components/AudienceHero";
import { BackgroundFX } from "@/components/BackgroundFX";
import { CtaSection } from "@/components/CtaSection";
import { ExistingClientsSection } from "@/components/ExistingClientsSection";
import { Footer } from "@/components/Footer";
import { MarketplaceSection } from "@/components/MarketplaceSection";
import { Nav } from "@/components/Nav";
import { PainList } from "@/components/PainList";
import { Process } from "@/components/Process";
import { SectionDivider } from "@/components/SectionDivider";
import { WinWinSection } from "@/components/WinWinSection";
import { BasilikToggleProvider } from "@/lib/basilikToggle";
import { FOOTER_GROUPS_SPECIALISTS, NAV_LINKS_SPECIALISTS, PROS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Базилик для специалистов — планы питания вместо Word и PDF",
  description:
    "Конструктор планов для диетологов, нутрициологов и коучей: рецепты, автоматический КБЖУ, маркетплейс готовых планов и доступ для уже купивших клиентов.",
};

export default function SpecialistsPage() {
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
      <Nav links={NAV_LINKS_SPECIALISTS} />

      <main id="main">
        <AudienceHero
          eyebrow={PROS.eyebrow}
          h1={PROS.hero.h1}
          lead={PROS.hero.lead}
          showChain={false}
        />

        <SectionDivider />
        <PainList />

        <SectionDivider />
        <WinWinSection />

        <SectionDivider />
        <Process
          kickerN="04"
          title="Как это работает"
          lead="Три шага — от рецепта до тарелки клиента, без единого PDF."
          steps={PROS.process}
        />

        <SectionDivider />
        <MarketplaceSection />

        <SectionDivider />
        <ExistingClientsSection />

        <SectionDivider />
        <CtaSection final={PROS.final} hideRoute="/specialists" />
      </main>

      <Footer groups={FOOTER_GROUPS_SPECIALISTS} />
    </BasilikToggleProvider>
  );
}
