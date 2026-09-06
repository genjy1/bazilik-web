import type { MetadataRoute } from "next";
import { PAGE_LAST_MODIFIED } from "@/lib/lastModified";
import { SITEMAP_ROUTES, absoluteUrl } from "@/lib/site";

/**
 * sitemap.xml. Список маршрутов живёт в lib/site.ts рядом с `SITE_URL`,
 * чтобы адрес и состав карты правились в одном месте.
 *
 * `lastModified` берётся из lib/lastModified.ts — даты, проставленные
 * рукой при содержательной правке, те же, что уходят в заголовок
 * `Last-Modified`. Раньше здесь стоял `new Date()`, то есть момент сборки,
 * и `lastmod` менялся на каждый деплой, даже когда правили зависимость или
 * стиль. Для поисковика это заявление «страница изменилась», сделанное там,
 * где ничего не менялось; Google на неточный `lastmod` отвечает тем, что
 * перестаёт доверять полю по всему сайту. Поэтому дата сборки сюда не
 * возвращается ни под каким видом.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return SITEMAP_ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: PAGE_LAST_MODIFIED[route.path],
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
