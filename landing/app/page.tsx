import { AmbientIngredients } from "@/components/AmbientIngredients";
import { AudienceHero } from "@/components/AudienceHero";
import { BackgroundFX } from "@/components/BackgroundFX";
import { ComparisonSection } from "@/components/ComparisonSection";
import { CtaSection } from "@/components/CtaSection";
import { Footer } from "@/components/Footer";
import { GoalsSection } from "@/components/GoalsSection";
import { Nav } from "@/components/Nav";
import { PainChaos } from "@/components/PainChaos";
import { PhoneStepsScene } from "@/components/PhoneStepsScene";
import { SectionDivider } from "@/components/SectionDivider";
import { TakesSection } from "@/components/TakesSection";
import { BasilikToggleProvider } from "@/lib/basilikToggle";
import { FOOTER_GROUPS_HOME, HOME, NAV_LINKS_HOME } from "@/lib/content";

export default function Page() {
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
              <span className="block">{HOME.hero.titleTop}</span>
              <span className="block text-accent-deep">{HOME.hero.titleAccent}</span>
            </>
          }
          lead={HOME.hero.lead}
          caption={HOME.hero.chainCaption}
          size="lg"
        />

        <SectionDivider />
        <PainChaos />

        <SectionDivider />
        <TakesSection />

        <PhoneStepsScene />

        <SectionDivider />
        <ComparisonSection />

        <SectionDivider />
        <GoalsSection />

        <SectionDivider />
        {/* Аудитория «дома» теперь и есть главная, поэтому карточка «Дома»
            вела бы на саму себя, а «Специалистам» в MVP нет вовсе — развилка
            «в свой сценарий» из финального блока убрана целиком. */}
        <CtaSection final={HOME.final} hideRoutes={["/", "/specialists"]} />
      </main>

      <Footer groups={FOOTER_GROUPS_HOME} />
    </BasilikToggleProvider>
  );
}
