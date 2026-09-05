import { HOME, PROS } from "@/lib/content";
import {
  HOME_DESCRIPTION,
  HOME_TITLE,
  OG_IMAGE_PATH,
  OG_IMAGE_SIZE,
  SITE_NAME,
  SITE_NAME_LATIN,
  SITE_URL,
  SPECIALISTS_DESCRIPTION,
  SPECIALISTS_TITLE,
  absoluteUrl,
} from "@/lib/site";

/**
 * Структурированные данные (JSON-LD) для всего сайта.
 *
 * Три сущности одним графом со ссылками через `@id`, а не тремя отдельными
 * блоками: так поисковик и языковые модели видят, что организация, сайт и
 * приложение — это одно и то же «Базилик», а не три совпадения по названию.
 * Узлы страниц (`WebPage`, `FAQPage`) живут ниже отдельными константами:
 * этот граф вставляется в layout на каждый маршрут, а страница у каждого
 * маршрута своя.
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
 *   опубликовано, ссылок в сторы нет. Отдельно: строк «iOS» и «Android»
 *   на текущей главной нет вовсе, а разметка не должна утверждать больше,
 *   чем говорит страница.
 * • `sameAs`, `contactPoint`, `email` у организации — соцсетей и контактов
 *   на сайте нет, и он их сознательно не собирает (см. последний вопрос FAQ).
 * • `datePublished` / `dateModified` у страниц — дат на страницах нет, а
 *   выдуманная дата хуже отсутствующей (см. историю `lastmod` в sitemap).
 * • `BreadcrumbList` — на страницах нет хлебных крошек; разметка навигации,
 *   которой не видно, противоречит правилам Google.
 * • `HowTo` для «Три шага — и неделя спланирована» — это шаги продукта, а
 *   не инструкция, которую читатель может выполнить сам; Google расширенный
 *   сниппет HowTo больше не показывает, а Яндекс его не поддерживает.
 *
 * Когда appstore-ссылки и цены появятся — добавлять сюда, не раньше.
 *
 * Что здесь есть сверх минимума и зачем:
 *
 * • `alternateName: "Bazilik"` — латинское написание уже стоит в футере
 *   («Базилик · Bazilik») и в домене. По слову «Базилик» поиск и языковые
 *   модели находят траву; второе имя — ещё одна зацепка, что речь о продукте.
 * • `featureList` — то, что страница и так говорит текстом, но списком:
 *   модели, отвечающие на «что умеет X», извлекают перечень охотнее прозы.
 * • `audience` у приложения — «Тем, кто отвечает за еду дома», подпись над
 *   H1 главной. Не выдумка про сегмент, а буквально то, что видно.
 * ─────────────────────────────────────────────────────────────────────────
 */

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const APPLICATION_ID = `${SITE_URL}/#application`;

/** `@id` узла WebPage — адрес страницы плюс `#webpage`, как у Yoast и Rank Math. */
const webPageId = (path: string) => `${absoluteUrl(path)}/#webpage`;

const SCHEMA_GRAPH = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: SITE_NAME,
      alternateName: SITE_NAME_LATIN,
      url: SITE_URL,
      /** Та же строка, что первой фразой в public/llms.txt. */
      description:
        "Базилик — приложение, которое планирует неделю питания без ручного учёта запасов.",
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
      alternateName: SITE_NAME_LATIN,
      url: SITE_URL,
      applicationCategory: "LifestyleApplication",
      inLanguage: "ru-RU",
      description:
        "Планирует неделю питания без ручного учёта запасов: меню на неделю, список покупок сразу на всю неделю и готовка по шагам. Неделя собирается на переиспользование ингредиентов, а план пересобирается под остатки.",
      /**
       * Каждый пункт — формулировка с главной, не из бэклога продукта:
       * языковые модели читают этот список как перечень возможностей, и он
       * не должен обещать того, чего страница не показывает.
       */
      featureList: [
        "Меню на неделю",
        "Список покупок сразу на всю неделю",
        "Готовка по шагам",
        "Без ручного учёта запасов",
        "Переиспользование продуктов между блюдами недели",
        "Пересборка плана под остатки",
        "Калории и БЖУ без калькуляторов",
      ],
      audience: {
        "@type": "Audience",
        audienceType: HOME.eyebrow,
      },
      publisher: { "@id": ORGANIZATION_ID },
    },
  ],
};

