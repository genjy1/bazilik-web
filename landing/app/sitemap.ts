import type { MetadataRoute } from "next";
import { SITEMAP_ROUTES, absoluteUrl } from "@/lib/site";

/**
 * sitemap.xml. Список маршрутов живёт в lib/site.ts рядом с `SITE_URL`,
 * чтобы адрес и состав карты правились в одном месте.
 *
 * `lastModified` не выставляется вовсе. Раньше здесь стоял `new Date()`, то
 * есть момент сборки, — и `lastmod` у обеих страниц менялся на каждый
 * деплой, даже когда правили зависимость или стиль. Для поисковика это
 * заявление «страница изменилась», сделанное там, где ничего не менялось;
 * Google на неточный `lastmod` отвечает тем, что перестаёт доверять полю по
 * всему сайту — и обесценивает его тогда, когда страница изменится
 * по-настоящему. Отсутствие поля читается как «дата неизвестна» и это
 * честно. Появятся настоящие даты правок — класть их в `SITEMAP_ROUTES`
 * рядом с маршрутом.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return SITEMAP_ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
