import type { Metadata } from "next";
import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { Footer } from "@/components/Footer";
import { FOOTER_GROUPS_LEGAL } from "@/lib/content";

export const metadata: Metadata = {
  title: "Использование cookie — Базилик",
  description: "Информация об использовании файлов cookie на сайте Базилик.",
  alternates: {
    canonical: "/cookies",
  },
  /**
   * Блок нужен целиком ради `url`: дочерний `openGraph` не сливается с
   * родительским, а замещает его. Без своего блока страница наследовала бы
   * `og:url` корневого layout и представлялась бы главной при репосте.
   */
  openGraph: {
    title: "Использование cookie — Базилик",
    description: "Информация об использовании файлов cookie на сайте Базилик.",
    url: "/cookies",
    siteName: "Базилик",
    locale: "ru_RU",
    type: "website",
  },
};

export default function CookiesPage() {
  return (
    <>
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-[1180px] items-center px-6 py-5">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-[18px] font-extrabold tracking-tight"
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
