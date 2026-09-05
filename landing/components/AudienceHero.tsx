"use client";

import { useRef, type ReactNode } from "react";
import { BASILIK_TOGGLE, CHAIN_BEFORE } from "@/lib/content";
import { MOTION_QUERIES, gsap, useIsomorphicLayoutEffect } from "@/lib/gsap";
import { BasilikChain } from "./BasilikChain";
import { BasilikToggleButton } from "./BasilikToggleButton";

/**
 * Геро обеих аудиторных страниц: H1 + лид + тумблер «Включить Базилик».
 * Единственная не завязанная на скролл анимация — вход текста при загрузке,
 * тот же приём, что и в геро корневой страницы (Hero.tsx).
 */
export function AudienceHero({
  eyebrow,
  h1,
  lead,
  caption,
  showChain = true,
  size = "default",
}: {
  eyebrow: string;
  h1: ReactNode;
  lead: string;
  caption?: string;
  /** Тумблер «Включить Базилик» уместен на клиентской (b2c) странице; на аудиторной странице специалистов это не их механика. */
  showChain?: boolean;
  /** "lg" — тот же визуальный вес заголовка, что у геро корневой страницы (Hero.tsx). */
  size?: "default" | "lg";
}) {
  const root = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add(MOTION_QUERIES, (ctx) => {
      const { reduced } = ctx.conditions as { reduced: boolean };
      if (reduced) return;

      const q = gsap.utils.selector(el);

      const tl = gsap
        .timeline({ defaults: { ease: "power3.out", duration: 0.8 } })
        .from(q("[data-ahero-eyebrow]"), { opacity: 0, y: 14 })
        .from(q("[data-ahero-h1]"), { opacity: 0, y: 20 }, "-=0.55")
        .from(q("[data-ahero-lead]"), { opacity: 0, y: 16 }, "-=0.55");

      if (showChain) {
        tl.from(q("[data-ahero-chain]"), { opacity: 0, y: 18 }, "-=0.5").from(
          q("[data-ahero-toggle]"),
          { opacity: 0, y: 14 },
          "-=0.5",
        );
      }
    });

    return () => mm.revert();
  }, [showChain]);

  return (
    <section ref={root} id="top" className="relative pt-16 pb-10 md:pt-24 md:pb-14">
      <div className="mx-auto max-w-[900px] px-6">
        <div data-ahero-eyebrow className="eyebrow text-center">
          {eyebrow}
        </div>
        <h1
          data-ahero-h1
          className={
            size === "lg"
              ? "mt-4 text-center text-[clamp(40px,8vw,92px)] leading-[0.94] tracking-[-0.05em]"
              : "mt-3.5 text-center text-[clamp(32px,5.6vw,58px)] tracking-[-0.045em]"
          }
        >
          {h1}
        </h1>
        <p
          data-ahero-lead
          className="mx-auto mt-5 max-w-[58ch] text-center text-[clamp(16px,2vw,19px)] text-muted"
        >
          {lead}
        </p>

        {showChain && (
          /*
           * Карточка с цепочкой и тумблер — одной колонкой, порядок зависит от
           * ширины. На десктопе цепочка помещается в две строки, и кнопка под
           * ней видна на первом экране. На телефоне восемь пилюль занимают
           * четыре сотни пикселей и уносят кнопку за сгиб: на 375×812 она
           * начиналась на 844 px, а cookie-баннер закрывал ещё 136 px снизу.
           * Поэтому до `md` кнопка стоит первой — сразу под лидом, — а
           * карточка за ней. DOM-порядок оставлен как на десктопе: в карточке
           * нет фокусируемых элементов, порядок Tab от перестановки не меняется.
           */
          <div className="flex flex-col">
            <div
              data-ahero-chain
              className="mt-6 rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow-panel)] md:mt-9 md:p-6"
            >
              <BasilikChain
                chain={CHAIN_BEFORE}
                keepLabel={BASILIK_TOGGLE.keepLabel}
                statusOff={BASILIK_TOGGLE.statusOff}
                statusOn={BASILIK_TOGGLE.statusOn}
              />
              {caption && (
                <p className="mt-4 max-w-[52ch] text-[14px] text-muted">{caption}</p>
              )}
            </div>

            {/* Тумблер вынесен из карточки: это не настройка виджета,
                а единственное действие, которое просит первый экран. */}
            <div
              data-ahero-toggle
              className="order-first mt-7 flex justify-center md:order-none"
            >
              <BasilikToggleButton
                labelOff={BASILIK_TOGGLE.buttonOff}
                labelOn={BASILIK_TOGGLE.buttonOn}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
