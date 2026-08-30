import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

/**
 * robots.txt. Через `Disallow` здесь не закрыто ничего, и это осознанно:
 * запрет обхода мешает роботу прочитать страницу, а значит — увидеть на ней
 * `noindex`. Единственная закрытая страница, `/specialists`, закрыта именно
 * мета-тегом, поэтому обход ей нужен.
 *
 * Главное здесь — не правила, а строка `Sitemap`: без неё карту сайта
 * пришлось бы вручную скармливать Search Console и Вебмастеру.
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
