"use client";

import { Check, Zap } from "lucide-react";
import { useRef } from "react";
import { useBasilikToggle } from "@/lib/basilikToggle";
import { MOTION_QUERIES, gsap, useIsomorphicLayoutEffect } from "@/lib/gsap";

/**
 * Крупный тумблер «Включить Базилик» — главный интерактив первого экрана.
 *
 * Живёт отдельно от карточки с цепочкой (`BasilikChain`): в шапке карточки
 * кнопка читалась как служебный переключатель внутри виджета, хотя это
 * единственное действие, которое страница просит сделать.
 *
 * Пока выключено — мягкая пульсация 1 → 1.03 (landing-b2c-motion.md §2).
 * Пульсация висит на обёртке, а не на самой кнопке: hover-подъём сделан
 * CSS-трансформом, и обе анимации на одном элементе перетирали бы друг друга.
 */
export function BasilikToggleButton({
  labelOff,
  labelOn,
  className = "",
}: {
  labelOff: string;
  labelOn: string;
  className?: string;
}) {
  const { on, toggle } = useBasilikToggle();
  const wrapRef = useRef<HTMLSpanElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add(MOTION_QUERIES, (ctx) => {
      const { reduced } = ctx.conditions as { reduced: boolean };
      // Включённое состояние не зовёт нажимать — приглашение уже сработало.
      if (reduced || on) {
        gsap.set(el, { scale: 1 });
        return;
      }

      const tw = gsap.to(el, {
        scale: 1.03,
        duration: 1.1,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        // Пауза перед первым «вдохом»: иначе кнопка дышит уже во время
        // въезда геро и движение накладывается само на себя.
        delay: 1.2,
      });

      return () => {
        tw.kill();
      };
    });

    return () => mm.revert();
  }, [on]);

  return (
    <span ref={wrapRef} className={`inline-block will-change-transform ${className}`}>
      <button
        type="button"
        aria-pressed={on}
        onClick={toggle}
        className={
          "group inline-flex min-h-14 items-center justify-center gap-2.5 rounded-full " +
          "px-7 py-4 text-[16px] font-extrabold tracking-tight whitespace-nowrap sm:px-9 sm:text-[18px] " +
          "transition-[transform,background-color,border-color,color,box-shadow] duration-200 " +
          "hover:-translate-y-0.5 active:translate-y-0 " +
          (on
            ? // Включено — кнопка отходит на второй план: рядом уже горит
              // изумрудная свёрнутая цепочка, второй такой же блок с ней спорит.
              "border border-accent/40 bg-accent-soft text-accent-deep " +
              "shadow-[0_6px_18px_rgba(31,122,77,0.12)] hover:border-accent"
            : "border border-transparent bg-accent text-on-accent " +
              "shadow-[0_2px_8px_rgba(31,122,77,0.28),0_18px_44px_rgba(31,122,77,0.28)] " +
              "hover:bg-accent-deep")
        }
      >
        {on ? (
          <Check size={20} strokeWidth={3} aria-hidden="true" />
        ) : (
          <Zap
            size={20}
            strokeWidth={2.6}
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:-rotate-12"
          />
        )}
        {on ? labelOn : labelOff}
      </button>
    </span>
  );
}
