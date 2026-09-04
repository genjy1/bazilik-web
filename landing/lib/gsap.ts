"use client";

import { useEffect, useLayoutEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

// Регистрация должна произойти один раз и только в браузере.
// Регистрируем только то, что живые страницы действительно вызывают:
// каждый плагин отсюда попадает в бандл каждой страницы. MorphSVG,
// MotionPath, Draggable и Inertia уходили пользователю ~36 КБ gzip без
// единого вызова. Понадобится плагин — регистрировать в том компоненте,
// который его использует.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);
}

/**
 * useLayoutEffect на сервере не выполняется и React предупреждает о его
 * использовании при SSR. Клиентские компоненты всё равно рендерятся на
 * сервере, поэтому подменяем реализацию.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export { gsap, ScrollTrigger, DrawSVGPlugin };

/** Единая кривая и длительности, чтобы движение по странице было одинаковым. */
export const EASE = "power3.out";
export const DUR = 0.7;

/** Запрос, по которому все анимации выключаются. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
/** Ниже этой ширины фоновые слои не двигаются — см. BackgroundFX и AmbientIngredients. */
export const WIDE_QUERY = "(min-width: 768px)";
export const MOTION_QUERIES = {
  motion: MOTION_OK,
  reduced: "(prefers-reduced-motion: reduce)",
} as const;

/**
 * Запускает цикл только пока элемент виден — не тратит кадры за кадром экрана.
 * `delayMs` разносит старт нескольких карточек во времени: без него все сцены
 * начинают анимацию в один и тот же кадр, и внимание распыляется сразу на все.
 * Общий хук для PainChaos (/) и PainList (/specialists) — обе страницы
 * заводят циклические мини-сцены на карточках боли по одной и той же схеме.
 */
export function useLoopWhileVisible(
  ref: RefObject<HTMLElement | null>,
  build: (el: HTMLElement) => (() => void) | void,
  delayMs = 0,
) {
  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    let stop: (() => void) | undefined;

    mm.add(MOTION_QUERIES, (ctx) => {
      const { reduced } = ctx.conditions as { reduced: boolean };
      if (reduced) return;

      const start = () => {
        const delayed = gsap.delayedCall(delayMs / 1000, () => {
          const cleanup = build(el);
          stop = cleanup ?? undefined;
        });
        stop = () => delayed.kill();
      };

      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && !stop) {
              start();
            } else if (!entry.isIntersecting && stop) {
              stop();
              stop = undefined;
            }
          }
        },
        { threshold: 0.3 },
      );
      io.observe(el);

      return () => {
        io.disconnect();
        stop?.();
        stop = undefined;
      };
    });

    return () => mm.revert();
  }, []);
}

/** Общие хелперы для скролл-сцен, где прогресс 0..1 — чистая функция. */
export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
/** Линейный ремап в [0,1] с отсечкой по краям. */
export const remap = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
