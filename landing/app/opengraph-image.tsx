import { ImageResponse } from "next/og";

/**
 * Карточка ссылки для соцсетей и мессенджеров (1200×630).
 *
 * Раньше картинки не было вовсе, поэтому `twitter:card` деградировал до
 * `summary`, а ссылка в Telegram или VK показывалась голым текстом.
 *
 * Рисуется кодом, а не лежит картинкой в public/: макет тогда правится в
 * репозитории вместе с текстом, а не в графическом редакторе, и не может
 * разойтись со слоганом на странице.
 */
export const alt =
  "Базилик — меню на неделю: готовь то, что уже есть";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Знак из BrandMark.tsx, один в один по геометрии (гардрейлы бренд-бука
 * запрещают править пути и перекрашивать изумруд). Токены подставлены
 * литералами: у ImageResponse нет ни CSS-переменных, ни каскада.
 */
const LEAF = "M50 72 C 37 62 36 36 50 20 C 64 36 63 62 50 72 Z";
const MARK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <path d="M50 90 L50 72" fill="none" stroke="#16231C" stroke-width="6" stroke-linecap="round"/>
  <path d="${LEAF}" transform="rotate(-42 50 72)" fill="#1F7A4D"/>
  <path d="${LEAF}" transform="rotate(42 50 72)" fill="#1F7A4D"/>
  <path d="${LEAF}" fill="#12583A"/>
</svg>`;
const MARK_URI = `data:image/svg+xml;base64,${Buffer.from(MARK).toString("base64")}`;

export default function Image() {
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
            Базилик
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
            <div style={{ display: "flex" }}>Готовь то,</div>
            <div style={{ display: "flex", color: "#12583A" }}>
              что уже есть.
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

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 56, height: 4, background: "#1F7A4D" }} />
          <div style={{ fontSize: 26, color: "#5C675F" }}>bazilik.ru</div>
        </div>
      </div>
    ),
    size,
  );
}
