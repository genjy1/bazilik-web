"use client";

import { useRef } from "react";
import { HOME } from "@/lib/content";
import type { IngredientId } from "@/lib/ingredients";
import {
  MOTION_QUERIES,
  ScrollTrigger,
  clamp01,
  easeOut,
  gsap,
  remap,
  useIsomorphicLayoutEffect,
} from "@/lib/gsap";
import { SectionKicker } from "./SectionKicker";
import { Ingredient } from "./ui/Ingredient";

/* ============================================================
   «Как это работает» — сцена сборки блюда, 2D-версия главной механики
   RecipeAssembly.tsx (та же идея «скролл = время готовки», но на DOM/SVG,
   а не three.js — see landing-b2c-motion.md §4).

   Один pin, прогресс 0..1 гоняет всё как чистую функцию — обратимо, как и
   в RecipeAssembly. Только transform/opacity, никаких width/top в скролле.
   ============================================================ */

type Move = {
  id: IngredientId;
  from: { x: number; y: number; rot: number };
  to: { x: number; y: number; rot: number };
  enter: [number, number];
};

const MOVES: Move[] = [
  { id: "tomato", from: { x: -140, y: -90, rot: -20 }, to: { x: -22, y: 10, rot: 0 }, enter: [0.52, 0.72] },
  { id: "chicken", from: { x: 150, y: -70, rot: 16 }, to: { x: 20, y: -6, rot: 0 }, enter: [0.56, 0.76] },
  { id: "basil", from: { x: -120, y: 100, rot: -12 }, to: { x: 6, y: 20, rot: 0 }, enter: [0.6, 0.8] },
  { id: "garlic", from: { x: 130, y: 90, rot: 14 }, to: { x: -8, y: -18, rot: 0 }, enter: [0.64, 0.84] },
];

const SHOPPING = ["Куриное филе", "Помидоры", "Базилик", "Чеснок"];

export function DishAssemblyScene() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;

    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-item]"));
    const shopRows = Array.from(root.querySelectorAll<HTMLElement>("[data-shop]"));
    const plate = root.querySelector<HTMLElement>("[data-plate]");
    const steam = root.querySelector<HTMLElement>("[data-steam]");
    const captions = Array.from(root.querySelectorAll<HTMLElement>("[data-caption]"));
    const progressFill = root.querySelector<HTMLElement>("[data-progress]");

    function apply(p: number) {
      items.forEach((el, i) => {
        const move = MOVES[i];
        const t = easeOut(remap(p, move.enter[0], move.enter[1]));
        const x = move.from.x + (move.to.x - move.from.x) * t;
        const y = move.from.y + (move.to.y - move.from.y) * t;
        const rot = move.from.rot + (move.to.rot - move.from.rot) * t;
        el.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`;
        el.style.opacity = String(0.55 + 0.45 * t);
      });

      shopRows.forEach((el, i) => {
        const rf = remap(p, 0.16 + i * 0.06, 0.3 + i * 0.06);
        el.style.opacity = String(rf);
        el.style.transform = `translateX(${(1 - rf) * -10}px)`;
        const check = el.querySelector<HTMLElement>("[data-check]");
        if (check) check.style.opacity = String(remap(p, 0.2 + i * 0.06, 0.34 + i * 0.06));
      });

      if (plate) {
        const dishT = easeOut(remap(p, 0.5, 0.86));
        plate.style.opacity = String(0.3 + dishT * 0.7);
        plate.style.transform = `scale(${0.9 + dishT * 0.1})`;
      }
      if (steam) steam.style.opacity = String(remap(p, 0.86, 1));

      captions.forEach((el, i) => {
        const third = 1 / captions.length;
        const start = i * third;
        const end = start + third;
        const fade = Math.min(remap(p, start, start + 0.06), 1 - remap(p, end - 0.06, end));
        el.style.opacity = String(i === captions.length - 1 ? remap(p, start, start + 0.06) : fade);
      });

      if (progressFill) progressFill.style.transform = `scaleX(${clamp01(p)})`;
    }

    const mm = gsap.matchMedia();

    mm.add(MOTION_QUERIES, (ctx) => {
      const { reduced } = ctx.conditions as { reduced: boolean };

      if (reduced) {
        apply(1);
        return;
      }

      apply(0);

      const st = ScrollTrigger.create({
        trigger: stage,
        start: "top top",
        end: () => "+=" + window.innerHeight * 1.4,
        pin: stage,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => apply(self.progress),
        onRefresh: (self) => apply(self.progress),
      });

      return () => st.kill();
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={rootRef} id="how" className="relative">
      <div ref={stageRef} className="relative h-screen w-full overflow-hidden bg-ground">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%]"
          style={{
            background:
              "radial-gradient(60% 80% at 50% 100%, rgba(53,176,110,0.16) 0%, transparent 70%)",
          }}
        />

        <div className="relative mx-auto flex h-full max-w-[1180px] flex-col px-6">
          <header className="pt-20 md:pt-24">
            <SectionKicker n="04" title="Три шага — и неделя спланирована" />

            <div className="relative mt-6 h-6 max-w-[52ch]">
              {HOME.process.map((step, i) => (
                <p
                  key={step.caption}
                  data-caption
                  className="absolute inset-x-0 top-0 text-[15px] text-muted"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                >
                  {step.caption}
                </p>
              ))}
            </div>

            <div className="mt-5 h-[3px] w-44 overflow-hidden rounded-full bg-line">
              <div data-progress className="h-full origin-left bg-accent" style={{ transform: "scaleX(0)" }} />
            </div>
          </header>

          <div className="relative flex-1">
            {/* Тарелка по центру. */}
            <div
              data-plate
              className="absolute top-1/2 left-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-line bg-surface/90 shadow-[0_18px_44px_rgba(0,0,0,0.28)] md:size-52"
              style={{ opacity: 0.3 }}
            >
              <div
                data-steam
                aria-hidden="true"
                className="absolute -top-6 left-1/2 h-8 w-10 -translate-x-1/2 rounded-full bg-white/10 blur-md"
                style={{ opacity: 0 }}
              />
            </div>

            {/* Продукты вокруг тарелки. */}
            {MOVES.map((move) => (
              <div
                key={move.id}
                data-item
                className="absolute top-1/2 left-1/2 size-12 md:size-14"
                style={{ marginLeft: -24, marginTop: -24 }}
              >
                <Ingredient id={move.id} className="h-full w-full drop-shadow-md" />
              </div>
            ))}
          </div>

          {/* Список покупок. */}
          <div className="mb-14 ml-auto w-full max-w-[280px] md:mb-16">
            <ul className="flex flex-col gap-1.5">
              {SHOPPING.map((name) => (
                <li
                  key={name}
                  data-shop
                  className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface/90 px-3.5 py-2 opacity-0"
                >
                  <span className="text-[13.5px] font-bold tracking-tight">{name}</span>
                  <span data-check className="text-herb opacity-0">
                    ✓
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
