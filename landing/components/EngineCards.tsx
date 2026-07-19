"use client";

import { Activity, Gauge, Recycle, Shuffle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useRef } from "react";
import { ENGINE, type EngineIcon } from "@/lib/content";
import { MOTION_QUERIES, gsap, useIsomorphicLayoutEffect } from "@/lib/gsap";

const icons: Record<EngineIcon, LucideIcon> = {
  gauge: Gauge,
  recycle: Recycle,
  shuffle: Shuffle,
  activity: Activity,
};

/**
 * Карточки механик с собственным выходом.
 *
 * Здесь один таймлайн со stagger, а не четыре независимых Reveal с ручными
 * задержками: у общего триггера карточки стартуют от одного положения секции,
 * поэтому шаг между ними ровный независимо от того, как быстро пролистали.
 *
 * Карточка приподнимается и доворачивается по X (нижний край ближе к зрителю),
 * иконка догоняет её с лёгким перелётом. Разные кривые для карточки и иконки
 * дают ощущение веса — плита тяжёлая, значок лёгкий.
 */
export function EngineCards() {
  const grid = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = grid.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add(MOTION_QUERIES, (ctx) => {
      const { reduced } = ctx.conditions as { reduced: boolean };

      const q = gsap.utils.selector(el);
      const cards = q("[data-reveal]");
      const marks = q("[data-engine-icon]");

      // При отключённом движении просто снимаем стартовое скрытие из CSS.
      if (reduced) {
        gsap.set(cards, { opacity: 1 });
        return;
      }

      const trigger = { trigger: el, start: "top 82%", once: true } as const;

      gsap.fromTo(
        cards,
        { opacity: 0, y: 44, scale: 0.96, rotateX: -12 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          duration: 0.75,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: trigger,
        },
      );

      gsap.fromTo(
        marks,
        { scale: 0, rotate: -25 },
        {
          scale: 1,
          rotate: 0,
          duration: 0.6,
          ease: "back.out(2)",
          stagger: 0.1,
          delay: 0.18,
          scrollTrigger: trigger,
        },
      );
    });

    return () => mm.revert();
  }, []);

  return (
    <div
      ref={grid}
      // Без перспективы у родителя доворот по X выглядит простым сжатием.
      style={{ perspective: "1000px" }}
      className="mt-11 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {ENGINE.map((item) => {
        const Icon = icons[item.icon];
        return (
          <article
            key={item.title}
            data-reveal
            className="h-full rounded-2xl border border-line bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/35 hover:shadow-[0_18px_44px_rgba(0,0,0,0.35)]"
          >
            <div
              data-engine-icon
              className="mb-4 grid size-10 place-items-center rounded-xl bg-accent/13 text-accent-deep"
            >
              <Icon size={21} strokeWidth={2} />
            </div>
            <h3 className="mb-2.5 text-lg tracking-tight">{item.title}</h3>
            <p className="text-[15px] text-muted">{item.body}</p>
          </article>
        );
      })}
    </div>
  );
}
