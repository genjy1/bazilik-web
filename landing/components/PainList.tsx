"use client";

import { Calculator, Copy, FileText, MessageCircle, Search, Trash2 } from "lucide-react";
import { useRef, type ReactElement } from "react";
import type { ProsPainKind } from "@/lib/content";
import { PROS } from "@/lib/content";
import { gsap, useLoopWhileVisible } from "@/lib/gsap";
import { SectionKicker } from "./SectionKicker";
import { Reveal } from "./ui/Reveal";

/** Копия «штампуется» под нового клиента — счётчик тикает 1 → 2 → 3. */
function CloneScene({ delay = 0 }: { delay?: number }) {
  const iconRef = useRef<HTMLSpanElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  useLoopWhileVisible(iconRef, (el) => {
    const count = countRef.current;
    if (!count) return;
    const tl = gsap.timeline({ repeat: 2, repeatDelay: 0.5 });
    [2, 3, 1].forEach((n) => {
      tl.to(el, { scale: 1.18, duration: 0.14, ease: "power1.out" })
        .call(() => {
          count.textContent = `×${n}`;
        })
        .to(el, { scale: 1, duration: 0.18, ease: "power2.inOut" });
    });
    return () => tl.kill();
  }, delay);
  return (
    <div className="flex items-center gap-2">
      <span ref={iconRef} className="grid size-8 shrink-0 place-items-center rounded-full bg-ground text-muted">
        <Copy size={15} aria-hidden="true" />
      </span>
      <span ref={countRef} className="font-mono text-[11px] font-bold text-muted">
        ×1
      </span>
    </div>
  );
}

