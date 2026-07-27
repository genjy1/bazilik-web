import type { Metadata } from "next";
import { AudienceSection } from "@/components/AudienceSection";
import { BackgroundFX } from "@/components/BackgroundFX";
import { CtaSection } from "@/components/CtaSection";
import { Footer } from "@/components/Footer";
import { Hypotheses } from "@/components/Hypotheses";
import { Nav } from "@/components/Nav";
import { Process } from "@/components/Process";
import { SectionDivider } from "@/components/SectionDivider";
import { HomePanel } from "@/components/panels/HomePanel";
import { FOOTER_GROUPS_HOME, HOME, NAV_LINKS_HOME } from "@/lib/content";

export const metadata: Metadata = {
  title: "Базилик дома — план недели без «что на ужин»",
  description:
    "Купленный план ложится в календарь. Дальше — открыть текущий приём пищи и готовить пошагово, без «что на ужин» и списков от руки.",
};

export default function HomePage() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-100 focus:rounded-br-xl focus:bg-accent focus:px-4 focus:py-2.5 focus:text-on-accent"
      >
        К содержимому
      </a>

      <BackgroundFX />
      <Nav links={NAV_LINKS_HOME} />

      <main id="main">
        <AudienceSection
          id="home"
          eyebrow={HOME.eyebrow}
          title={
            <>
              План твоего специалиста —{" "}
              <br />
              которому легко следовать
            </>
          }
          lead={HOME.lead}
          checks={HOME.checks}
          media={<HomePanel />}
        />

        <SectionDivider />
        <Process />

        <SectionDivider />
        <Hypotheses />

        <SectionDivider />
        <CtaSection />
      </main>

      <Footer groups={FOOTER_GROUPS_HOME} />
    </>
  );
}
