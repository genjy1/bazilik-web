"use client";

import { Leaf } from "lucide-react";
import { useRef } from "react";
import { useBasilikToggle } from "@/lib/basilikToggle";
import { MOTION_QUERIES, gsap, useIsomorphicLayoutEffect } from "@/lib/gsap";

type Props = {
  /** Все 8 шагов маршрута, от «решить» до «съесть». */
  chain: readonly string[];
  /** Подпись карточки, в которую сворачивается первый шаг («готовый план»). */
  keepLabel: string;
  statusOff: string;
  statusOn: string;
  buttonOff: string;
  buttonOn: string;
  /** Компактная версия — для повтора тумблера на финальном экране. */
  compact?: boolean;
  className?: string;
};

/**
 * Общий механизм «Базилик выключен → Включить Базилик», один на Hero и на
 * финальный экран каждой аудиторной страницы (см. landing-b2c.md §1/§7 и
 * landing-b2b2c.md §1/§8). Состояние on/off общее на страницу через
 * `useBasilikToggle`, поэтому клик в геро уже отражён в финале.
 *
 * Вместо анимации ширины/grid-rows (как в старом Problem.tsx на корневой
 * странице) здесь настоящий GSAP-каскад: средние шаги гаснут по одному
 * слева направо, только потом полная цепочка уступает место свёрнутой —
 * это и есть «сборка», а не резкий свитч.
 */
