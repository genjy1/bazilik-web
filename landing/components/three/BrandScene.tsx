"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

/**
 * three.js грузится только в браузере и отдельным чанком: сцена декоративная,
 * ради неё не стоит утяжелять первый рендер, и в серверную сборку она попасть
 * не может — WebGL там недоступен.
 */
const BrandMark3D = dynamic(
  () => import("./BrandMark3D").then((m) => m.BrandMark3D),
  { ssr: false },
);

const QUERY = "(min-width: 1024px)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * Знак в объёме живёт в тёмной секции: на светлом фоне изумруд теряет
 * контраст, а в геро-блоке сцена конкурировала бы с макетом приложения.
 *
 * Ширину проверяем медиа-запросом, а не только классом `hidden`: скрытый
 * стилями компонент всё равно смонтировался бы и держал WebGL-контекст с
 * геометрией на телефонах, где сцену никто не увидит.
 *
 * Серверный снапшот `false` — на сервере ширины нет, а чанк всё равно
 * подгружается только на клиенте.
 */
export function BrandScene() {
  const wide = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );

  if (!wide) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -top-[6%] -right-[8%] size-[520px] opacity-70 xl:-right-[2%] xl:size-[600px]"
    >
      <BrandMark3D />
    </div>
  );
}
