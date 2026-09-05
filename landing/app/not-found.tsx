import type { Metadata } from "next";
import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { FOOTER_GROUPS_LEGAL } from "@/lib/content";
import { OG_SHARED } from "@/lib/site";

/**
 * Страница 404 для всех адресов, которых нет.
 *
 * Без этого файла Next отдаёт свою заглушку: «404 This page could not be
 * found.» по-английски на сайте с `lang="ru"`, без шапки, футера и ссылки на
 * главную — человек по битой ссылке упирается в тупик. Статус 404 Next
 * ставит сам, как и `<meta name="robots" content="noindex">`.
 *
 * Раскладка та же, что у /cookies: шапка со знаком, узкая колонка, футер со
 * ссылками на разделы — чтобы отсюда было куда пойти.
 */
const TITLE = "Страница не найдена — Базилик";
const DESCRIPTION = "Такого адреса на сайте Базилик нет.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  /**
   * Корневой layout ставит canonical и `og:url` на главную, и без
   * переопределения страница 404 наследовала бы их — заявляла бы себя
   * копией главной. У несуществующего адреса канонической версии нет.
   * Блок `openGraph` замещает родительский целиком, поэтому `url` здесь
   * просто не указан; картинка карточки страницы 404 не нужна.
   */
  alternates: {
    canonical: null,
  },
  openGraph: {
    ...OG_SHARED,
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function NotFound() {
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
        <p className="eyebrow">Ошибка 404</p>
        <h1 className="mt-3.5 text-[28px] font-extrabold tracking-tight">
          Страница не найдена
        </h1>
        <p className="mt-4 max-w-[52ch] text-[15px] text-muted">
          Такого адреса на сайте нет: ссылка устарела или в ней опечатка.
          Всё, что есть, — на главной.
        </p>
        <div className="mt-8">
          <Button href="/" withArrow>
            На главную
          </Button>
        </div>
      </main>

      <Footer groups={FOOTER_GROUPS_LEGAL} />
    </>
  );
}
