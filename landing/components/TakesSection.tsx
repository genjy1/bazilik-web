"use client";

import { Barcode, Check, Wallet } from "lucide-react";
import { useRef, type ReactElement, type RefObject } from "react";
import { HOME, type HomeTakeScene } from "@/lib/content";
import {
  MOTION_QUERIES,
  ScrollTrigger,
  gsap,
  useIsomorphicLayoutEffect,
} from "@/lib/gsap";
import { SectionKicker } from "./SectionKicker";
import { Ingredient } from "./ui/Ingredient";
import { Reveal } from "./ui/Reveal";

/** Проигрывает сцену один раз при попадании во вьюпорт, повтор — по ховеру карточки. */
function useOnceThenHover(
  cardRef: RefObject<HTMLElement | null>,
  build: () => (() => void) | void,
) {
  useIsomorphicLayoutEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const mm = gsap.matchMedia();

    mm.add(MOTION_QUERIES, (ctx) => {
      const { reduced } = ctx.conditions as { reduced: boolean };
      if (reduced) return;

      let cleanup: (() => void) | void;

      const st = ScrollTrigger.create({
        trigger: card,
        start: "top 82%",
        once: true,
        onEnter: () => {
          cleanup?.();
          cleanup = build();
        },
      });

      const onEnter = () => {
        cleanup?.();
        cleanup = build();
      };
      card.addEventListener("mouseenter", onEnter);

      return () => {
        st.kill();
        card.removeEventListener("mouseenter", onEnter);
        cleanup?.();
      };
    });

    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/** Календарь недели заполняется карточками блюд по очереди. */
function CalendarScene() {
  const ref = useRef<HTMLDivElement>(null);
  useOnceThenHover(ref, () => {
    const el = ref.current;
    if (!el) return;
    const cells = gsap.utils.toArray<HTMLElement>(el.querySelectorAll("[data-cell]"));
    const tl = gsap.timeline();
    tl.fromTo(
      cells,
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, duration: 0.3, stagger: 0.08, ease: "back.out(2)" },
    );
    return () => tl.kill();
  });

  return (
    <div ref={ref} className="grid grid-cols-7 gap-1.5">
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          data-cell
          className="flex aspect-square items-center justify-center rounded-lg border border-line bg-ground"
        >
          <span className="size-1.5 rounded-full bg-accent/60" />
        </div>
      ))}
    </div>
  );
}

/** Рукописный список сам переписывается в аккуратный чек-лист. */
function ListScene() {
  const ref = useRef<HTMLDivElement>(null);
  useOnceThenHover(ref, () => {
    const el = ref.current;
    if (!el) return;
    const scribble = el.querySelector<HTMLElement>("[data-scribble]");
    const clean = el.querySelector<HTMLElement>("[data-clean]");
    if (!scribble || !clean) return;
    const tl = gsap.timeline();
    tl.to(scribble, { opacity: 0, x: -8, duration: 0.3 }).fromTo(
      clean.querySelectorAll("[data-row]"),
      { opacity: 0, x: 8 },
      { opacity: 1, x: 0, duration: 0.25, stagger: 0.09 },
      "-=0.1",
    );
    return () => tl.kill();
  });

  return (
    <div ref={ref} className="relative h-16">
      <div
        data-scribble
        className="absolute inset-0 flex items-center font-mono text-[13px] text-muted italic"
      >
        молоко, лук, хлеб…
      </div>
      <div data-clean className="absolute inset-0 flex flex-col justify-center gap-1">
        {["Молоко", "Лук", "Хлеб"].map((item) => (
          <div key={item} data-row className="flex items-center gap-2 text-[13px]">
            <Check size={13} strokeWidth={3} className="text-herb" />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Сканер перечёркивается и растворяется, вместо него — спокойная галочка. */
function ScannerScene() {
  const ref = useRef<HTMLDivElement>(null);
  useOnceThenHover(ref, () => {
    const el = ref.current;
    if (!el) return;
    const scanner = el.querySelector<HTMLElement>("[data-scanner]");
    const ok = el.querySelector<HTMLElement>("[data-ok]");
    if (!scanner || !ok) return;
    const tl = gsap.timeline();
    tl.to(scanner, { opacity: 0, scale: 0.6, rotate: 12, duration: 0.35, ease: "power2.in" }).fromTo(
      ok,
      { opacity: 0, scale: 0.6 },
      { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2)" },
      "-=0.1",
    );
    return () => tl.kill();
  });

  return (
    <div ref={ref} className="relative flex h-10 items-center justify-center">
      <Barcode data-scanner size={28} className="absolute text-muted" aria-hidden="true" />
      <span
        data-ok
        className="absolute inline-flex items-center gap-1.5 rounded-full bg-herb/15 px-2.5 py-1 text-[11px] font-bold text-herb opacity-0"
      >
        <Check size={13} strokeWidth={3} /> помнит
      </span>
    </div>
  );
}

/** Продукт летит к мусорке, но Базилик перехватывает его в блюдо. */
function WasteScene() {
  const ref = useRef<HTMLDivElement>(null);
  useOnceThenHover(ref, () => {
    const el = ref.current;
    if (!el) return;
    const item = el.querySelector<HTMLElement>("[data-item]");
    if (!item) return;
    const tl = gsap.timeline();
    tl.to(item, { x: 34, y: 10, duration: 0.35, ease: "power1.in" })
      .to(item, { x: 0, y: -4, duration: 0.4, ease: "back.out(1.7)" })
      .to(item, { y: 0, duration: 0.2 });
    return () => tl.kill();
  });

  return (
    <div ref={ref} className="relative flex h-10 items-center justify-center">
      <div data-item className="size-8">
        <Ingredient id="dill" className="h-full w-full" />
      </div>
    </div>
  );
}

/** Корзина «сдувается», монеты возвращаются в кошелёк. */
function BudgetScene() {
  const ref = useRef<HTMLDivElement>(null);
  useOnceThenHover(ref, () => {
    const el = ref.current;
    if (!el) return;
    const cart = el.querySelector<HTMLElement>("[data-cart]");
    const wallet = el.querySelector<HTMLElement>("[data-wallet]");
    if (!cart || !wallet) return;
    const tl = gsap.timeline();
    tl.to(cart, { scale: 0.7, opacity: 0.4, duration: 0.35, ease: "power2.in" }).to(
      wallet,
      { scale: 1.15, duration: 0.25, ease: "back.out(2)" },
      "-=0.1",
    );
    return () => tl.kill();
  });

  return (
    <div ref={ref} className="relative flex h-10 items-center justify-center gap-3">
      <div data-cart className="size-7 rounded-md border border-line bg-ground" aria-hidden="true" />
      <Wallet data-wallet size={22} className="text-herb" aria-hidden="true" />
    </div>
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
        <SectionKicker n="03" title="Что ты получаешь" />

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {HOME.takes.map((take, i) => {
            const Scene = SCENES[take.scene];
            return (
              <Reveal key={take.title} delay={i * 70} as="li">
                <div className="flex h-full flex-col justify-between gap-5 rounded-2xl border border-line bg-surface p-5">
                  <div>
                    <h3 className="text-[16px] font-bold tracking-tight">{take.title}</h3>
                    <p className="mt-2 text-[14.5px] text-muted">{take.body}</p>
                  </div>
                  <div className="rounded-xl border border-line bg-ground p-3">
                    <Scene />
                  </div>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
