"use client";

import { Activity, Gauge, Recycle, Shuffle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useRef } from "react";
import { ENGINE, type EngineIcon } from "@/lib/content";
import {
  MOTION_OK,
  MOTION_QUERIES,
  gsap,
  useIsomorphicLayoutEffect,
} from "@/lib/gsap";

const icons: Record<EngineIcon, LucideIcon> = {
  gauge: Gauge,
  recycle: Recycle,
  shuffle: Shuffle,
  activity: Activity,
};

/** Максимальный доворот к курсору — заметно, но не аттракцион. */
const TILT = 6;

/**
 * Указательный слой включаем только там, где есть настоящий курсор и не
 * запрошено отключение движения. На тач-экранах наклон по курсору бессмыслен,
 * и там остаётся статичная карточка с ховер-состоянием из CSS.
 */
const POINTER_QUERY = `${MOTION_OK} and (pointer: fine)`;

/**
 * Одна карточка механики с собственным указательным слоем.
 *
 * Карточка доворачивается к курсору по X/Y, а мягкое пятно акцента следует за
 * ним — так плита ощущается физической, а не просто меняет рамку по :hover.
 * Значения догоняются через quickTo, поэтому дрожание курсора не передаётся в
 * наклон: цель ставится на каждый pointermove, а само значение к ней стекает.
 */
function EngineCard({ item }: { item: (typeof ENGINE)[number] }) {
  const root = useRef<HTMLElement>(null);
  const Icon = icons[item.icon];

  useIsomorphicLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add(POINTER_QUERY, () => {
      const inner = el.querySelector<HTMLElement>("[data-engine-inner]");
      const glow = el.querySelector<HTMLElement>("[data-engine-glow]");
      if (!inner) return;

      const rotX = gsap.quickTo(inner, "rotateX", {
        duration: 0.5,
        ease: "power3.out",
      });
      const rotY = gsap.quickTo(inner, "rotateY", {
        duration: 0.5,
        ease: "power3.out",
      });

      // Геометрия карточки не меняется во время наведения, поэтому снимаем
      // её один раз на pointerenter, а не на каждый pointermove.
      let rect = el.getBoundingClientRect();

      const applyPointer = (e: PointerEvent) => {
        const px = (e.clientX - rect.left) / rect.width; // 0..1 по горизонтали
        const py = (e.clientY - rect.top) / rect.height; // 0..1 по вертикали
        rotY((px - 0.5) * 2 * TILT);
        rotX((0.5 - py) * 2 * TILT);
        if (glow) {
          glow.style.setProperty("--mx", `${px * 100}%`);
          glow.style.setProperty("--my", `${py * 100}%`);
        }
      };

      const onMove = (e: PointerEvent) => {
        applyPointer(e);
      };

      const onEnter = (e: PointerEvent) => {
        rect = el.getBoundingClientRect();
        applyPointer(e);
        gsap.to(inner, {
          scale: 1.02,
          y: -4,
          duration: 0.4,
          ease: "power3.out",
        });
        if (glow) {
          gsap.to(glow, { opacity: 1, duration: 0.3, ease: "power2.out" });
        }
      };

      const onLeave = () => {
        rotX(0);
        rotY(0);
        gsap.to(inner, { scale: 1, y: 0, duration: 0.5, ease: "power3.out" });
        if (glow) {
          gsap.to(glow, { opacity: 0, duration: 0.45, ease: "power2.out" });
        }
      };

      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerenter", onEnter);
      el.addEventListener("pointerleave", onLeave);

      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerenter", onEnter);
        el.removeEventListener("pointerleave", onLeave);
        // onEnter/onLeave tween через gsap.to() создаются вне синхронного
        // исполнения mm.add(), поэтому matchMedia их не отслеживает — глушим
        // явно, иначе они продолжат писать в узел после unmount.
        gsap.killTweensOf(inner);
        if (glow) gsap.killTweensOf(glow);
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <article
      ref={root}
      data-reveal
      // Наклон живёт на вложенном слое, чтобы не спорить с трансформом входа,
      // который GSAP оставляет на самой карточке.
      className="group h-full [transform-style:preserve-3d]"
    >
      <div
        data-engine-inner
        className="relative h-full rounded-2xl border border-line bg-surface p-6 transition-[border-color,box-shadow] duration-300 group-hover:border-accent/35 group-hover:shadow-[0_18px_44px_rgba(0,0,0,0.35)]"
      >
        <div
          data-engine-glow
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0"
          style={{
            background:
              "radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), rgba(53,176,110,0.18), transparent 70%)",
          }}
        />
        <div className="relative">
          <div
            data-engine-icon
            className="mb-4 grid size-10 place-items-center rounded-xl bg-accent/13 text-accent-deep"
          >
            <Icon size={21} strokeWidth={2} />
          </div>
          <h3 className="mb-2.5 text-lg tracking-tight">{item.title}</h3>
          <p className="text-[15px] text-muted">{item.body}</p>
        </div>
      </div>
    </article>
  );
}

/**
 * Карточки механик с собственным выходом.
 *
 * Здесь один таймлайн со stagger, а не четыре независимых Reveal с ручными
 * задержками: у общего триггера карточки стартуют от одного положения секции,
 * поэтому шаг между ними ровный независимо от того, как быстро пролистали.
 *
 * Карточка приподнимается и доворачивается по X (нижний край ближе к зрителю),
 * иконка догоняет её с лёгким перелётом. Разные кривые для карточки и иконки
 * дают ощущение веса — плита тяжёлая, значок лёгкий. Дальше карточку
 * подхватывает указательный слой EngineCard.
 */
export function EngineCards() {
  const grid = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = grid.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add(MOTION_QUERIES, (ctx) => {
      const { reduced } = ctx.conditions as { reduced: boolean };

      const q = gsap.utils.selector(el);
      const cards = q("[data-reveal]");
      const marks = q("[data-engine-icon]");

      // При отключённом движении просто снимаем стартовое скрытие из CSS.
      if (reduced) {
        gsap.set(cards, { opacity: 1 });
        return;
      }

      const trigger = { trigger: el, start: "top 82%", once: true } as const;

      gsap.fromTo(
        cards,
        { opacity: 0, y: 44, scale: 0.96, rotateX: -12 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          duration: 0.75,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: trigger,
        },
      );

      gsap.fromTo(
        marks,
        { scale: 0, rotate: -25 },
        {
          scale: 1,
          rotate: 0,
          duration: 0.6,
          ease: "back.out(2)",
          stagger: 0.1,
          delay: 0.18,
          scrollTrigger: trigger,
        },
      );
    });

    return () => mm.revert();
  }, []);

  return (
    <div
      ref={grid}
      // Без перспективы у родителя доворот по X выглядит простым сжатием.
      style={{ perspective: "1000px" }}
      className="mt-11 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {ENGINE.map((item) => (
        <EngineCard key={item.title} item={item} />
      ))}
    </div>
  );
}
