import type { NextConfig } from "next";
import { PAGE_LAST_MODIFIED, lastModifiedHeader } from "./lib/lastModified";

const nextConfig: NextConfig = {
  /**
   * `X-Powered-By: Next.js` не нужен никому, кроме сканеров версий. Vercel
   * срезает его сам, но при переезде на другой хостинг заголовок вернулся бы.
   */
  poweredByHeader: false,

  /**
   * Контент страницы «Дома» переехал на корень, поэтому старый адрес
   * отдаёт постоянный 308 на `/`: внешние ссылки и поисковая выдача,
   * накопленные на /home, не должны упираться в 404.
   */
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
      /**
       * `/index` Next отдаёт как корень со статусом 200: дубль главной под
       * другим адресом. Canonical его и так склеивает, но редирект честнее —
       * робот не тратит обход на второй URL того же документа.
       */
      {
        source: "/index",
        destination: "/",
        permanent: true,
      },
    ];
  },

  /**
   * Базовые заголовки безопасности на все ответы (аудит
   * docs/launch/security-2026-09-04.md, SEC-34). HSTS здесь нет намеренно:
   * его выставляет Vercel для *.vercel.app, а при переезде на свой домен
   * его надо включать отдельным решением и без `preload` в первый день.
   * CSP тоже нет: ей нужны nonce для трёх инлайн-скриптов (boot-скрипт темы,
   * JSON-LD, инициализация Метрики) и сначала период Report-Only.
   */
  async headers() {
    return [
      /**
       * `Last-Modified` на HTML-страницах. Статике и странице 404 его
       * ставит Vercel сам, а пререндеренным маршрутам — нет, и робот Яндекса
       * не знал, менялась ли страница с прошлого обхода. Даты — те же, что в
       * `lastmod` sitemap.xml, из одного файла lib/lastModified.ts, и
       * двигаются рукой только при содержательной правке (объяснение там же).
       */
      ...Object.keys(PAGE_LAST_MODIFIED).map((path) => ({
        source: path,
        headers: [{ key: "Last-Modified", value: lastModifiedHeader(path) }],
      })),
      {
        source: "/(.*)",
        headers: [
          // Браузер не угадывает MIME по содержимому: скрипт остаётся
          // скриптом, картинка — картинкой.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Лендинг не встраивается ни в чей iframe.
          { key: "X-Frame-Options", value: "DENY" },
          // Кросс-доменным переходам уходит только origin, свой домен видит
          // полный путь — достаточно для Метрики и не светит адреса наружу.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Сайт не пользуется этими API — закрыть их и для своих скриптов,
          // и для сторонних (Метрика с webvisor в том числе).
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },

  /**
   * В корне репозитория лежит второй package-lock.json, и без явного корня
   * Next на каждой сборке гадает, где проект, и предупреждает об этом.
   */
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
