"use client";

import { Barcode, Check, Trash2 } from "lucide-react";
import { useRef, type ReactElement, type ReactNode, type RefObject } from "react";
import { HOME, type HomeTakeScene } from "@/lib/content";
import type { IngredientId } from "@/lib/ingredients";
import {
  MOTION_QUERIES,
  ScrollTrigger,
  gsap,
  useIsomorphicLayoutEffect,
} from "@/lib/gsap";
import { SectionKicker } from "./SectionKicker";
import { Ingredient } from "./ui/Ingredient";
import { Reveal } from "./ui/Reveal";

/* ============================================================
   Сцены карточек «Что ты получаешь».

   Каждая сцена — не иконка, а фрагмент интерфейса: слим-шапка с моно-
   подписью и поле фиксированной высоты, как маленький экран приложения
   (тот же приём, что в PhoneStepsScene). Одна высота на все пять карточек
   держит сетку ровной.

   Разметка всегда описывает КОНЕЧНОЕ состояние сцены: «до» выставляет
   gsap.set перед проигрыванием. Без JS и при prefers-reduced-motion
   пользователь видит осмысленный результат, а не полупустой кадр.
   ============================================================ */

/**
 * Проигрывает сцену один раз при попадании во вьюпорт, повтор — по ховеру
 * или тапу карточки. При prefers-reduced-motion сцена не строится вовсе:
 * разметка уже показывает финал (см. комментарий выше).
 */
function useOnceThenHover(
  cardRef: RefObject<HTMLElement | null>,
  build: (reduced: boolean) => (() => void) | void,
) {
  useIsomorphicLayoutEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const mm = gsap.matchMedia();

    mm.add(MOTION_QUERIES, (ctx) => {
      const { reduced } = ctx.conditions as { reduced: boolean };

      let cleanup: (() => void) | void;
      const run = () => {
        cleanup?.();
        cleanup = build(reduced);
      };

      const st = ScrollTrigger.create({
        trigger: card,
        start: "top 82%",
        once: true,
        onEnter: run,
      });

      // Повтор по ховеру/тапу имеет смысл только там, где вообще есть анимация.
      if (!reduced) {
        card.addEventListener("mouseenter", run);
        card.addEventListener("click", run);
      }

      return () => {
        st.kill();
        card.removeEventListener("mouseenter", run);
        card.removeEventListener("click", run);
        cleanup?.();
      };
    });

    return () => mm.revert();
  }, []);
}

/**
 * Общая рамка сцены. `rootRef` вешается на всю панель, чтобы повтор по ховеру
 * ловился с любой её точки, а не только с самой картинки.
 *
 * Панель декоративна: смысл несут заголовок и текст карточки, поэтому она
 * целиком скрыта от скринридера — иначе он читает подписи дважды.
 */
function SceneFrame({
  label,
  hint,
  rootRef,
  children,
}: {
  label: string;
  hint?: ReactNode;
  rootRef: RefObject<HTMLDivElement | null>;
  children: ReactNode;
}) {
  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="overflow-hidden rounded-xl border border-line bg-ground"
    >
      <div className="flex items-center justify-between gap-3 border-b border-line bg-surface/50 px-3.5 py-2">
        <span className="truncate font-mono text-[9px] font-semibold tracking-[0.16em] text-muted uppercase">
          {label}
        </span>
        {hint ? (
          <span className="flex shrink-0 items-center gap-1 font-mono text-[9px] font-semibold tracking-[0.12em] text-accent uppercase">
            {hint}
          </span>
        ) : null}
      </div>
      <div className="p-3.5">
        <div className="h-[92px]">{children}</div>
      </div>
    </div>
  );
}

const WEEK = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"] as const;

/** Три приёма пищи — три тона, чтобы неделя читалась как расписание, а не как сетка точек. */
const MEALS = [
  { key: "breakfast", label: "завтрак", tone: "bg-accent" },
  { key: "lunch", label: "обед", tone: "bg-herb/85" },
  { key: "dinner", label: "ужин", tone: "bg-amber/75" },
] as const;

