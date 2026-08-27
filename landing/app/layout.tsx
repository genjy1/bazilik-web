import type { Metadata, Viewport } from "next";
import { CookieConsent } from "@/components/CookieConsent";
import { InlineScript } from "@/components/InlineScript";
import { HashScrollManager } from "@/components/HashScrollManager";
import { YandexMetrika } from "@/components/YandexMetrika";
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
const DESCRIPTION =
  "Базилик — операционный слой планирования питания. Неделя собирается на переиспользование ингредиентов, список покупок появляется сам, план пересобирается под остатки. Без ручного учёта запасов.";

export const metadata: Metadata = {
  title: "Базилик — готовь то, что уже есть",
  description: DESCRIPTION,
  openGraph: {
    title: "Базилик — готовь то, что уже есть",
    description:
      "Планирование питания без ручного учёта: неделя на переиспользование, список сам, план подстраивается под остатки.",
    locale: "ru_RU",
    type: "website",
  },
  icons: {
    icon: {
      url:
        "data:image/svg+xml," +
        encodeURIComponent(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50 88 C 30 66 30 28 50 12 C 70 28 70 66 50 88 Z" fill="#1F7A4D"/><path d="M50 82 L50 18" stroke="#F7F6F1" stroke-width="3.4" stroke-linecap="round"/></svg>`,
        ),
      type: "image/svg+xml",
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

