"use client";

import { useRef } from "react";
import { MOTION_QUERIES, gsap, useIsomorphicLayoutEffect } from "@/lib/gsap";

type Props = {
  value: number;
  /** По умолчанию — целое число. Передайте свой форматтер для дробей и единиц. */
  format?: (n: number) => string;
  className?: string;
};

const defaultFormat = (n: number) => String(Math.round(n));

/**
 * Число, перетекающее к новому значению при смене входа.
 *
 * Значение пишется в textContent из колбэка GSAP, а не через состояние:
 * тикающий setState на каждом кадре — это лишний рендер всего поддерева
 * шестьдесят раз в секунду.
 */
export function AnimatedNumber({
  value,
  format = defaultFormat,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef(value);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const from = shown.current;
    shown.current = value;

    if (from === value) {
      el.textContent = format(value);
      return;
    }

    const mm = gsap.matchMedia();

    mm.add(MOTION_QUERIES, (ctx) => {
      const { reduced } = ctx.conditions as { reduced: boolean };

      if (reduced) {
        el.textContent = format(value);
        return;
      }

      const counter = { v: from };

      gsap.to(counter, {
        v: value,
        duration: 0.5,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = format(counter.v);
        },
        onComplete: () => {
          el.textContent = format(value);
        },
      });
    });

    return () => mm.revert();
  }, [value, format]);

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}
