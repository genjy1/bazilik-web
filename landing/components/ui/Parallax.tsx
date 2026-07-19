"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { MOTION_QUERIES, gsap, useIsomorphicLayoutEffect } from "@/lib/gsap";

type Props = {
  children: ReactNode;
  /**
   * Насколько элемент отстаёт от прокрутки. 0.2 — смещение ±10% высоты
   * за весь проход через экран. Отрицательное значение двигает навстречу.
   */
  speed?: number;
  /** Ниже этой ширины параллакс выключен: в одну колонку он читается как дрожание. */
  minWidth?: number;
  className?: string;
  as?: "div" | "section" | "figure";
};

/**
 * Параллакс-обёртка: собственный элемент, который двигается по скроллу.
 *
 * Компонент намеренно рендерит свой div, а не принимает ref на чужой: Reveal
 * уже анимирует `y` у своих элементов, и вешать оба эффекта на один узел
 * значило бы драться за одну и ту же матрицу трансформации. Здесь смещение
 * идёт в yPercent на отдельном слое — конфликта нет.
 */
export function Parallax({
  children,
  speed = 0.2,
  minWidth = 768,
  className,
  as = "div",
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const Tag = as as ElementType;

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        ...MOTION_QUERIES,
        wide: `(min-width: ${minWidth}px)`,
      },
      (ctx) => {
        const { reduced, wide } = ctx.conditions as {
          reduced: boolean;
          wide: boolean;
        };
        if (reduced || !wide) return;

        const shift = speed * 50;

        gsap.fromTo(
          el,
          { yPercent: -shift },
          {
            yPercent: shift,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      },
    );

    return () => mm.revert();
  }, [speed, minWidth]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
