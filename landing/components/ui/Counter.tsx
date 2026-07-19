"use client";

import { useRef } from "react";
import { gsap, useIsomorphicLayoutEffect } from "@/lib/gsap";

type Props = {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
};

/**
 * Счётчик, отсчитывающий один раз при появлении в кадре.
 *
 * Итоговое число отрендерено в HTML сразу — так оно доступно поисковикам,
 * читалкам и остаётся на месте без JS. GSAP только «отматывает» его к нулю
 * и проигрывает обратно.
 */
export function Counter({ value, prefix = "", suffix = "", className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const counter = { v: 0 };

      gsap.to(counter, {
        v: value,
        duration: 1.1,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
        onUpdate: () => {
          el.textContent = `${prefix}${Math.round(counter.v)}${suffix}`;
        },
        onComplete: () => {
          el.textContent = `${prefix}${value}${suffix}`;
        },
      });
    });

    return () => mm.revert();
  }, [value, prefix, suffix]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}
