import type { MetadataRoute } from "next";
import { SITEMAP_ROUTES, absoluteUrl } from "@/lib/site";

/**
 * sitemap.xml. Список маршрутов живёт в lib/site.ts рядом с `SITE_URL`,
 * чтобы адрес и состав карты правились в одном месте.
 *
 * `lastModified` берётся на момент сборки: у лендинга нет CMS и дат
 * публикации, а выдумывать более точное значение нечестно — поисковик всё
 * равно сверяет его с тем, что реально отдал сервер.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return SITEMAP_ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
