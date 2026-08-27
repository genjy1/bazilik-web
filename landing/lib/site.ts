/**
 * Канонический адрес сайта — один источник для `metadataBase`, карты сайта и
 * robots.txt. Если развести их по файлам, абсолютные URL рано или поздно
 * разойдутся, и поисковик посчитает `https://bazilik.ru/` и
 * `https://www.bazilik.ru/` разными страницами с одинаковым содержимым.
 *
 * Без протокола и с хвостовым слэшем `new URL(...)` в layout соберёт мусор,
 * поэтому строка ровно в таком виде.
 */
export const SITE_URL = "https://bazilik.ru";

export type SiteRoute = {
  path: string;
  changeFrequency: "monthly" | "yearly";
  priority: number;
};

/**
 * Маршруты, которые уходят в sitemap.xml.
 *
 * `/specialists` намеренно отсутствует в навигации MVP (см. `NAV_LINKS_HOME`
 * и `hideRoutes` в content.ts), но из индекса не исключён: убрать раздел из
 * меню и убрать его из поиска — разные решения. Пока внутренней ссылки нет,
 * карта сайта и есть единственный канал обнаружения этой страницы.
 *
 * `/cookies` — служебная страница: должна быть достижимой, но не должна
 * конкурировать в выдаче с продуктовыми, отсюда минимальный приоритет.
 *
 * `/home` в списке нет сознательно: он отдаёт 308 на `/` (см. next.config.ts),
 * а редиректы в карте сайта — ошибка обхода, а не подсказка.
 */
export const SITEMAP_ROUTES: readonly SiteRoute[] = [
  { path: "/", changeFrequency: "monthly", priority: 1 },
  { path: "/specialists", changeFrequency: "monthly", priority: 0.8 },
  { path: "/cookies", changeFrequency: "yearly", priority: 0.1 },
] as const;

/**
 * Абсолютный URL маршрута — для sitemap и любых полей, где нужен полный адрес.
 *
 * Хвостовой слэш срезается сознательно: `new URL("/", ...)` даёт
 * `https://bazilik.ru/`, а Next.js в `<link rel="canonical">` для корня пишет
 * `https://bazilik.ru` — без слэша. Разойдись они, карта сайта и canonical
 * указывали бы на два формально разных адреса одной страницы, то есть ровно
 * на ту неоднозначность, ради устранения которой canonical и ставится.
 */
export function absoluteUrl(path: string): string {
  const href = new URL(path, SITE_URL).href;
  return href.endsWith("/") ? href.slice(0, -1) : href;
}
