"use client";

import { useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  DEFAULT_CONFIG,
  DIETS,
  GOALS,
  PACES,
  estimatePlan,
  type Diet,
  type Goal,
  type Pace,
} from "@/lib/configurator";
import { EASE, MOTION_QUERIES, gsap, useIsomorphicLayoutEffect } from "@/lib/gsap";
import { AnimatedNumber } from "./ui/AnimatedNumber";
import { Chip } from "./ui/Chip";

const hours = (n: number) => n.toFixed(1).replace(".", ",");
/** «1 поход», «2 похода» — подпись обязана согласоваться с числом. */
const tripsWord = (n: number) => (n === 1 ? "поход" : "похода");

const toggleBase =
  "inline-flex min-h-11 items-center justify-center rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors";
const toggleOn = "border-transparent bg-accent text-on-accent";
const toggleOff = "border-line bg-ground text-muted hover:border-accent hover:text-accent-deep";

function Group({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
        {label}
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

/**
 * Мини-конфигуратор плана: три настройки — и сводка пересобирается на месте.
 *
 * Смысл в CTA — дать потрогать логику движка до всякой регистрации. Поэтому
 * сделан на DOM и GSAP, а не на WebGL: на слабых телефонах и в поиске это
 * должно работать одинаково, а тяжёлая сцена била бы и по тому, и по другому.
 */
export function PlanConfigurator() {
  const [goal, setGoal] = useState<Goal>(DEFAULT_CONFIG.goal);
  const [diets, setDiets] = useState<readonly Diet[]>(DEFAULT_CONFIG.diets);
  const [pace, setPace] = useState<Pace>(DEFAULT_CONFIG.pace);

  const plan = useMemo(
    () => estimatePlan({ goal, diets, pace }),
    [goal, diets, pace],
  );

  const dishesRef = useRef<HTMLUListElement>(null);
  const prevDishesRef = useRef<readonly string[]>(plan.dishes);

  // Список блюд меняется составом, а не значением — числа тут не перетекают,
  // поэтому подсвечиваем сам факт пересборки, но только когда состав
  // действительно другой: Цель и Темп не влияют на dishes (см. estimatePlan),
  // и их клики не должны переигрывать анимацию впустую.
  useIsomorphicLayoutEffect(() => {
    const el = dishesRef.current;
    if (!el) return;

    const prev = prevDishesRef.current;
    prevDishesRef.current = plan.dishes;

    const unchanged =
      prev.length === plan.dishes.length &&
      prev.every((name, i) => name === plan.dishes[i]);
    if (unchanged) return;

    const mm = gsap.matchMedia();

    mm.add(MOTION_QUERIES, (ctx) => {
      const { reduced } = ctx.conditions as { reduced: boolean };
      if (reduced) return;

      gsap.fromTo(
        el.children,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.2, stagger: 0.05, ease: EASE },
      );
    });

    return () => mm.revert();
  }, [plan.dishes]);

  function toggleDiet(id: Diet) {
    setDiets((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id],
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10">
      <div className="grid content-start gap-6">
        <Group label="Цель">
          {GOALS.map((g) => (
            <button
              key={g.id}
              type="button"
              aria-pressed={goal === g.id}
              onClick={() => setGoal(g.id)}
              className={`${toggleBase} ${goal === g.id ? toggleOn : toggleOff}`}
            >
              {g.label}
            </button>
          ))}
        </Group>

        <Group label="Ограничения">
          {DIETS.map((d) => (
            <button
              key={d.id}
              type="button"
              aria-pressed={diets.includes(d.id)}
              onClick={() => toggleDiet(d.id)}
              className={`${toggleBase} ${diets.includes(d.id) ? toggleOn : toggleOff}`}
            >
              {d.label}
            </button>
          ))}
        </Group>

        <Group label="Темп">
          {PACES.map((p) => (
            <button
              key={p.id}
              type="button"
              aria-pressed={pace === p.id}
              title={p.hint}
              onClick={() => setPace(p.id)}
              className={`${toggleBase} ${pace === p.id ? toggleOn : toggleOff}`}
            >
              {p.label}
            </button>
          ))}
        </Group>
      </div>

      <div className="rounded-3xl border border-line bg-ground p-6">
        {/* Живой регион — одна фраза, а не вся панель: иначе каждый клик
            зачитывал скринридеру семь чисел и все блюда подряд. */}
        <p className="sr-only" aria-live="polite">
          {`Неделя пересобрана: ${plan.kcal} ккал и ${plan.protein} г белка в день, ${plan.shopping} ${tripsWord(plan.shopping)} в магазин, минус ${plan.waste} % отходов.`}
        </p>
        <div className="flex items-baseline justify-between gap-3 border-b border-line pb-4">
          <div className="text-[15px] font-extrabold tracking-tight">
            Неделя по вашим настройкам
          </div>
          <Chip tone="herb">пересобрано</Chip>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { v: <AnimatedNumber value={plan.kcal} />, k: "ккал / день" },
            {
              v: (
                <>
                  <AnimatedNumber value={plan.protein} /> г
                </>
              ),
              k: "белок / день",
            },
            { v: <AnimatedNumber value={plan.meals} />, k: "приёмов пищи" },
            { v: <AnimatedNumber value={plan.shopping} />, k: `${tripsWord(plan.shopping)} в магазин` },
          ].map((m, i) => (
            <div key={i}>
              <div className="text-[26px] font-extrabold tracking-[-0.04em]">
                {m.v}
              </div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                {m.k}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-2.5 sm:grid-cols-3">
          <div className="rounded-2xl border border-line bg-surface px-4 py-3">
            <div className="text-lg font-extrabold tracking-tight text-herb-ink">
              −<AnimatedNumber value={plan.waste} />%
            </div>
            <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
              отходы
            </div>
          </div>
          <div className="rounded-2xl border border-line bg-surface px-4 py-3">
            <div className="text-lg font-extrabold tracking-tight">
              <AnimatedNumber value={plan.reuse} />
            </div>
            <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
              переиспользований
            </div>
          </div>
          <div className="rounded-2xl border border-line bg-surface px-4 py-3">
            <div className="text-lg font-extrabold tracking-tight">
              <AnimatedNumber value={plan.activeHours} format={hours} /> ч
            </div>
            <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
              активное время
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
            Что попадёт в неделю
          </div>
          <ul ref={dishesRef} className="flex flex-wrap gap-2">
            {plan.dishes.map((d) => (
              <li key={d}>
                <Chip>{d}</Chip>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
