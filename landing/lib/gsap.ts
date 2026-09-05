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

/** Запрос, при котором анимации разрешены. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
/** Запрос, по которому все анимации выключаются. */
export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
/**
 * Ниже этой ширины фоновые слои не двигаются (BackgroundFX, AmbientIngredients),
 * а сцена «Три шага» (PhoneStepsScene) не пинится и не крутится.
 *
 * В rem, а не в px: это тот же порог, что у Tailwind-варианта `md:` (48rem),
 * которым PhoneStepsScene показывает и прячет ту же сцену в CSS. В медиазапросах
 * rem считается от браузерного размера шрифта, и у тех, кто его сменил, px и
 * rem расходятся — JS и CSS показывали бы разные ветки одной сцены.
 */
export const WIDE_QUERY = "(min-width: 48rem)";
export const MOTION_QUERIES = {
  motion: MOTION_OK,
  reduced: REDUCED_MOTION,
} as const;
/**
 * Те же условия плюс ширина — для декоративных слоёв, которые на узком экране
 * стоят на месте. Колбэк matchMedia проверяет `reduced || !wide` и выходит.
 * Тип выводится из ключей объекта: переименование ключа не пройдёт мимо
 * компилятора у тех, кто деструктурирует `ctx.conditions`.
 */
export const WIDE_MOTION_QUERIES = { ...MOTION_QUERIES, wide: WIDE_QUERY } as const;
export type WideMotionConditions = Record<keyof typeof WIDE_MOTION_QUERIES, boolean>;

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
