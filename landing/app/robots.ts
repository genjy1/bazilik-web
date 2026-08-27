import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

/**
 * robots.txt. Закрывать нечего: все три маршрута публичные, приватных зон и
 * параметризованных URL у лендинга нет.
 *
 * Главное здесь — не правила, а строка `Sitemap`: без неё карту сайта нужно
 * скармливать вручную через Search Console и Вебмастер, и до тех пор
 * `/specialists` остаётся необнаружимой (внутренних ссылок на неё нет).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
