"use client";

import { useRef } from "react";
import { HOME } from "@/lib/content";
import {
  Draggable,
  MOTION_QUERIES,
  gsap,
  useIsomorphicLayoutEffect,
} from "@/lib/gsap";
import { SectionKicker } from "./SectionKicker";
import { Reveal } from "./ui/Reveal";

type Row = { title: string; left: string; right: string };

/**
 * Один ряд сравнения «обычное приложение / Базилик» с перетаскиваемым
 * разделителем (landing-b2c-motion.md §6). Левый слой обрезается по ширине
 * и лежит поверх правого — классический приём before/after.
 */
function CompareSlider({ row }: { row: Row }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    const left = leftRef.current;
    const handle = handleRef.current;
    if (!container || !left || !handle) return;

    const mm = gsap.matchMedia();

    mm.add(MOTION_QUERIES, (ctx) => {
      const { reduced } = ctx.conditions as { reduced: boolean };

      let width = container.clientWidth;
      const setPercent = (px: number) => {
        const percent = gsap.utils.clamp(0, 100, (px / width) * 100);
        left.style.width = `${percent}%`;
        handle.setAttribute("aria-valuenow", String(Math.round(percent)));
      };

      gsap.set(handle, { x: width / 2 });
      setPercent(width / 2);

      if (reduced) {
        return;
      }

      const draggable = Draggable.create(handle, {
        type: "x",
        bounds: { minX: 0, maxX: width },
        onDrag: function onDrag(this: Draggable) {
          setPercent(this.x);
        },
      })[0];

      // Тот же разделитель управляется клавиатурой — стрелки двигают его
      // на 5% ширины, Home/End прыгают к краям (доступность: без этого
      // сравнение "обычное приложение / Базилик" недоступно с клавиатуры
      // и скринридеру вовсе).
      const moveTo = (x: number) => {
        const clampedX = gsap.utils.clamp(0, width, x);
        gsap.set(handle, { x: clampedX });
        draggable.update();
        setPercent(clampedX);
      };

      const onKeyDown = (e: KeyboardEvent) => {
        const step = width * 0.05;
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          moveTo(draggable.x - step);
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          moveTo(draggable.x + step);
        } else if (e.key === "Home") {
          e.preventDefault();
          moveTo(0);
        } else if (e.key === "End") {
          e.preventDefault();
          moveTo(width);
        }
      };
      handle.addEventListener("keydown", onKeyDown);

      // Ширина контейнера может измениться (ресайз, поворот экрана) —
      // держим bounds и позицию разделителя в актуальном состоянии.
      const onResize = () => {
        width = container.clientWidth;
        draggable.applyBounds({ minX: 0, maxX: width });
        const clampedX = gsap.utils.clamp(0, width, draggable.x);
        gsap.set(handle, { x: clampedX });
        setPercent(clampedX);
      };
      window.addEventListener("resize", onResize);

      return () => {
        window.removeEventListener("resize", onResize);
        handle.removeEventListener("keydown", onKeyDown);
        draggable.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <div>
      <Reveal>
        <h3 className="text-[15.5px] font-bold tracking-tight">{row.title}</h3>
      </Reveal>

      <Reveal delay={60}>
        <div
          ref={containerRef}
          className="relative mt-3 h-44 overflow-hidden rounded-xl border border-line select-none sm:h-32"
        >
          {/* Базилик — нижний слой, виден целиком. */}
          <div className="absolute inset-0 flex items-start bg-accent-soft/60 px-5 py-4 sm:items-center">
            <p className="max-w-[70%] pt-5 text-[13.5px] font-medium text-accent-deep sm:pt-0">
              {row.right}
            </p>
            <span className="absolute top-2.5 right-3 font-mono text-[9px] uppercase tracking-[0.14em] text-accent-deep/70">
              Базилик
            </span>
          </div>

          {/* Обычное приложение — верхний слой, обрезается разделителем. */}
          <div
            ref={leftRef}
            className="absolute inset-y-0 left-0 overflow-hidden bg-ground"
            style={{ width: "50%" }}
          >
            <div className="flex h-full min-w-max items-start px-5 py-4 sm:items-center">
              <p className="w-[min(70vw,320px)] pt-5 text-[13.5px] text-muted sm:pt-0">
                {row.left}
              </p>
              <span className="absolute top-2.5 left-3 font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
                обычное приложение
              </span>
            </div>
          </div>

          {/* Разделитель. */}
          <div
            ref={handleRef}
            role="slider"
            tabIndex={0}
            aria-orientation="horizontal"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={50}
            aria-label={`Сравнение «обычное приложение / Базилик»: ${row.title}`}
            className="absolute inset-y-0 left-0 z-10 w-0.5 cursor-ew-resize bg-accent"
          >
            <div className="absolute top-1/2 left-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-accent bg-surface text-accent shadow-[0_6px_18px_rgba(0,0,0,0.2)]">
              <span aria-hidden="true" className="font-mono text-[11px]">
                ↔
              </span>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

/** landing-b2c.md §5 / landing-b2c-motion.md §6 — «Чем мы не как все». */
export function ComparisonSection() {
  const { comparison } = HOME;

  return (
    <section className="py-16 md:py-28">
      <div className="mx-auto max-w-[1180px] px-6">
        <SectionKicker n="05" title={comparison.title} lead={comparison.lead} />

        <div className="mt-10 grid gap-8">
          {comparison.rows.map((row) => (
            <CompareSlider key={row.title} row={row} />
          ))}
        </div>

        <Reveal delay={120}>
          <p className="mt-8 text-[15.5px] font-bold tracking-tight text-accent-deep">
            {comparison.outro}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
