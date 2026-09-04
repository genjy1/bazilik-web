"use client";

import { useRef } from "react";
import { Ingredient } from "./ui/Ingredient";
import { MOTION_OK, MOTION_QUERIES, WIDE_QUERY, gsap, useIsomorphicLayoutEffect } from "@/lib/gsap";

/**
 * Фоновый слой дрейфующих ингредиентов — сквозной мотив всей страницы
 * (landing-b2c-motion.md §0/§1): вверху хаос из тех же продуктов, что потом
 * собираются в блюдо. Слой декоративный (`aria-hidden`, `pointer-events-none`),
 * живёт рядом с `BackgroundFX` и использует тот же приём (fixed, `-z-10`,
 * gsap.matchMedia + drift + scroll-параллакс), плюс лёгкое «расступание» от
 * курсора на десктопе.
 */
const ITEMS = [
  { id: "tomato", left: "8%", top: "12%", size: 46, rotate: -8, depth: 1 },
  { id: "basil", left: "82%", top: "8%", size: 40, rotate: 14, depth: 2 },
  { id: "chicken", left: "70%", top: "34%", size: 52, rotate: -4, depth: 1 },
  { id: "dill", left: "4%", top: "48%", size: 44, rotate: 10, depth: 3 },
  { id: "egg", left: "90%", top: "58%", size: 34, rotate: -12, depth: 2 },
  { id: "garlic", left: "14%", top: "74%", size: 36, rotate: 6, depth: 1 },
  { id: "pepper", left: "60%", top: "82%", size: 42, rotate: -6, depth: 3 },
  { id: "onion", left: "40%", top: "6%", size: 38, rotate: 8, depth: 2 },
  { id: "pasta", left: "30%", top: "62%", size: 48, rotate: -10, depth: 1 },
] as const;

/** Радиус, в котором лист «расступается» от курсора, и сила смещения. */
const REPEL_RADIUS = 160;
const REPEL_STRENGTH = 22;

export function AmbientIngredients() {
  const root = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    // Дрейф и параллакс — только на широких экранах: на телефоне девять
    // бесконечных твинов плюс скраб по скроллу жгут батарею ради листьев,
    // которые в одну колонку почти не видны. Статичная раскладка остаётся.
    mm.add({ ...MOTION_QUERIES, wide: WIDE_QUERY }, (ctx) => {
      const { reduced, wide } = ctx.conditions as { reduced: boolean; wide: boolean };
      if (reduced || !wide) return;

      const outers = gsap.utils.toArray<HTMLElement>(el.querySelectorAll("[data-drift]"));

      outers.forEach((outer, i) => {
        const item = ITEMS[i];
        const dx = 26 + item.depth * 8;
        const dy = 18 + item.depth * 6;
        const duration = 22 + item.depth * 6;

        gsap.to(outer, {
          x: `+=${dx}`,
          y: `-=${dy}`,
          rotation: `+=${item.depth % 2 === 0 ? 6 : -6}`,
          duration,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });

        gsap.to(outer, {
          yPercent: -8 * item.depth,
          ease: "none",
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
          },
        });
      });
    });

    // Расступание от курсора — только там, где есть настоящий указатель.
    mm.add(`${MOTION_OK} and (pointer: fine)`, () => {
      const inners = gsap.utils.toArray<HTMLElement>(el.querySelectorAll("[data-repel]"));
      const setters = inners.map((node) => ({
        x: gsap.quickTo(node, "x", { duration: 0.6, ease: "power3.out" }),
        y: gsap.quickTo(node, "y", { duration: 0.6, ease: "power3.out" }),
      }));

      let rafId = 0;
      let pending: PointerEvent | null = null;

      const apply = () => {
        rafId = 0;
        const e = pending;
        if (!e) return;

        inners.forEach((node, i) => {
          const rect = node.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = cx - e.clientX;
          const dy = cy - e.clientY;
          const dist = Math.hypot(dx, dy);

          if (dist < REPEL_RADIUS && dist > 0.01) {
            const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH;
            setters[i].x(gsap.utils.clamp(-30, 30, (dx / dist) * force));
            setters[i].y(gsap.utils.clamp(-30, 30, (dy / dist) * force));
          } else {
            setters[i].x(0);
            setters[i].y(0);
          }
        });
      };

      // rAF-батчинг: getBoundingClientRect дорогой, а pointermove может
      // стрелять чаще, чем отрисовывается кадр.
      const onMove = (e: PointerEvent) => {
        pending = e;
        if (!rafId) rafId = requestAnimationFrame(apply);
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      return () => {
        window.removeEventListener("pointermove", onMove);
        if (rafId) cancelAnimationFrame(rafId);
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {ITEMS.map((item) => (
        <div
          key={item.id}
          data-drift
          className="absolute"
          style={{
            left: item.left,
            top: item.top,
            width: item.size,
            height: item.size,
            transform: `rotate(${item.rotate}deg)`,
          }}
        >
          <div data-repel>
            {/* Без filter: blur(0.2px) — на глаз он неразличим, а каждый
                такой фильтр заводил отдельный слой композитора. */}
            <Ingredient id={item.id} className="h-full w-full opacity-35" />
          </div>
        </div>
      ))}
    </div>
  );
}
