"use client";

import { useRef } from "react";
import { HOME } from "@/lib/content";
import { MOTION_QUERIES, gsap, useIsomorphicLayoutEffect } from "@/lib/gsap";
import { SectionKicker } from "./SectionKicker";
import { Counter } from "./ui/Counter";
import { Chip } from "./ui/Chip";
import { Reveal } from "./ui/Reveal";

const R = 42;
const CIRCUMFERENCE = 2 * Math.PI * R;

/** Декоративная заполненность колец — премиум-крючок, не расчёт (Apple Activity-стиль). */
const RING_FILL: Record<string, number> = { kcal: 0.78, protein: 0.64 };

function MacroRing({ macroKey, label, value }: { macroKey: string; label: string; value: number }) {
  const ref = useRef<SVGCircleElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    const fill = RING_FILL[macroKey] ?? 0.7;

    mm.add(MOTION_QUERIES, (ctx) => {
      const { reduced } = ctx.conditions as { reduced: boolean };
      const target = CIRCUMFERENCE * (1 - fill);

      if (reduced) {
        gsap.set(el, { strokeDashoffset: target });
        return;
      }

      gsap.fromTo(
        el,
        { strokeDashoffset: CIRCUMFERENCE },
        {
          strokeDashoffset: target,
          duration: 1.3,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        },
      );
    });

    return () => mm.revert();
  }, [macroKey]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative size-24">
        <svg viewBox="0 0 100 100" className="size-24 -rotate-90">
          <circle cx={50} cy={50} r={R} fill="none" stroke="var(--line)" strokeWidth={8} />
          <circle
            ref={ref}
            cx={50}
            cy={50}
            r={R}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={8}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <Counter
            value={value}
            prefix="≈"
            className="text-[20px] font-extrabold tracking-tight tabular-nums"
          />
        </div>
      </div>
      <div className="font-mono text-[10px] uppercase tracking-wide text-muted">{label}</div>
    </div>
  );
}

/** landing-b2c.md §6 / landing-b2c-motion.md §7 — премиум-крючки для целей. */
export function GoalsSection() {
  const { goals } = HOME;
  const chipsRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = chipsRef.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add(MOTION_QUERIES, (ctx) => {
      const { reduced } = ctx.conditions as { reduced: boolean };
      if (reduced) return;

      const chips = gsap.utils.toArray<HTMLElement>(el.querySelectorAll("[data-chip]"));
      gsap.fromTo(
        chips,
        { opacity: 0, y: 14, scale: 0.85 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.45,
          ease: "back.out(1.8)",
          stagger: 0.07,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        },
      );
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="relative overflow-hidden py-16 md:py-28">
      <div className="mx-auto max-w-[1180px] px-6">
        <SectionKicker n="06" title={goals.title} lead={goals.lead} />

        <div className="mt-10 flex flex-wrap items-center gap-10">
          {goals.macros.map((m) => (
            <MacroRing key={m.key} macroKey={m.key} label={m.label} value={m.value} />
          ))}

          <div ref={chipsRef} className="flex flex-1 flex-wrap gap-2.5">
            {goals.diets.map((diet) => (
              <span key={diet} data-chip>
                <Chip tone="herb" className="px-3.5 py-1.5 text-[12px] normal-case">
                  {diet}
                </Chip>
              </span>
            ))}
          </div>
        </div>

        <Reveal delay={120}>
          <p className="mt-6 max-w-[62ch] font-mono text-[10.5px] tracking-wide text-muted">
            {goals.disclaimer}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
