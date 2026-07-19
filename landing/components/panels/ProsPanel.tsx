"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useIsomorphicLayoutEffect } from "@/lib/gsap";
import { PLAN_COVER, photoUrl } from "@/lib/images";
import { Chip } from "../ui/Chip";

const plans = [
  {
    title: "Снижение веса · 14 дней",
    meta: "42 покупки · 4,8 ★",
    price: "2 400 ₽",
    cover: PLAN_COVER.weightLoss,
  },
  {
    title: "Набор массы · 7 дней",
    meta: "18 покупок · 4,9 ★",
    price: "1 200 ₽",
    cover: PLAN_COVER.massGain,
  },
];

const ADHERENCE = 94;

export function ProsPanel() {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const bar = el.querySelector("[data-bar]");
    if (!bar) return;

    const mm = gsap.matchMedia();

    // Без анимации полоса уже отрисована на нужную ширину — обратный отсчёт
    // от нуля запускается только там, где движение разрешено.
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        bar,
        { width: "0%" },
        {
          width: `${ADHERENCE}%`,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 80%", once: true },
        },
      );
    });

    return () => mm.revert();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="overflow-hidden rounded-3xl border border-line bg-surface p-5 shadow-[0_2px_6px_rgba(22,35,28,0.05),0_18px_44px_rgba(22,35,28,0.1)]"
    >
      <div className="mb-4 flex items-center justify-between gap-3 border-b border-line pb-3.5">
        <div className="text-[15px] font-extrabold tracking-tight">Мои планы</div>
        <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
          Опубликовано · 3
        </div>
      </div>

      {plans.map((p) => (
        <div
          key={p.title}
          className="mb-2.5 flex items-center gap-3 rounded-2xl border border-line bg-ground p-2.5"
        >
          <Image
            src={photoUrl(p.cover, 44)}
            alt={p.cover.alt}
            width={44}
            height={44}
            className="size-11 shrink-0 rounded-xl bg-panel object-cover"
          />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[14.5px] font-bold tracking-tight">
              {p.title}
            </div>
            <div className="mt-0.5 font-mono text-[10px] tracking-wide text-muted">
              {p.meta}
            </div>
          </div>
          <div className="shrink-0 text-[15px] font-extrabold tracking-tight text-accent-deep">
            {p.price}
          </div>
        </div>
      ))}

      <div className="flex items-center gap-3 rounded-2xl border border-line bg-ground p-2.5">
        <Image
          src={photoUrl(PLAN_COVER.glutenFree, 44)}
          alt={PLAN_COVER.glutenFree.alt}
          width={44}
          height={44}
          className="size-11 shrink-0 rounded-xl object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[14.5px] font-bold tracking-tight">
            Без глютена · 7 дней
          </div>
          <div className="mt-0.5 font-mono text-[10px] tracking-wide text-muted">
            Приватный · 6 доступов
          </div>
        </div>
        <Chip className="shrink-0">приватный</Chip>
      </div>

      <div className="mt-4.5">
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
            Adherence клиентов
          </span>
          <span className="font-extrabold tracking-tight">{ADHERENCE}%</span>
        </div>
        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-line">
          <div
            data-bar
            className="h-full rounded-full bg-accent"
            style={{ width: `${ADHERENCE}%` }}
          />
        </div>
      </div>
    </div>
  );
}