/**
 * `<` экранируется, иначе строка вида `</script>` внутри значения закрыла бы
 * тег раньше времени. Данные здесь свои и статичные, но правило дешёвое, а
 * забыть его в момент, когда в граф попадёт пользовательский текст, легко.
 *
 * Константы, а не функции: графы не зависят от запроса, а layout и страницы
 * вставляют их в каждый рендер — незачем сериализовать объект и гонять
 * регулярку по всей строке каждый раз.
 */
const escapeJsonLd = (json: string) => json.replace(/</g, "\\u003c");

export const SCHEMA_JSON = escapeJsonLd(JSON.stringify(SCHEMA_GRAPH));

/**
 * Узел WebPage конкретного маршрута.
 *
 * `name` и `description` — те же константы, что уходят в `<title>` и
 * `<meta name="description">` (site.ts), так что разметка не может
 * разойтись с тем, что видит поисковик в head. `primaryImageOfPage` —
 * карточка ссылки из app/opengraph-image.tsx: она общая для всех страниц,
 * поэтому и здесь одна. `about` привязывает страницу к узлу приложения из
 * общего графа: и главная, и /specialists — про один продукт, а не про
 * два.
 */
function webPageNode(page: {
  path: string;
  name: string;
  description: string;
  audienceType?: string;
}) {
  return {
    "@type": "WebPage",
    "@id": webPageId(page.path),
    url: absoluteUrl(page.path),
    name: page.name,
    description: page.description,
    inLanguage: "ru-RU",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": APPLICATION_ID },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: absoluteUrl(OG_IMAGE_PATH),
      width: OG_IMAGE_SIZE.width,
      height: OG_IMAGE_SIZE.height,
    },
    ...(page.audienceType && {
      audience: { "@type": "Audience", audienceType: page.audienceType },
    }),
  };
}

const HOME_PAGE_ID = webPageId("/");
const FAQ_ID = `${SITE_URL}/#faq`;

/**
 * Главная: WebPage + FAQPage одним графом.
 *
 * FAQPage — только здесь, поэтому не в общем графе: тот вставляется в layout
 * на каждую страницу, и разметка вопросов на /cookies утверждала бы то,
 * чего там нет. Вставляется в app/page.tsx рядом с самим разделом.
 *
 * Вопросы и ответы берутся из HOME.faq — той же константы, что рендерит
 * раздел, — так разметка не может разойтись со страницей. Это же условие
 * правил Google для FAQPage: в разметке ровно тот текст, что виден.
 *
 * Расширенный сниппет за эту разметку Google с 2023 года показывает лишь
 * государственным и медицинским сайтам, так что здесь она для Яндекса
 * («Вопросы и ответы» в выдаче) и для языковых моделей, которым структура
 * «вопрос → ответ» читается надёжнее прозы.
 *
 * `hasPart` / `isPartOf` связывают раздел вопросов со страницей, а её — с
 * узлом WebSite из общего графа: FAQ читается как часть главной, а не как
 * отдельная сущность.
 */
const HOME_PAGE_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      ...webPageNode({
        path: "/",
        name: HOME_TITLE,
        description: HOME_DESCRIPTION,
      }),
      hasPart: { "@id": FAQ_ID },
    },
    {
      "@type": "FAQPage",
      "@id": FAQ_ID,
      url: FAQ_ID,
      name: HOME.faq.title,
      inLanguage: "ru-RU",
      isPartOf: { "@id": HOME_PAGE_ID },
      mainEntity: HOME.faq.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ],
};

export const HOME_PAGE_SCHEMA_JSON = escapeJsonLd(
  JSON.stringify(HOME_PAGE_SCHEMA),
);

/**
 * /specialists: только WebPage с аудиторией из подписи над H1. Страница
 * под `noindex` до запуска раздела, но открыта по прямой ссылке — и тому,
 * кто её откроет (партнёр, языковая модель), разметка должна говорить то
 * же, что и текст.
 */
const SPECIALISTS_PAGE_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    webPageNode({
      path: "/specialists",
      name: SPECIALISTS_TITLE,
      description: SPECIALISTS_DESCRIPTION,
      audienceType: PROS.eyebrow,
    }),
  ],
};

export const SPECIALISTS_PAGE_SCHEMA_JSON = escapeJsonLd(
  JSON.stringify(SPECIALISTS_PAGE_SCHEMA),
);
