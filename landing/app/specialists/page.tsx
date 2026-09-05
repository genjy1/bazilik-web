import type { Metadata, ResolvingMetadata } from "next";
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
import { SPECIALISTS_PAGE_SCHEMA_JSON } from "@/lib/schema";
import {
  OG_SHARED,
  SPECIALISTS_DESCRIPTION,
  SPECIALISTS_TITLE,
  inheritedOgImages,
} from "@/lib/site";

/** Заголовок и описание — в site.ts: те же строки уходят в узел WebPage JSON-LD. */
const TITLE = SPECIALISTS_TITLE;

/**
 * Не `const metadata`, а `generateMetadata` — только ради картинки.
 *
 * Дочерний `openGraph` замещает родительский целиком, а не дополняет его,
 * поэтому объявленный здесь блок отрезал бы страницу от `opengraph-image.tsx`
 * в корне: `og:image` пропал бы, а `twitter:card` откатился бы в `summary`.
 * Через аргумент `parent` картинка родителя переносится явно (см.
 * `inheritedOgImages`) — так и описано в
 * docs/01-app/03-api-reference/04-functions/generate-metadata.md.
 */
export async function generateMetadata(
  _props: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: TITLE,
    description: SPECIALISTS_DESCRIPTION,
    /**
     * Раздел не входит в MVP и до запуска не должен попадать в выдачу.
     * Из sitemap.xml маршрут убран (см. `SITEMAP_ROUTES`), но карта сайта
     * индексацию не запрещает — она лишь помогает страницу найти. Запрет
     * даёт только `noindex`: страница остаётся открытой по прямой ссылке,
     * которую можно дать партнёру или клиенту, но в поиск не уходит.
     *
     * `follow` оставлен: со страницы есть ссылки на главную и в футер,
     * обрывать этот путь незачем.
     *
     * Снимать одновременно с возвратом маршрута в `SITEMAP_ROUTES`.
     */
    robots: {
      index: false,
      follow: true,
    },
    /**
     * Canonical остаётся и при `noindex`: он отвечает не за индексацию, а за
     * то, какой адрес считать основным, если страницу откроют по ссылке с
     * параметрами.
     */
    alternates: {
      canonical: "/specialists",
    },
    openGraph: {
      ...OG_SHARED,
      title: TITLE,
      description:
        "Конструктор планов для диетологов, нутрициологов и коучей: рецепты, автоматический КБЖУ и маркетплейс готовых планов.",
      url: "/specialists",
      images: await inheritedOgImages(parent, TITLE),
    },
  };
}

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
          title="Как это работает"
          lead="Три шага — от рецепта до тарелки клиента, без единого PDF."
          steps={PROS.process}
        />

        <SectionDivider />
        <MarketplaceSection />

        <SectionDivider />
        <ExistingClientsSection />

        <SectionDivider />
        <CtaSection final={PROS.final} hideRoutes={["/specialists"]} />
        {/* Узел WebPage этой страницы. Не InlineScript — тот подменяет type
            при гидратации, а это данные, и type обязан остаться
            application/ld+json. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: SPECIALISTS_PAGE_SCHEMA_JSON }}
        />
      </main>

      <Footer groups={FOOTER_GROUPS_SPECIALISTS} />
    </BasilikToggleProvider>
  );
}
