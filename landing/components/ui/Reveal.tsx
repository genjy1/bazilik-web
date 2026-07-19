"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { DUR, EASE, gsap, useIsomorphicLayoutEffect } from "@/lib/gsap";

type Props = {
  children: ReactNode;
  /** Задержка каскада внутри секции, мс. */
  delay?: number;
  className?: string;
  as?: "div" | "section" | "article" | "li" | "header";
};

/**
 * Появление при попадании во вьюпорт (ScrollTrigger, один раз).
 *
 * Стартовое скрытие живёт в CSS под классом `.js` (см. globals.css), а не в
 * инлайн-стиле: если JS не выполнится, контент останется видимым, а не
 * пропадёт навсегда. GSAP лишь доводит элемент до opacity 1.
 *
 * gsap.matchMedia сам разводит обычный и reduced-motion сценарии, поэтому
 * разметка не зависит от медиа-запроса и гидратация не расходится.
 */
export function Reveal({ children, delay = 0, className, as = "div" }: Props) {
  const ref = useRef<HTMLElement>(null);
  const Tag = as as ElementType;

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
      (ctx) => {
        const { reduced } = ctx.conditions as { reduced: boolean };

        gsap.fromTo(
          el,
          { opacity: 0, y: reduced ? 0 : 22 },
          {
            opacity: 1,
            y: 0,
            duration: reduced ? 0 : DUR,
            delay: reduced ? 0 : delay / 1000,
            ease: EASE,
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              once: true,
            },
          },
        );
      },
    );

    return () => mm.revert();
  }, [delay]);

  return (
    <Tag ref={ref} className={className} data-reveal>
      {children}
    </Tag>
  );
}