/** КБЖУ дёргается между значениями, будто пересчитывается вручную. */
function ManualScene({ delay = 0 }: { delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useLoopWhileVisible(ref, (el) => {
    const label = el.querySelector<HTMLElement>("[data-kbju]");
    const icon = el.querySelector<HTMLElement>("[data-calc]");
    if (!label || !icon) return;
    const values = ["412", "398", "430", "406"];
    let i = 0;
    const tl = gsap.timeline({ repeat: 2, repeatDelay: 0.6 });
    values.forEach(() => {
      tl.to(icon, { rotate: -6, duration: 0.08 })
        .to(icon, { rotate: 6, duration: 0.08 })
        .to(icon, { rotate: 0, duration: 0.08 })
        .call(() => {
          i = (i + 1) % values.length;
          label.textContent = values[i];
        });
    });
    return () => tl.kill();
  }, delay);
  return (
    <div ref={ref} className="flex items-center gap-2">
      <span data-calc className="grid size-8 shrink-0 place-items-center rounded-full bg-ground text-muted">
        <Calculator size={15} aria-hidden="true" />
      </span>
      <span data-kbju className="font-mono text-[11px] font-bold text-muted">
        412
      </span>
      <span className="font-mono text-[10px] text-muted">ккал</span>
    </div>
  );
}

/** Сообщение от клиента всплывает, потом уступает место вечерней пересборке. */
function RequestScene({ delay = 0 }: { delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useLoopWhileVisible(ref, (el) => {
    const bubble = el.querySelector<HTMLElement>("[data-bubble]");
    if (!bubble) return;
    const texts = ["надоело", "аллергия"];
    let i = 0;
    const tl = gsap.timeline({ repeat: 2, repeatDelay: 0.7 });
    tl.fromTo(
      bubble,
      { opacity: 0, y: 6, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.24, ease: "back.out(2)" },
    )
      .to(bubble, { opacity: 0, y: -6, duration: 0.2, ease: "power1.in" }, "+=0.6")
      .call(() => {
        i = (i + 1) % texts.length;
        bubble.textContent = texts[i];
      });
    return () => tl.kill();
  }, delay);
  return (
    <div ref={ref} className="flex items-center gap-2">
      <MessageCircle size={16} className="shrink-0 text-muted" aria-hidden="true" />
      <span
        data-bubble
        className="rounded-full border border-line bg-ground px-2.5 py-1 text-[11px] font-semibold text-muted opacity-0"
      >
        надоело
      </span>
    </div>
  );
}

/** План в PDF «стареет» по дням недели и уезжает в корзину к среде. */
function ExpiryScene({ delay = 0 }: { delay?: number }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  useLoopWhileVisible(wrapRef, (el) => {
    const file = el.querySelector<HTMLElement>("[data-file]");
    const badge = badgeRef.current;
    if (!file || !badge) return;

    const tl = gsap.timeline({ repeat: 2, repeatDelay: 0.6 });
    const steps = ["Пн", "Вт", "Ср"];
    steps.forEach((label, i) => {
      tl.call(() => {
        badge.textContent = label;
      }, undefined, i * 0.4);
    });
    tl.to(file, { y: 22, x: 8, opacity: 0, rotate: 10, duration: 0.45, ease: "power1.in" }, "+=0.1")
      .set(file, { y: 0, x: 0, rotate: 0 })
      .call(() => {
        badge.textContent = steps[0];
      })
      .to(file, { opacity: 1, duration: 0.3 });

    return () => tl.kill();
  }, delay);

  return (
    <div ref={wrapRef} className="flex items-center gap-2">
      <div data-file className="relative">
        <FileText size={16} className="text-muted" aria-hidden="true" />
      </div>
      <span
        ref={badgeRef}
        className="rounded-full border border-amber/40 bg-amber/10 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-deep"
      >
        Пн
      </span>
      <Trash2 size={15} className="text-muted" aria-hidden="true" />
    </div>
  );
}

/** Иконка поиска мечется туда-сюда, не находя устойчивого потока клиентов. */
function SearchScene({ delay = 0 }: { delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useLoopWhileVisible(ref, (el) => {
    const tl = gsap.timeline({ repeat: 2, repeatDelay: 0.5 });
    tl.to(el, { rotate: -16, x: -3, duration: 0.22, ease: "power1.inOut" })
      .to(el, { rotate: 12, x: 3, duration: 0.28, ease: "power1.inOut" })
      .to(el, { rotate: 0, x: 0, duration: 0.2, ease: "power1.inOut" });
    return () => tl.kill();
  }, delay);
  return (
    <span ref={ref} className="grid size-8 shrink-0 place-items-center rounded-full bg-ground text-muted">
      <Search size={15} aria-hidden="true" />
    </span>
  );
}

const SCENES: Record<ProsPainKind, (props: { delay?: number }) => ReactElement> = {
  clone: CloneScene,
  manual: ManualScene,
  request: RequestScene,
  expiry: ExpiryScene,
  search: SearchScene,
};

/** Небольшой хаотичный перекос на карточку — та же нервная деталь, что и на главной. */
const TILTS = ["rotate-[-2deg]", "rotate-[1.5deg]", "rotate-[-1deg]", "rotate-[2deg]", "rotate-[-1.5deg]"];

/** Разносит старт сцен по карточкам — иначе все срываются в одном кадре. */
const SCENE_STAGGER_MS = 300;

/**
 * Боли специалиста — тот же приём, что и PainChaos на главной: карточки с
 * лёгким перекосом и зацикленной мини-сценой, а не плоский список.
 */
export function PainList() {
  const { title, items } = PROS.pain;

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[1180px] px-6">
        <SectionKicker n="02" title={title} />

        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {items.map((item, i) => {
            const Scene = SCENES[item.kind];
            return (
              <Reveal
                key={item.text}
                as="li"
                delay={i * 90}
                className={`flex items-center justify-between gap-4 rounded-2xl border border-line bg-surface px-5 py-4 ${TILTS[i % TILTS.length]}`}
              >
                <span className="text-[15.5px] text-ink">{item.text}</span>
                <Scene delay={i * SCENE_STAGGER_MS} />
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
