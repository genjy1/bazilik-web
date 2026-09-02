import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";

/**
 * Структурированные данные (JSON-LD) для всего сайта.
 *
 * Три сущности одним графом со ссылками через `@id`, а не тремя отдельными
 * блоками: так поисковик и языковые модели видят, что организация, сайт и
 * приложение — это одно и то же «Базилик», а не три совпадения по названию.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * Чего здесь нет и почему — это не недоделка, а требование `PRODUCT.md`
 * и `product-marketing.md`:
 *
 * • `aggregateRating` и `review` — отзывов не существует. Выдуманный рейтинг
 *   это и нарушение правил Google о разметке, и прямой запрет бренд-бука.
 * • `offers` и `price` — цены для b2c не определены. Для специалистов есть
 *   «комиссия только с продажи», но это не `Offer` с числом.
 * • `downloadUrl`, `installUrl`, `operatingSystem` — приложение ещё не
 *   опубликовано, ссылок в сторы нет. Отдельно: строки «iOS» и «Android»
 *   на текущей главной не встречаются вовсе (остались в мёртвом `HERO.pills`),
 *   а разметка не должна утверждать больше, чем говорит страница.
 *
 * Когда appstore-ссылки и цены появятся — добавлять сюда, не раньше.
 * ─────────────────────────────────────────────────────────────────────────
 */

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const APPLICATION_ID = `${SITE_URL}/#application`;

const SCHEMA_GRAPH = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/logo.svg"),
      },
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: SITE_URL,
      name: SITE_NAME,
      inLanguage: "ru-RU",
      publisher: { "@id": ORGANIZATION_ID },
    },
    {
      "@type": "SoftwareApplication",
      "@id": APPLICATION_ID,
      name: SITE_NAME,
      applicationCategory: "LifestyleApplication",
      inLanguage: "ru-RU",
      description:
        "Планирует неделю питания без ручного учёта запасов: меню на неделю, список покупок сразу на всю неделю и готовка по шагам. Неделя собирается на переиспользование ингредиентов, а план пересобирается под остатки.",
      publisher: { "@id": ORGANIZATION_ID },
    },
  ],
};

/**
 * `<` экранируется, иначе строка вида `</script>` внутри значения закрыла бы
 * тег раньше времени. Данные здесь свои и статичные, но правило дешёвое, а
 * забыть его в момент, когда в граф попадёт пользовательский текст, легко.
 *
 * Константа, а не функция: граф не зависит ни от маршрута, ни от запроса, а
 * layout вставляет его в каждую страницу — незачем сериализовать объект и
 * гонять регулярку по всей строке на каждый рендер.
 */
export const SCHEMA_JSON = JSON.stringify(SCHEMA_GRAPH).replace(
  /</g,
  "\\u003c",
);