export function BasilikChain({
  chain,
  keepLabel,
  statusOff,
  statusOn,
  buttonOff,
  buttonOn,
  compact = false,
  className = "",
}: Props) {
  const { on, toggle } = useBasilikToggle();
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const fullRef = useRef<HTMLDivElement>(null);
  const compactRef = useRef<HTMLDivElement>(null);

  const kept = chain.slice(-2);
  const isFirstRun = useRef(true);

  useIsomorphicLayoutEffect(() => {
    const stage = stageRef.current;
    const full = fullRef.current;
    const compactEl = compactRef.current;
    if (!stage || !full || !compactEl) return;

    const mm = gsap.matchMedia();

    mm.add(MOTION_QUERIES, (ctx) => {
      const { reduced } = ctx.conditions as { reduced: boolean };

      if (reduced) {
        // Без анимации: просто нужный слой видим, второй скрыт и не мешает табу.
        gsap.set(full, { opacity: on ? 0 : 1, display: on ? "none" : "flex" });
        gsap.set(compactEl, { opacity: on ? 1 : 0, display: on ? "flex" : "none" });
        stage.style.height = "auto";
        return;
      }

      const middleItems = gsap.utils.toArray<HTMLElement>(
        full.querySelectorAll("[data-chain-mid]"),
      );
      const firstItem = full.querySelector<HTMLElement>("[data-chain-first]");

      const setStageHeight = (target: HTMLElement) => {
        stage.style.height = `${target.scrollHeight}px`;
      };

      // Точка отсчёта: высота стенда под текущее состояние без анимации.
      // aria-hidden — иначе скринридер видит оба слоя одновременно (opacity/
      // pointer-events не убирают невидимый слой из a11y-дерева).
      setStageHeight(on ? compactEl : full);
      gsap.set(full, {
        opacity: on ? 0 : 1,
        pointerEvents: on ? "none" : "auto",
        attr: { "aria-hidden": on ? "true" : "false" },
      });
      gsap.set(compactEl, {
        opacity: on ? 1 : 0,
        pointerEvents: on ? "auto" : "none",
        attr: { "aria-hidden": on ? "false" : "true" },
      });

      let tl: gsap.core.Timeline | null = null;

      const play = () => {
        tl?.kill();

        if (on) {
          // Выключено → включено: каскад гашения, потом свёрнутая цепочка.
          tl = gsap.timeline();
          tl.to(middleItems, {
            opacity: 0,
            scale: 0.4,
            y: -6,
            duration: 0.32,
            ease: "power2.in",
            stagger: 0.06,
          });
          if (firstItem) {
            tl.to(firstItem, { scale: 1.08, duration: 0.22, ease: "power2.out" }, "-=0.1")
              .to(firstItem, { scale: 1, duration: 0.18, ease: "power2.inOut" });
          }
          tl.to(stage, { height: compactEl.scrollHeight, duration: 0.4, ease: "power2.inOut" }, "-=0.1")
            .to(full, { opacity: 0, duration: 0.2 }, "<")
            .fromTo(
              compactEl,
              { opacity: 0, y: 10 },
              { opacity: 1, y: 0, duration: 0.45, ease: "back.out(1.6)" },
              "-=0.15",
            );
        } else {
          // Включено → выключено: обратная разборка (спека требует обратимости).
          tl = gsap.timeline();
          tl.to(compactEl, { opacity: 0, y: 8, duration: 0.22, ease: "power2.in" })
            .to(stage, { height: full.scrollHeight, duration: 0.4, ease: "power2.inOut" }, "-=0.05")
            .to(full, { opacity: 1, duration: 0.2 }, "<")
            .fromTo(
              middleItems,
              { opacity: 0, scale: 0.4, y: -6 },
              {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.32,
                ease: "power2.out",
                stagger: 0.06,
              },
              "-=0.1",
            );
        }
      };

      // На маунте состояние уже выставлено через gsap.set выше — играть
      // анимацию сборки/разборки нужно только при реальном клике по тумблеру.
      if (isFirstRun.current) {
        isFirstRun.current = false;
      } else {
        play();
      }

      return () => tl?.kill();
    });

    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on]);

  return (
    <div ref={rootRef} className={className}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
          <span
            aria-hidden="true"
            className={`size-1.5 rounded-full transition-colors duration-300 ${on ? "bg-accent" : "bg-muted/60"}`}
          />
          {on ? statusOn : statusOff}
        </div>
        <button
          type="button"
          aria-pressed={on}
          onClick={toggle}
          className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-transparent bg-accent px-4 py-2 text-sm font-bold tracking-tight text-on-accent shadow-[0_10px_26px_rgba(31,122,77,0.24)] transition-[transform,background-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-accent-deep active:translate-y-0"
        >
          <Leaf
            size={16}
            strokeWidth={2.5}
            className="transition-transform duration-300 group-hover:-rotate-12"
            aria-hidden="true"
          />
          {on ? buttonOn : buttonOff}
        </button>
      </div>

      <div ref={stageRef} className="relative overflow-hidden">
        <div
          ref={fullRef}
          className={`flex flex-wrap items-center gap-2 ${compact ? "" : "pb-1"}`}
        >
          {chain.map((step, i) => {
            const isFirst = i === 0;
            const isMid = i > 0 && i < chain.length - 2;
            return (
              <span key={step} className="inline-flex items-center gap-2">
                <span
                  data-chain-first={isFirst || undefined}
                  data-chain-mid={isMid || undefined}
                  className={`whitespace-nowrap rounded-full border px-3.5 py-2 text-sm font-bold tracking-tight ${
                    isFirst
                      ? "border-accent/40 bg-accent-soft text-accent-deep"
                      : "border-line bg-ground text-muted"
                  }`}
                >
                  {step}
                </span>
                {i < chain.length - 1 && (
                  <span aria-hidden="true" className="font-mono text-sm font-bold text-line">
                    →
                  </span>
                )}
              </span>
            );
          })}
        </div>

        <div
          ref={compactRef}
          className="absolute inset-0 flex flex-wrap items-center gap-2 opacity-0"
          style={{ pointerEvents: "none" }}
        >
          <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-accent/30 bg-accent-soft/70 px-4 py-2.5 text-[15px] font-extrabold tracking-tight text-accent-deep">
            ✓ {keepLabel}
          </span>
          <span aria-hidden="true" className="font-mono text-sm font-bold text-accent">
            →
          </span>
          {kept.map((step, i) => (
            <span key={step} className="inline-flex items-center gap-2">
              <span className="whitespace-nowrap rounded-full bg-accent px-4 py-2.5 text-[15px] font-extrabold tracking-tight text-on-accent shadow-[0_12px_28px_rgba(31,122,77,0.24)] sm:px-5 sm:text-base">
                {step}
              </span>
              {i < kept.length - 1 && (
                <span aria-hidden="true" className="font-mono text-sm font-bold text-accent">
                  →
                </span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
