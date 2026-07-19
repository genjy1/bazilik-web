import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Manrope } from "next/font/google";
import { InlineScript } from "@/components/InlineScript";
import "./globals.css";

/**
 * Бренд-бук требует гротеск с весом 800 и трекингом −0.03…−0.05em плюс
 * моноширинный в капсе для эйбрау и метрик. Manrope и JetBrains Mono
 * закрывают обе роли и, что критично для русского лендинга, имеют
 * полноценную кириллицу — иначе браузер подставил бы системный шрифт
 * и вся типографика поехала бы.
 *
 * next/font самостоятельно хостит файлы и подставляет метрики запасного
 * шрифта, поэтому внешних запросов в рантайме нет и текст не прыгает.
 */
const sans = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-brand-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-brand-mono",
  display: "swap",
});

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
      className={`${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <InlineScript html={BOOT_SCRIPT} />
      </head>
      {/* Расширения браузера дописывают в <body> свои атрибуты до гидратации
          (Grammarly, ColorZilla и подобные) — без этого React считает такой
          случай ошибкой гидратации у совершенно исправной страницы. */}
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
