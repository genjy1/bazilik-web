import type { Metadata } from "next";
import { AudienceSection } from "@/components/AudienceSection";
import { BackgroundFX } from "@/components/BackgroundFX";
import { CtaSection } from "@/components/CtaSection";
import { Footer } from "@/components/Footer";
import { Hypotheses } from "@/components/Hypotheses";
import { Nav } from "@/components/Nav";
import { Process } from "@/components/Process";
import { SectionDivider } from "@/components/SectionDivider";
import { ProsPanel } from "@/components/panels/ProsPanel";
import { FOOTER_GROUPS_SPECIALISTS, NAV_LINKS_SPECIALISTS, PROS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Базилик для специалистов — конструктор планов питания",
  description:
    "Конструктор планов вместо Word и Excel: рецепты, автоматический КБЖУ, список покупок и маркетплейс готовых планов.",
};

export default function SpecialistsPage() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-100 focus:rounded-br-xl focus:bg-accent focus:px-4 focus:py-2.5 focus:text-on-accent"
      >
        К содержимому
      </a>

      <BackgroundFX />
      <Nav links={NAV_LINKS_SPECIALISTS} />

      <main id="main">
        <AudienceSection
          id="pros"
          eyebrow={PROS.eyebrow}
          title={PROS.title}
          lead={PROS.lead}
          checks={PROS.checks}
          media={<ProsPanel />}
        />

        <SectionDivider />
        <Process />

        <SectionDivider />
        <Hypotheses />

        <SectionDivider />
        <CtaSection />
      </main>

      <Footer groups={FOOTER_GROUPS_SPECIALISTS} />
    </>
  );
}
