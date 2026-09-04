import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { HOME } from "@/lib/content";
import { HOME_TITLE, SITE_NAME, SITE_URL } from "@/lib/site";

/**
 * Карточка ссылки для соцсетей и мессенджеров (1200×630).
 *
 * Раньше картинки не было вовсе, поэтому `twitter:card` деградировал до
 * `summary`, а ссылка в Telegram или VK показывалась голым текстом.
 *
 * Рисуется кодом, а не лежит картинкой в public/: макет тогда правится в
 * репозитории вместе с текстом, а не в графическом редакторе, и не может
 * разойтись со слоганом на странице. Чтобы это было правдой, а не намерением,
 * весь текст карточки приходит оттуда же, откуда его берёт страница:
 * заголовок — из `HOME_TITLE`, слоган — из `HOME.hero` в content.ts.
 */
export const alt = HOME_TITLE;

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Знак читается из public/logo.svg, а не переписывается сюда строкой.
 *
 * Копий геометрии и без того две: JSX в BrandMark.tsx (ему нужны CSS-токены
 * и темизация) и статический файл для JSON-LD. Третья, литералом рядом с
 * макетом карточки, — та, которую забудут: гардрейлы бренд-бука запрещают
 * править пути и перекрашивать изумруд, а правка, дошедшая до двух копий из
 * трёх, разводит карточку ссылки со знаком на самой странице.
 *
 * Чтение синхронно с рендером и происходит на сборке: маршрут статический,
 * и `process.cwd()` здесь — корень проекта (так же читают шрифт в
 * docs/01-app/03-api-reference/03-file-conventions/01-metadata/opengraph-image.md).
 */
async function markUri(): Promise<string> {
  const svg = await readFile(join(process.cwd(), "public", "logo.svg"));
  return `data:image/svg+xml;base64,${svg.toString("base64")}`;
}

/**
 * Подпись-домен в нижнем углу. Берётся из `SITE_URL`, а не пишется строкой:
 * весь смысл рисовать карточку кодом — в том, что она не расходится с сайтом,
 * а вписанный руками домен разошёлся первым же. На карточке стоял
 * `bazilik.ru` — адрес, которого у продукта нет.
 *
 * Технический домен деплоя не показывается вовсе: `bazilik-web.vercel.app`
 * в подписи ссылки читается как черновик, а не как продукт, и на карточке
 * это дороже, чем отсутствие строки. Появится свой домен — подпись вернётся
 * сама, менять здесь ничего не придётся.
 */
const HOST = new URL(SITE_URL).host;
const SIGNATURE = HOST.endsWith(".vercel.app") ? null : HOST;

export default async function Image() {
  const MARK_URI = await markUri();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#F7F6F1",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={MARK_URI} width={64} height={64} alt="" />
          <div
            style={{
              fontSize: 38,
              fontWeight: 700,
              color: "#16231C",
              letterSpacing: "-0.02em",
            }}
          >
            {SITE_NAME}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Две строки, как в геро на сайте, а не одна с переносом: Satori
              переносит по своей логике, и заголовок разъезжался бы иначе,
              чем на странице. */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 84,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.08,
              color: "#16231C",
            }}
          >
            <div style={{ display: "flex" }}>{HOME.hero.titleTop}</div>
            <div style={{ display: "flex", color: "#12583A" }}>
              {HOME.hero.titleAccent}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 31,
              lineHeight: 1.35,
              color: "#5C675F",
            }}
          >
            Меню на неделю, список покупок и готовка по шагам — без ручного
            учёта запасов.
          </div>
        </div>

        {/* Полоска остаётся, даже когда подписи нет: на ней держится нижний
            край композиции, а без всего блока `space-between` утянул бы
            заголовок вниз и карточка перекомпоновалась бы целиком. */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 56, height: 4, background: "#1F7A4D" }} />
          {SIGNATURE ? (
            <div style={{ fontSize: 26, color: "#5C675F" }}>{SIGNATURE}</div>
          ) : null}
        </div>
      </div>
    ),
    size,
  );
}
