"use client";

import { useRef, useState, type ReactNode } from "react";
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

const R = 58;
const CIRCUMFERENCE = 2 * Math.PI * R;

/** Декоративная заполненность колец — премиум-крючок, не расчёт (Apple Activity-стиль). */
const RING_FILL: Record<string, number> = {
  kcal: 0.78,
  protein: 0.64,
  /** 25 из 60: кольцо читается как циферблат — будний ужин короче получаса. */
  cook: 25 / 60,
  reuse: 0.72,
};

/** Кольцо-неделя: семь засечек по числу дней, закрашенные — дни с походом в магазин. */
const WEEK_DAYS = 7;
const TICK_STEP = CIRCUMFERENCE / WEEK_DAYS;
/** Зазор должен быть больше толщины штриха (11), иначе round-caps склеят засечки. */
const TICK_LEN = TICK_STEP - 18;

const VALUE_CLASS = "text-[32px] font-extrabold tracking-tight tabular-nums md:text-[36px]";

/** Общая рамка метрики: кольцо, число по центру, моно-подпись снизу. */
function RingFrame({
  label,
  value,
  prefix,
  count,
  children,
}: {
  label: string;
  value: number;
  prefix: string;
  count: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative size-36 md:size-40">
        <svg
          viewBox="0 0 140 140"
          className="size-36 -rotate-90 md:size-40"
          aria-hidden="true"
        >
          {children}
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          {count ? (
            <Counter value={value} prefix={prefix} className={VALUE_CLASS} />
          ) : (
            <span className={VALUE_CLASS}>
              {prefix}
              {value}
            </span>
          )}
        </div>
      </div>
      <div className="font-mono text-[11px] uppercase tracking-wide text-muted">{label}</div>
    </div>
  );
}

/** Кольцо-дуга: заполняется до декоративной доли из RING_FILL. */
function FillRing({
  ringKey,
  label,
  value,
  prefix = "≈",
  count = true,
}: {
  ringKey: string;
  label: string;
  value: number;
  prefix?: string;
  count?: boolean;
}) {
  const ref = useRef<SVGCircleElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    const fill = RING_FILL[ringKey] ?? 0.7;

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
  }, [ringKey]);

  return (
    <RingFrame label={label} value={value} prefix={prefix} count={count}>
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
    </RingFrame>
  );
}

/**
 * Кольцо-неделя: та же окружность, но разрезанная на семь засечек.
 *
 * Доля здесь не «сколько выполнено», а «сколько дней из недели» — поэтому
 * почти пустое кольцо читается как выигрыш (шесть дней без магазина),
 * а не как невыполненная цель.
 */
function WeekRing({
  label,
  value,
  prefix = "",
  count = false,
  active,
}: {
  label: string;
  value: number;
  prefix?: string;
  count?: boolean;
  active: number;
}) {
  const ref = useRef<SVGGElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add(MOTION_QUERIES, (ctx) => {
      const { reduced } = ctx.conditions as { reduced: boolean };
      // Засечки видимы в разметке — без анимации они просто остаются на месте.
      if (reduced) return;

      const ticks = gsap.utils.toArray<SVGElement>(el.querySelectorAll("[data-tick]"));

      gsap.fromTo(
        ticks,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          transformOrigin: "50% 50%",
          duration: 0.4,
          ease: "back.out(1.7)",
          stagger: 0.07,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        },
      );
    });

    return () => mm.revert();
  }, []);

  return (
    <RingFrame label={label} value={value} prefix={prefix} count={count}>
      <g ref={ref}>
        {Array.from({ length: WEEK_DAYS }, (_, i) => (
          <circle
            key={i}
            data-tick
            cx={70}
            cy={70}
            r={R}
            fill="none"
            stroke={i < active ? "var(--accent)" : "var(--line)"}
            strokeWidth={11}
            strokeLinecap="round"
            strokeDasharray={`${TICK_LEN} ${CIRCUMFERENCE - TICK_LEN}`}
            strokeDashoffset={-i * TICK_STEP}
          />
        ))}
      </g>
    </RingFrame>
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
  }, [mode]);

  return (
    <section className="relative overflow-hidden py-16 md:py-28">
      <div className="mx-auto max-w-[1180px] px-6">
        <SectionKicker
          n="06"
          title={goals.title}
          lead={mode === "track" ? goals.lead : goals.enjoy.kicker}
        />

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
                <FillRing key={m.key} ringKey={m.key} label={m.label} value={m.value} />
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
          <div className="mt-10">
            <p className="max-w-[62ch] text-[17px] text-ink">{goals.enjoy.lead}</p>

            <div className="mt-10 flex flex-wrap justify-center gap-10 sm:justify-start">
              {goals.enjoy.stats.map((s) =>
                s.ring === "week" ? (
                  <WeekRing
                    key={s.key}
                    label={s.label}
                    value={s.value}
                    prefix={s.prefix}
                    count={s.count}
                    active={s.value}
                  />
                ) : (
                  <FillRing
                    key={s.key}
                    ringKey={s.key}
                    label={s.label}
                    value={s.value}
                    prefix={s.prefix}
                    count={s.count}
                  />
                ),
              )}
            </div>

            <div ref={chipsRef} className="mt-8 flex flex-wrap gap-2.5">
              {goals.enjoy.tags.map((tag) => (
                <span key={tag} data-chip>
                  <Chip tone="herb" className="px-3.5 py-1.5 text-[12px] normal-case">
                    {tag}
                  </Chip>
                </span>
              ))}
            </div>

            <Reveal delay={120}>
              <p className="mt-6 max-w-[62ch] font-mono text-[10.5px] tracking-wide text-muted">
                {goals.enjoy.disclaimer}
              </p>
            </Reveal>
          </div>
        )}
      </div>
    </section>
  );
}
