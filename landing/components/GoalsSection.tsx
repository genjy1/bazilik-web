"use client";

import { useRef, useState } from "react";
import { HOME } from "@/lib/content";
import { MOTION_QUERIES, gsap, useIsomorphicLayoutEffect } from "@/lib/gsap";
import { SectionKicker } from "./SectionKicker";
import { Counter } from "./ui/Counter";
import { Chip } from "./ui/Chip";
import { Reveal } from "./ui/Reveal";

type GoalsMode = "track" | "enjoy";

const MODES: ReadonlyArray<{ key: GoalsMode; label: string }> = [
  { key: "track", label: "Следить за питанием" },
  { key: "enjoy", label: "Вкусно поесть" },
];

/** Чем кормим семью, когда цель — не граммы, а стол без «доедаем что есть». */
const ENJOY_TAGS = [
  "Любимые блюда семьи",
  "Разнообразие на неделю",
  "Быстрые будние ужины",
  "Без «доедаем, что есть»",
];

const R = 58;
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
    <div className="flex flex-col items-center gap-3">
      <div className="relative size-36 md:size-40">
        <svg viewBox="0 0 140 140" className="size-36 -rotate-90 md:size-40">
          <circle cx={70} cy={70} r={R} fill="none" stroke="var(--line)" strokeWidth={11} />
          <circle
            ref={ref}
            cx={70}
            cy={70}
            r={R}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={11}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <Counter
            value={value}
            prefix="≈"
            className="text-[32px] font-extrabold tracking-tight tabular-nums md:text-[36px]"
          />
        </div>
      </div>
      <div className="font-mono text-[11px] uppercase tracking-wide text-muted">{label}</div>
    </div>
  );
}

/** landing-b2c.md §6 / landing-b2c-motion.md §7 — премиум-крючки для целей. */
export function GoalsSection() {
  const { goals } = HOME;
  const chipsRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<GoalsMode>("track");

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

        <div className="mt-8 inline-flex rounded-full border border-line bg-surface p-1">
          {MODES.map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => setMode(m.key)}
              aria-pressed={mode === m.key}
              className={`rounded-full px-4 py-2 text-[13.5px] font-bold tracking-tight transition-colors ${
                mode === m.key ? "bg-accent text-on-accent" : "text-muted hover:text-ink"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {mode === "track" ? (
          <div className="mt-10">
            <div className="flex flex-wrap justify-center gap-10 sm:justify-start">
              {goals.macros.map((m) => (
                <MacroRing key={m.key} macroKey={m.key} label={m.label} value={m.value} />
              ))}
            </div>

            <div ref={chipsRef} className="mt-8 flex flex-wrap gap-2.5">
              {goals.diets.map((diet) => (
                <span key={diet} data-chip>
                  <Chip tone="herb" className="px-3.5 py-1.5 text-[12px] normal-case">
                    {diet}
                  </Chip>
                </span>
              ))}
            </div>

            <Reveal delay={120}>
              <p className="mt-6 max-w-[62ch] font-mono text-[10.5px] tracking-wide text-muted">
                {goals.disclaimer}
              </p>
            </Reveal>
          </div>
        ) : (
          <div className="mt-10 max-w-[62ch]">
            <p className="text-[17px] text-ink">
              Не считать граммы, а просто вкусно накормить семью — тоже цель. Базилик держит
              баланс сам, а тебе остаётся выбрать, что приготовить.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {ENJOY_TAGS.map((tag) => (
                <Chip key={tag} tone="herb" className="px-3.5 py-1.5 text-[12px] normal-case">
                  {tag}
                </Chip>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
