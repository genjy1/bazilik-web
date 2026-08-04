"use client";

import { useRef, type ReactNode } from "react";
import { BASILIK_TOGGLE, CHAIN_BEFORE } from "@/lib/content";
import { MOTION_QUERIES, gsap, useIsomorphicLayoutEffect } from "@/lib/gsap";
import { BasilikChain } from "./BasilikChain";

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
}: {
  eyebrow: string;
  h1: ReactNode;
  lead: string;
  caption?: string;
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

      gsap
        .timeline({ defaults: { ease: "power3.out", duration: 0.8 } })
        .from(q("[data-ahero-eyebrow]"), { opacity: 0, y: 14 })
        .from(q("[data-ahero-h1]"), { opacity: 0, y: 20 }, "-=0.55")
        .from(q("[data-ahero-lead]"), { opacity: 0, y: 16 }, "-=0.55")
        .from(q("[data-ahero-chain]"), { opacity: 0, y: 18 }, "-=0.5");
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={root} id="top" className="relative pt-16 pb-10 md:pt-24 md:pb-14">
      <div className="mx-auto max-w-[900px] px-6">
        <div data-ahero-eyebrow className="eyebrow text-center">
          {eyebrow}
        </div>
        <h1
          data-ahero-h1
          className="mt-3.5 text-center text-[clamp(32px,5.6vw,58px)] tracking-[-0.045em]"
        >
          {h1}
        </h1>
        <p
          data-ahero-lead
          className="mx-auto mt-5 max-w-[58ch] text-center text-[clamp(16px,2vw,19px)] text-muted"
        >
          {lead}
        </p>

        <div
          data-ahero-chain
          className="mt-9 rounded-2xl border border-line bg-surface p-5 shadow-[0_24px_80px_rgba(18,88,58,0.10)] md:p-6"
        >
          <BasilikChain
            chain={CHAIN_BEFORE}
            keepLabel={BASILIK_TOGGLE.keepLabel}
            statusOff={BASILIK_TOGGLE.statusOff}
            statusOn={BASILIK_TOGGLE.statusOn}
            buttonOff={BASILIK_TOGGLE.buttonOff}
            buttonOn={BASILIK_TOGGLE.buttonOn}
          />
          {caption && (
            <p className="mt-4 max-w-[52ch] text-[14px] text-muted">{caption}</p>
          )}
        </div>
      </div>
    </section>
  );
}
