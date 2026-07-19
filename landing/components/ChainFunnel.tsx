"use client";

import { useRef } from "react";
import { gsap, useIsomorphicLayoutEffect } from "@/lib/gsap";
import { CHAIN_BEFORE } from "@/lib/content";

const W = 1000;
const H = 120;
/** Итоговая насыщенность линий — она же состояние без JS. */
const OPACITY = 0.55;
const TOP = 6;
const BOTTOM = H - 6;

/** Восемь входов сверху сходятся к двум выходам снизу. */
const paths = CHAIN_BEFORE.map((_, i) => {
  const x1 = ((i + 0.5) / CHAIN_BEFORE.length) * W;
  // Первые четыре шага схлопываются в «приготовить», остальные — в «съесть».
  const x2 = i < CHAIN_BEFORE.length / 2 ? W * 0.3 : W * 0.7;
  const midY = H * 0.55;
  return `M ${x1} ${TOP} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${BOTTOM}`;
});

/**
 * Линии рисуются штрихом: длина обводки равна длине пути, а смещение
 * анимируется от неё к нулю. Это единственный способ «нарисовать» путь без
 * платного DrawSVGPlugin.
 */
export function ChainFunnel() {
  const ref = useRef<SVGSVGElement>(null);

  useIsomorphicLayoutEffect(() => {
    const svg = ref.current;
    if (!svg) return;

    const lines = svg.querySelectorAll<SVGPathElement>("path[data-line]");
    const mm = gsap.matchMedia();

    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
      (ctx) => {
        const { reduced } = ctx.conditions as { reduced: boolean };

        lines.forEach((line) => {
          const len = line.getTotalLength();
          gsap.set(line, { strokeDasharray: len });

          gsap.fromTo(
            line,
            { strokeDashoffset: reduced ? 0 : len, opacity: reduced ? OPACITY : 0 },
            {
              strokeDashoffset: 0,
              opacity: OPACITY,
              duration: reduced ? 0 : 1.1,
              ease: "power2.inOut",
              scrollTrigger: { trigger: svg, start: "top 90%", once: true },
            },
          );
        });
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className="h-[76px] w-full md:h-[104px]"
      aria-hidden="true"
    >
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          data-line
          fill="none"
          stroke="var(--accent)"
          strokeWidth={1.5}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          opacity={OPACITY}
        />
      ))}
    </svg>
  );
}