/** Неделя заполняется слот за слотом — план собирается на глазах. */
function CalendarScene() {
  const ref = useRef<HTMLDivElement>(null);
  useOnceThenHover(ref, (reduced) => {
    const el = ref.current;
    if (!el || reduced) return;
    const slots = gsap.utils.toArray<HTMLElement>(el.querySelectorAll("[data-slot]"));
    const tl = gsap.timeline();
    tl.fromTo(
      slots,
      { scaleX: 0, opacity: 0 },
      {
        scaleX: 1,
        opacity: 1,
        transformOrigin: "left center",
        duration: 0.3,
        stagger: 0.028,
        ease: "power2.out",
      },
    );
    return () => tl.kill();
  });

  return (
    <SceneFrame label="План недели" rootRef={ref} hint="7 дней">
      <div className="flex h-full flex-col justify-between">
        <div className="grid grid-cols-7 gap-1.5">
          {WEEK.map((day) => (
            <div key={day} className="flex flex-col items-center gap-1.5">
              <span className="font-mono text-[8.5px] leading-3 text-muted">{day}</span>
              <span className="flex w-full flex-col gap-1 rounded-[5px] border border-line bg-surface/60 p-1">
                {MEALS.map((meal) => (
                  <span
                    key={meal.key}
                    data-slot
                    className={`h-[7px] w-full rounded-[2px] ${meal.tone}`}
                  />
                ))}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 border-t border-line pt-2">
          {MEALS.map((meal) => (
            <span
              key={meal.key}
              className="flex items-center gap-1.5 font-mono text-[8.5px] leading-3 tracking-[0.1em] text-muted uppercase"
            >
              <span className={`h-1.5 w-2.5 shrink-0 rounded-[2px] ${meal.tone}`} />
              {meal.label}
            </span>
          ))}
        </div>
      </div>
    </SceneFrame>
  );
}

const LIST_ITEMS: ReadonlyArray<{ id: IngredientId; name: string; qty: string }> = [
  { id: "chicken", name: "Куриное филе", qty: "800 г" },
  { id: "tomato", name: "Помидоры", qty: "6 шт" },
  { id: "basil", name: "Базилик", qty: "1 пуч" },
];

const SCRIBBLE = ["молоко, лук, хлеб…", "что-то к ужину?", "…и ещё забыл"] as const;

/** Каракули на бумажке переписываются в готовый список с количествами. */
function ListScene() {
  const ref = useRef<HTMLDivElement>(null);
  useOnceThenHover(ref, (reduced) => {
    const el = ref.current;
    if (!el || reduced) return;
    const scribble = el.querySelector<HTMLElement>("[data-scribble]");
    const rows = gsap.utils.toArray<HTMLElement>(el.querySelectorAll("[data-row]"));
    if (!scribble || rows.length === 0) return;

    gsap.set(scribble, { opacity: 1, x: 0 });
    gsap.set(rows, { opacity: 0, x: 10 });

    const tl = gsap.timeline();
    tl.to(scribble, { opacity: 0, x: -10, duration: 0.32, ease: "power2.in" }).to(
      rows,
      { opacity: 1, x: 0, duration: 0.28, stagger: 0.09, ease: "power3.out" },
      "-=0.12",
    );
    return () => tl.kill();
  });

  return (
    <SceneFrame label="Список покупок" rootRef={ref} hint="собран сам">
      <div className="relative h-full">
        <div
          data-scribble
          className="absolute inset-0 flex flex-col justify-center gap-1 opacity-0"
        >
          {SCRIBBLE.map((line) => (
            <span key={line} className="font-mono text-[13px] leading-4 text-muted italic">
              {line}
            </span>
          ))}
        </div>

        <div className="flex h-full flex-col justify-between">
          {LIST_ITEMS.map((item) => (
            <div
              key={item.id}
              data-row
              className="flex items-center gap-2 rounded-lg border border-line bg-surface px-2.5 py-1 leading-4"
            >
              <span className="size-4 shrink-0">
                <Ingredient id={item.id} className="h-full w-full" />
              </span>
              <span className="truncate text-[11.5px] font-bold tracking-tight">{item.name}</span>
              <span className="ml-auto font-mono text-[10px] text-muted">{item.qty}</span>
              <Check size={12} strokeWidth={3} className="shrink-0 text-accent" />
            </div>
          ))}
        </div>
      </div>
    </SceneFrame>
  );
}

const PANTRY: ReadonlyArray<{ id: IngredientId; name: string }> = [
  { id: "chicken", name: "Курица" },
  { id: "tomato", name: "Томаты" },
  { id: "basil", name: "Базилик" },
  { id: "onion", name: "Лук" },
];

/** Сканер честно пытается считать штрихкод — и уступает уже готовой полке. */
function ScannerScene() {
  const ref = useRef<HTMLDivElement>(null);
  useOnceThenHover(ref, (reduced) => {
    const el = ref.current;
    if (!el || reduced) return;
    const scanner = el.querySelector<HTMLElement>("[data-scanner]");
    const beam = el.querySelector<HTMLElement>("[data-beam]");
    const chips = gsap.utils.toArray<HTMLElement>(el.querySelectorAll("[data-chip]"));
    if (!scanner || !beam || chips.length === 0) return;

    gsap.set(scanner, { opacity: 1, scale: 1 });
    gsap.set(chips, { opacity: 0, y: 8 });

    const tl = gsap.timeline();
    tl.fromTo(
      beam,
      { y: 0 },
      { y: 30, duration: 0.4, repeat: 1, yoyo: true, ease: "none" },
    )
      .to(scanner, { opacity: 0, scale: 0.92, duration: 0.34, ease: "power2.in" })
      .to(
        chips,
        { opacity: 1, y: 0, duration: 0.3, stagger: 0.07, ease: "back.out(1.6)" },
        "-=0.14",
      );
    return () => tl.kill();
  });

  return (
    <SceneFrame label="Что дома" rootRef={ref} hint="без сканера">
      <div className="relative h-full">
        <div className="flex h-full flex-col justify-between">
          <div className="grid grid-cols-2 gap-1.5">
            {PANTRY.map((item) => (
              <span
                key={item.id}
                data-chip
                className="flex items-center gap-1.5 rounded-lg border border-line bg-surface px-2 py-1 leading-4"
              >
                <span className="size-4 shrink-0">
                  <Ingredient id={item.id} className="h-full w-full" />
                </span>
                <span className="truncate text-[11px] font-bold tracking-tight">{item.name}</span>
                <Check size={11} strokeWidth={3} className="ml-auto shrink-0 text-accent" />
              </span>
            ))}
          </div>

          <span
            data-chip
            className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.12em] text-muted uppercase"
          >
            <Check size={11} strokeWidth={3} className="text-accent" />
            учтено по плану
          </span>
        </div>

        <div
          data-scanner
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-ground opacity-0"
        >
          <span className="relative grid size-12 place-items-center overflow-hidden rounded-lg border border-line bg-surface">
            <Barcode size={22} className="text-muted" />
            <span data-beam className="absolute inset-x-1.5 top-1.5 h-px bg-danger/80" />
          </span>
          <span className="font-mono text-[9px] tracking-[0.12em] text-muted uppercase">
            сканируй каждый товар
          </span>
        </div>
      </div>
    </SceneFrame>
  );
}

/** Один пучок укропа расходится по трём блюдам недели, а не лежит до порчи. */
const REUSE = [
  { day: "Пн", dish: "Суп с курицей" },
  { day: "Ср", dish: "Салат" },
  { day: "Пт", dish: "Паста" },
] as const;

function WasteScene() {
  const ref = useRef<HTMLDivElement>(null);
  useOnceThenHover(ref, (reduced) => {
    const el = ref.current;
    if (!el || reduced) return;
    const node = el.querySelector<HTMLElement>("[data-node]");
    const paths = gsap.utils.toArray<SVGPathElement>(el.querySelectorAll("[data-link]"));
    const chips = gsap.utils.toArray<HTMLElement>(el.querySelectorAll("[data-dish]"));
    if (!node || paths.length === 0 || chips.length === 0) return;

    gsap.set(paths, { drawSVG: "0%" });
    gsap.set(chips, { opacity: 0, x: -10 });

    const tl = gsap.timeline();
    tl.fromTo(
      node,
      { scale: 0.86 },
      { scale: 1, duration: 0.35, ease: "back.out(2.4)" },
    )
      .to(paths, { drawSVG: "100%", duration: 0.42, stagger: 0.12, ease: "power2.out" }, "-=0.12")
      .to(chips, { opacity: 1, x: 0, duration: 0.3, stagger: 0.12, ease: "power3.out" }, "-=0.5");
    return () => tl.kill();
  });

  return (
    <SceneFrame
      label="Один продукт"
      rootRef={ref}
      hint={
        <>
          <Trash2 size={11} className="text-muted" />
          <s className="text-muted">в мусорку</s>
        </>
      }
    >
      <div className="flex h-full items-center gap-1">
        <div className="flex shrink-0 flex-col items-center gap-1">
          <span
            data-node
            className="grid size-11 place-items-center rounded-xl border border-line bg-surface"
          >
            <Ingredient id="dill" className="size-7" />
          </span>
          <span className="font-mono text-[8.5px] leading-3 tracking-[0.1em] text-muted uppercase">
            укроп
          </span>
        </div>

        <svg
          viewBox="0 0 28 92"
          aria-hidden="true"
          className="h-full w-7 shrink-0 text-accent"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeOpacity="0.7"
        >
          <path data-link d="M0 46 C 15 46, 13 13, 28 13" />
          <path data-link d="M0 46 L 28 46" />
          <path data-link d="M0 46 C 15 46, 13 79, 28 79" />
        </svg>

        <div className="flex h-full min-w-0 flex-1 flex-col justify-between">
          {REUSE.map((item) => (
            <span
              key={item.day}
              data-dish
              className="flex items-center gap-2 rounded-lg border border-line bg-surface px-2.5 py-1 leading-4"
            >
              <span className="font-mono text-[9.5px] font-bold tracking-[0.08em] text-accent uppercase">
                {item.day}
              </span>
              <span className="truncate text-[11.5px] font-bold tracking-tight">{item.dish}</span>
            </span>
          ))}
        </div>
      </div>
    </SceneFrame>
  );
}

/** Чек, из которого вычёркиваются импульсивные позиции. */
const RECEIPT: ReadonlyArray<{ name: string; qty: string; keep: boolean }> = [
  { name: "Куриное филе", qty: "800 г", keep: true },
  { name: "Помидоры", qty: "6 шт", keep: true },
  { name: "Чипсы", qty: "2 уп", keep: false },
  { name: "Базилик", qty: "1 пуч", keep: true },
  { name: "Печенье", qty: "1 уп", keep: false },
];

function BudgetScene() {
  const ref = useRef<HTMLDivElement>(null);
  useOnceThenHover(ref, (reduced) => {
    const el = ref.current;
    if (!el || reduced) return;
    const strikes = gsap.utils.toArray<HTMLElement>(el.querySelectorAll("[data-strike]"));
    const dropped = gsap.utils.toArray<HTMLElement>(el.querySelectorAll("[data-drop]"));
    const checks = gsap.utils.toArray<HTMLElement>(el.querySelectorAll("[data-keep]"));
    if (strikes.length === 0) return;

    gsap.set(strikes, { scaleX: 0 });
    gsap.set(dropped, { opacity: 1 });
    gsap.set(checks, { opacity: 0, scale: 0.5 });

    const tl = gsap.timeline();
    tl.to(strikes, { scaleX: 1, duration: 0.3, stagger: 0.14, ease: "power2.out" })
      .to(dropped, { opacity: 0.4, duration: 0.3, stagger: 0.14 }, "-=0.34")
      .to(
        checks,
        { opacity: 1, scale: 1, duration: 0.24, stagger: 0.07, ease: "back.out(2)" },
        "-=0.1",
      );
    return () => tl.kill();
  });

  return (
    <SceneFrame label="Чек за неделю" rootRef={ref} hint="только нужное">
      <div className="flex h-full flex-col justify-between">
        {RECEIPT.map((item) => (
          <span
            key={item.name}
            data-drop={item.keep ? undefined : true}
            className={`relative flex items-center gap-2 border-b border-dashed border-line/70 py-[2px] leading-[13px] last:border-b-0 ${
              item.keep ? "" : "opacity-40"
            }`}
          >
            <span className="truncate text-[11px] font-semibold tracking-tight">{item.name}</span>
            <span className="ml-auto shrink-0 font-mono text-[9.5px] text-muted">{item.qty}</span>
            {item.keep ? (
              <Check data-keep size={10} strokeWidth={3} className="shrink-0 text-accent" />
            ) : (
              <span className="w-2.5 shrink-0" />
            )}
            {item.keep ? null : (
              <span
                data-strike
                className="absolute inset-x-0 top-1/2 h-px origin-left bg-danger/70"
              />
            )}
          </span>
        ))}
      </div>
    </SceneFrame>
  );
}

const SCENES: Record<HomeTakeScene, () => ReactElement> = {
  calendar: CalendarScene,
  list: ListScene,
  scanner: ScannerScene,
  waste: WasteScene,
  budget: BudgetScene,
};

export function TakesSection() {
  return (
    <section className="py-16 md:py-28">
      <div className="mx-auto max-w-[1180px] px-6">
        <SectionKicker title={HOME.takesTitle} lead={HOME.takesLead} />

        <ul className="mt-10 grid gap-5 sm:grid-cols-2">
          {HOME.takes.map((take, i) => {
            const Scene = SCENES[take.scene];
            return (
              <Reveal key={take.title} delay={i * 70} as="li">
                <div className="flex h-full flex-col justify-between gap-6 rounded-2xl border border-line bg-surface p-7 transition-colors duration-200 hover:border-accent/25 md:p-8">
                  <div>
                    <h3 className="text-[22px] font-extrabold leading-snug tracking-tight md:text-[24px]">
                      {take.title}
                    </h3>
                    <p className="mt-3 text-[15.5px] leading-relaxed text-muted">{take.body}</p>
                  </div>
                  <Scene />
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
