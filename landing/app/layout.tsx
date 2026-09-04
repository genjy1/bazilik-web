import type { Metadata, Viewport } from "next";
import { CookieConsent } from "@/components/CookieConsent";
import { InlineScript } from "@/components/InlineScript";
import { HashScrollManager } from "@/components/HashScrollManager";
import { YandexMetrika } from "@/components/YandexMetrika";
import { SCHEMA_JSON } from "@/lib/schema";
import { HOME_TITLE, OG_SHARED, SITE_URL } from "@/lib/site";
import "./globals.css";

/**
 * Шрифт лендинга — тот же, что в приложениях: системный гротеск и системный
 * моноширинный (бренд-бук §04). SwiftUI рисует текст через `.system`, Compose —
 * через `FontFamily.Default`, то есть SF Pro на iOS и Roboto на Android; веб
 * повторяет это стеком в `--font-sans` / `--font-mono` в globals.css.
 *
 * От веб-шрифтов (Manrope + IBM Plex Mono) отказались: сайт расходился с
 * продуктом по начертанию. Заодно ушли запросы next/font и подмена метрик —
 * системный шрифт уже стоит на устройстве и рисуется первым кадром.
 */
/**
 * Прошлое описание занимало 193 знака при пороге ~160 и обрезалось ровно на
 * «план пересобирается под остат…» — на той самой механике, которая и есть
 * отличие продукта. Заодно ушёл «операционный слой планирования питания»:
 * это внутренняя формулировка, а не то, как о еде говорят дома.
 */
const DESCRIPTION =
  "Меню на неделю, список покупок и готовка по шагам. Базилик считает, что купленное ещё есть, и пересобирает план под остатки — без ручного учёта запасов.";

export const metadata: Metadata = {
  /**
   * Базовый адрес для всех URL-полей метаданных ниже и в дочерних сегментах:
   * с ним `canonical` и `og:url` пишутся относительными путями, а абсолютный
   * адрес собирается в одном месте. Без него относительный путь в таком поле
   * — ошибка сборки, а не тихая деградация.
   */
  metadataBase: new URL(SITE_URL),
  title: HOME_TITLE,
  description: DESCRIPTION,
  /**
   * Самоссылающийся canonical. У лендинга нет дублей по параметрам, но он
   * фиксирует одну версию адреса — иначе `/`, `/?utm_source=...` и вариант с
   * www расходятся как разные страницы с одинаковым текстом.
   */
  alternates: {
    canonical: "/",
  },
  openGraph: {
    ...OG_SHARED,
    /**
     * Тот же заголовок, что и в <title>: в ленте мессенджера ссылку видит
     * человек, который о продукте не слышал, и «меню на неделю» объясняет
     * карточку лучше, чем один слоган.
     */
    title: HOME_TITLE,
    description:
      "Меню на неделю без ручного учёта запасов: продукты переиспользуются между блюдами, список покупок собирается сам, план подстраивается под остатки.",
    url: "/",
  },
  /**
   * Иконки объявлены здесь целиком и осознанно. Пока в metadata есть поле
   * `icons`, файловые конвенции app/icon.* и app/apple-icon.* не работают:
   * Next перестаёт добавлять для них <link>, и положенный рядом файл молча
   * никуда не попадает. Новые иконки — сюда, а не файлом в app/.
   */
  icons: {
    icon: {
      url:
        "data:image/svg+xml," +
        encodeURIComponent(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50 88 C 30 66 30 28 50 12 C 70 28 70 66 50 88 Z" fill="#1F7A4D"/><path d="M50 82 L50 18" stroke="#F7F6F1" stroke-width="3.4" stroke-linecap="round"/></svg>`,
        ),
      type: "image/svg+xml",
    },

    /**
     * apple-touch-icon. Иконки манифеста iOS не читает вовсе, а SVG выше не
     * поддерживает — без этой строки «На экран «Домой»» подставил бы
     * скриншот страницы вместо логотипа.
     *
     * 180×180 — размер под @3x iPhone, единственный, который просит Apple.
     * Файл непрозрачный: альфа-канал iOS кладёт на чёрное, а не на фон
     * страницы. Скругление углов система рисует сама, поэтому в PNG его нет.
     *
     * Лежит в public/, а не в app/: рядом с остальным растром иконок и по
     * тому же адресу, где Safari ищет его сам, даже не прочитав <link>.
     */
    apple: {
      url: "/apple-touch-icon.png",
      sizes: "180x180",
      type: "image/png",
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#1F7A4D",
};

/**
 * Выполняется синхронно, до первой отрисовки:
 *
 * 1. Тема — иначе при сохранённой тёмной теме на мгновение мигнёт светлая.
 * 2. Класс `js` — под ним CSS прячет блоки, которые потом проявит GSAP.
 *    Скрытие навешивается только когда скрипты реально работают, иначе при
 *    упавшем или отключённом JS страница осталась бы пустой.
 *
 * См. docs/01-app/02-guides/preventing-flash-before-hydration.md
 */
const BOOT_SCRIPT = `(function(){var d=document.documentElement;d.classList.add("js");try{var t=localStorage.getItem("bazilik-theme");if(t==="light"||t==="dark")d.setAttribute("data-theme",t)}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ru"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <InlineScript html={BOOT_SCRIPT} />
        {/* JSON-LD, а не InlineScript: тот подменяет type на text/plain при
            гидратации, и разметка перестала бы читаться. Здесь скрипт
            ничего не выполняет — это данные, и type обязан остаться. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: SCHEMA_JSON }}
        />
      </head>
      {/* Расширения браузера дописывают в <body> свои атрибуты до гидратации
          (Grammarly, ColorZilla и подобные) — без этого React считает такой
          случай ошибкой гидратации у совершенно исправной страницы. */}
      <body className="antialiased" suppressHydrationWarning>
        <HashScrollManager />
        {children}
        <CookieConsent />
        <YandexMetrika />
      </body>
    </html>
  );
}

