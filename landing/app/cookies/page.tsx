import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { Footer } from "@/components/Footer";
import { FOOTER_GROUPS_LEGAL } from "@/lib/content";
import { OG_SHARED, inheritedOgImages } from "@/lib/site";

const TITLE = "Использование cookie — Базилик";
const DESCRIPTION =
  "Информация об использовании файлов cookie на сайте Базилик.";

/**
 * Блок `openGraph` нужен целиком ради `url`: дочерний `openGraph` не
 * сливается с родительским, а замещает его — без своего блока страница
 * наследовала бы `og:url` корневого layout и представлялась бы главной
 * при репосте. Остальные поля возвращаются спредом из `OG_SHARED`, а
 * картинка — через `inheritedOgImages`, иначе она пропала бы вместе с
 * остальными унаследованными полями.
 */
export async function generateMetadata(
  _props: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: TITLE,
    description: DESCRIPTION,
    /**
     * Пока страница — один абзац «в разработке», в индексе ей нечего делать:
     * половина sitemap из заглушки — не то, чем встречать первого робота.
     * `follow` оставлен: ссылки из футера должны обходиться. Снимать вместе
     * с возвратом маршрута в `SITEMAP_ROUTES` (lib/site.ts), когда появится
     * текст.
     */
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: "/cookies",
    },
    openGraph: {
      ...OG_SHARED,
      title: TITLE,
      description: DESCRIPTION,
      url: "/cookies",
      images: await inheritedOgImages(parent, TITLE),
    },
  };
}

export default function CookiesPage() {
  return (
    <>
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-[1180px] items-center px-6 py-5">
          <Link
            href="/"
            className="flex min-h-11 items-center gap-2.5 text-[18px] font-extrabold tracking-tight"
          >
            <BrandMark className="size-6.5" />
            Базилик
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[720px] px-6 py-20">
        <h1 className="text-[28px] font-extrabold tracking-tight">
          Использование cookie
        </h1>
        <p className="mt-4 text-[15px] text-muted">
          Страница в разработке. Здесь появится подробное описание того, какие
          cookie использует сайт и для чего.
        </p>
      </main>

      <Footer groups={FOOTER_GROUPS_LEGAL} />
    </>
  );
}
