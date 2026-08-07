"use client";

import { Barcode, Check, Trash2, Wallet } from "lucide-react";
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

/**
 * Проигрывает сцену один раз при попадании во вьюпорт, повтор — по ховеру
 * или тапу карточки. При prefers-reduced-motion сцена всё равно строится
 * (см. build(reduced)), чтобы конечное состояние не зависало на середине —
 * так же, как Reveal доводит элемент до opacity:1 с duration:0.
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

/** Календарь недели заполняется разными по форме отметками — не одна и та же точка на каждый день. */
function CalendarScene() {
  const ref = useRef<HTMLDivElement>(null);
  useOnceThenHover(ref, (reduced) => {
    const el = ref.current;
    if (!el || reduced) return;
    const cells = gsap.utils.toArray<HTMLElement>(el.querySelectorAll("[data-cell]"));
    const tl = gsap.timeline();
    tl.fromTo(
      cells,
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, duration: 0.3, stagger: 0.08, ease: "back.out(2)" },
    );
    return () => tl.kill();
  });

  const marks = ["circle", "bar", "square"] as const;

  return (
    <div ref={ref} className="grid grid-cols-7 gap-1.5">
      {Array.from({ length: 7 }).map((_, i) => {
        const mark = marks[i % marks.length];
        return (
          <div
            key={i}
            data-cell
            className="flex aspect-square items-center justify-center rounded-lg border border-line bg-ground"
          >
            {mark === "circle" && <span className="size-1.5 rounded-full bg-accent/60" />}
            {mark === "bar" && <span className="h-1 w-2.5 rounded-full bg-accent/60" />}
            {mark === "square" && <span className="size-1.5 rounded-[3px] bg-accent/60" />}
          </div>
        );
      })}
    </div>
  );
}

/** Рукописный список сам переписывается в аккуратный чек-лист. */
function ListScene() {
  const ref = useRef<HTMLDivElement>(null);
  useOnceThenHover(ref, (reduced) => {
    const el = ref.current;
    if (!el) return;
    const scribble = el.querySelector<HTMLElement>("[data-scribble]");
    const clean = el.querySelector<HTMLElement>("[data-clean]");
    if (!scribble || !clean) return;
    const tl = gsap.timeline();
    tl.to(scribble, { opacity: 0, x: reduced ? 0 : -8, duration: reduced ? 0 : 0.3 }).fromTo(
      clean.querySelectorAll("[data-row]"),
      { opacity: 0, x: reduced ? 0 : 8 },
      { opacity: 1, x: 0, duration: reduced ? 0 : 0.25, stagger: reduced ? 0 : 0.09 },
      reduced ? 0 : "-=0.1",
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
      <div data-clean className="absolute inset-0 flex flex-col justify-center gap-1 opacity-0">
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
  useOnceThenHover(ref, (reduced) => {
    const el = ref.current;
    if (!el) return;
    const scanner = el.querySelector<HTMLElement>("[data-scanner]");
    const ok = el.querySelector<HTMLElement>("[data-ok]");
    if (!scanner || !ok) return;
    const tl = gsap.timeline();
    tl.to(scanner, {
      opacity: 0,
      scale: reduced ? 1 : 0.6,
      rotate: reduced ? 0 : 12,
      duration: reduced ? 0 : 0.35,
      ease: "power2.in",
    }).fromTo(
      ok,
      { opacity: 0, scale: reduced ? 1 : 0.6 },
      { opacity: 1, scale: 1, duration: reduced ? 0 : 0.35, ease: "back.out(2)" },
      reduced ? 0 : "-=0.1",
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
  useOnceThenHover(ref, (reduced) => {
    const el = ref.current;
    if (!el || reduced) return;
    const item = el.querySelector<HTMLElement>("[data-item]");
    const bin = el.querySelector<HTMLElement>("[data-bin]");
    if (!item || !bin) return;
    const tl = gsap.timeline();
    tl.to(item, { x: 30, y: 8, rotate: 10, duration: 0.35, ease: "power1.in" })
      .to(bin, { scale: 1.2, rotate: -8, duration: 0.15, ease: "power1.out" }, "-=0.08")
      .to(bin, { scale: 1, rotate: 0, duration: 0.2 })
      .to(item, { x: 0, y: -4, rotate: 0, duration: 0.4, ease: "back.out(1.7)" }, "-=0.25")
      .to(item, { y: 0, duration: 0.2 });
    return () => tl.kill();
  });

  return (
    <div ref={ref} className="relative flex h-10 items-center justify-center">
      <Trash2 data-bin size={15} className="absolute right-0.5 bottom-0 text-muted/50" aria-hidden="true" />
      <div data-item className="size-8">
        <Ingredient id="dill" className="h-full w-full" />
      </div>
    </div>
  );
}

/** Корзина «сдувается», монеты возвращаются в кошелёк. */
function BudgetScene() {
  const ref = useRef<HTMLDivElement>(null);
  useOnceThenHover(ref, (reduced) => {
    const el = ref.current;
    if (!el || reduced) return;
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

        <ul className="mt-10 grid gap-5 sm:grid-cols-2">
          {HOME.takes.map((take, i) => {
            const Scene = SCENES[take.scene];
            return (
              <Reveal key={take.title} delay={i * 70} as="li">
                <div className="flex h-full flex-col justify-between gap-6 rounded-2xl border border-line bg-surface p-7 transition-colors duration-200 hover:border-accent/25 md:p-8">
                  <div>
                    <span className="font-mono text-[13px] font-bold tracking-[0.14em] text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-2 text-[22px] font-extrabold leading-snug tracking-tight md:text-[24px]">
                      {take.title}
                    </h3>
                    <p className="mt-3 text-[15.5px] leading-relaxed text-muted">{take.body}</p>
                  </div>
                  <div className="rounded-xl border border-line bg-ground p-4">
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
