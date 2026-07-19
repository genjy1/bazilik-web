"use client";

import { useRef } from "react";
import { MOTION_QUERIES, gsap, useIsomorphicLayoutEffect } from "@/lib/gsap";

/**
 * Граница между секциями: линия прочерчивается от центра к краям, когда
 * секция входит в кадр. Заменяет статичный border-t — переход между блоками
 * читается как движение, а не как смена фона.
 *
 * Без анимации линия просто отрисована целиком, поэтому вёрстка не зависит
 * от того, дошёл ли JS.
 */
export function SectionDivider() {
  const ref = useRef<SVGSVGElement>(null);

  useIsomorphicLayoutEffect(() => {
    const svg = ref.current;
    if (!svg) return;

    const mm = gsap.matchMedia();

    mm.add(MOTION_QUERIES, (ctx) => {
      const { reduced } = ctx.conditions as { reduced: boolean };
      if (reduced) return;

      const line = gsap.utils.selector(svg)("[data-divider-line]")[0];

      gsap.from(line, {
        drawSVG: "50% 50%",
        duration: 1.1,
        ease: "power2.out",
        scrollTrigger: { trigger: svg, start: "top 95%", once: true },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="0 0 1200 1"
      preserveAspectRatio="none"
      className="block h-px w-full"
      aria-hidden="true"
    >
      <line
        data-divider-line
        x1="0"
        y1="0.5"
        x2="1200"
        y2="0.5"
        stroke="var(--line)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
