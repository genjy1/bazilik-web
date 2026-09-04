"use client";

import { useRef } from "react";
import {
  WIDE_MOTION_QUERIES,
  type WideMotionConditions,
  gsap,
  useIsomorphicLayoutEffect,
} from "@/lib/gsap";

/**
 * Фоновый слой: три изумрудных пятна, медленно дрейфующих под контентом,
 * плюс лёгкий параллакс по скроллу.
 *
 * Слой фиксированный и один на всю страницу — так браузер анимирует три
 * элемента вместо декоративного градиента в каждой секции. Анимируются
 * только transform и opacity, то есть без перерасчёта раскладки.
 *
 * Блюр — 40px, не 64: радиальный градиент и так уходит в прозрачность к
 * 70 % радиуса, и большее размытие лишь дороже, а не мягче.
 */
const BLOBS = [
  {
    className: "left-[-18%] top-[-10%] size-[52rem]",
    color: "var(--accent)",
    strength: 22,
    drift: { x: 90, y: 60, duration: 26 },
  },
  {
    className: "right-[-14%] top-[22%] size-[44rem]",
    color: "var(--herb)",
    strength: 16,
    drift: { x: -70, y: 90, duration: 32 },
  },
  {
    className: "left-[18%] bottom-[-16%] size-[48rem]",
    color: "var(--accent-deep)",
    strength: 14,
    drift: { x: 60, y: -70, duration: 38 },
  },
] as const;

export function BackgroundFX() {
  const root = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    // На узких экранах пятна стоят на месте: три слоя по 700–800px с блюром
    // в вечном движении — самая дорогая отрисовка страницы на слабом GPU.
    mm.add(WIDE_MOTION_QUERIES, (ctx) => {
      const { reduced, wide } = ctx.conditions as WideMotionConditions;
      if (reduced || !wide) return;

      const q = gsap.utils.selector(el);

      q("[data-blob]").forEach((blob, i) => {
        const { x, y, duration } = BLOBS[i].drift;

        gsap.to(blob, {
          x,
          y,
          scale: 1.12,
          duration,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });

        // Разная глубина параллакса разводит слои по ощущению дистанции.
        gsap.to(blob, {
          yPercent: -12 * (i + 1),
          ease: "none",
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.2,
          },
        });
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {BLOBS.map((b, i) => (
        <div
          key={i}
          data-blob
          className={`absolute rounded-full blur-2xl ${b.className}`}
          style={{
            background: `radial-gradient(circle, color-mix(in srgb, ${b.color} ${b.strength}%, transparent) 0%, transparent 70%)`,
          }}
        />
      ))}
    </div>
  );
}
