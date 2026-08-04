"use client";

import { Trash2 } from "lucide-react";
import { useRef, type ReactElement, type RefObject } from "react";
import type { HomePainKind } from "@/lib/content";
import { HOME } from "@/lib/content";
import { MOTION_QUERIES, gsap, useIsomorphicLayoutEffect } from "@/lib/gsap";
import { SectionKicker } from "./SectionKicker";
import { Ingredient } from "./ui/Ingredient";
import { Reveal } from "./ui/Reveal";

/**
 * Запускает цикл только пока карточка видна — не тратит кадры за кадром экрана.
 * `delayMs` разносит старт нескольких карточек во времени: без него все сцены
 * начинают анимацию в один и тот же кадр (все становятся видимы почти
 * одновременно), и внимание распыляется на четыре сцены сразу.
 */
function useLoopWhileVisible(
  ref: RefObject<HTMLElement | null>,
  build: (el: HTMLElement) => (() => void) | void,
  delayMs = 0,
) {
  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    let stop: (() => void) | undefined;

    mm.add(MOTION_QUERIES, (ctx) => {
      const { reduced } = ctx.conditions as { reduced: boolean };
      if (reduced) return;

      const start = () => {
        const delayed = gsap.delayedCall(delayMs / 1000, () => {
          const cleanup = build(el);
          stop = cleanup ?? undefined;
        });
        stop = () => delayed.kill();
      };

      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && !stop) {
              start();
            } else if (!entry.isIntersecting && stop) {
              stop();
              stop = undefined;
            }
          }
        },
        { threshold: 0.3 },
      );
      io.observe(el);

      return () => {
        io.disconnect();
        stop?.();
        stop = undefined;
      };
    });

    return () => mm.revert();
  }, []);
}

/** «Что на ужин?» — вопрос сам себя переспрашивает. */
function DinnerScene({ delay = 0 }: { delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useLoopWhileVisible(ref, (el) => {
    const words = ["ужин", "обед", "ужин"];
    let i = 0;
    let ticks = 0;
    const id = window.setInterval(() => {
      ticks += 1;
      i = (i + 1) % words.length;
      gsap.to(el, {
        opacity: 0,
        duration: 0.18,
        onComplete: () => {
          el.textContent = words[i];
          gsap.to(el, { opacity: 1, duration: 0.18 });
        },
      });
      // Останавливаемся после одного полного цикла — не крутится вечно,
      // конец совпадает с исходным словом ("ужин").
      if (ticks >= words.length) window.clearInterval(id);
    }, 1400);
    return () => window.clearInterval(id);
  }, delay);
  return <span ref={ref}>ужин</span>;
}

/** Лук выкатывается за край карточки и возвращается — «сбегал ещё раз». */
function OnionScene({ delay = 0 }: { delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useLoopWhileVisible(ref, (el) => {
    // Ограниченное число повторов — сцена "сбегал ещё раз" делает свою мысль
    // за пару проходов и успокаивается, а не крутится, пока карточка видна.
    const tl = gsap.timeline({ repeat: 2, repeatDelay: 1.1 });
    tl.to(el, { x: 46, opacity: 0, duration: 0.6, ease: "power1.in" })
      .set(el, { x: -46 })
      .to(el, { x: 0, opacity: 1, duration: 0.6, ease: "power2.out" });
    return () => tl.kill();
  }, delay);
  return (
    <div ref={ref} className="size-8 shrink-0">
      <Ingredient id="onion" className="h-full w-full" />
    </div>
  );
}

/** Зелень с биркой срока годности: таймер тикает к нулю, продукт уезжает в мусорку. */
function ExpiryScene({ delay = 0 }: { delay?: number }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  useLoopWhileVisible(wrapRef, (el) => {
    const dill = el.querySelector<HTMLElement>("[data-dill]");
    const badge = badgeRef.current;
    if (!dill || !badge) return;

    // Ограниченное число повторов — см. комментарий в OnionScene.
    const tl = gsap.timeline({ repeat: 2, repeatDelay: 0.6 });
    const steps = ["3 дня", "2 дня", "1 день", "0 дней"];
    steps.forEach((label, i) => {
      tl.call(() => {
        badge.textContent = label;
      }, undefined, i * 0.45);
    });
    tl.to(dill, { y: 26, x: 10, opacity: 0, rotate: 12, duration: 0.5, ease: "power1.in" }, "+=0.1")
      .set(dill, { y: 0, x: 0, rotate: 0 })
      .call(() => {
        badge.textContent = steps[0];
      })
      .to(dill, { opacity: 1, duration: 0.3 });

    return () => tl.kill();
  }, delay);

  return (
    <div ref={wrapRef} className="flex items-center gap-3">
      <div data-dill className="relative size-8 shrink-0">
        <Ingredient id="dill" className="h-full w-full" />
      </div>
      <span
        ref={badgeRef}
        className="rounded-full border border-amber/40 bg-amber/10 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-deep"
      >
        3 дня
      </span>
      <Trash2 size={16} className="text-muted" aria-hidden="true" />
    </div>
  );
}

/** Чек на бумажке «печатается» построчно, потом комкается. */
function ReceiptScene({ delay = 0 }: { delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useLoopWhileVisible(ref, (el) => {
    const lines = gsap.utils.toArray<HTMLElement>(el.querySelectorAll("[data-line]"));
    // Ограниченное число повторов — см. комментарий в OnionScene. Финальный
    // .set гасит строки для следующего повтора цикла; onComplete возвращает
    // чек в обычный читаемый вид после последнего повтора.
    const tl = gsap.timeline({
      repeat: 2,
      repeatDelay: 0.8,
      onComplete: () => gsap.set(lines, { opacity: 1 }),
    });
    tl.fromTo(lines, { opacity: 0 }, { opacity: 1, stagger: 0.12, duration: 0.15 })
      .to(el, { scale: 0.82, rotate: -6, opacity: 0.5, duration: 0.35, ease: "power1.in" }, "+=0.5")
      .set(el, { scale: 1, rotate: 0, opacity: 1 })
      .set(lines, { opacity: 0 });
    return () => tl.kill();
  }, delay);

  return (
    <div ref={ref} className="w-24 rounded-md border border-line bg-ground p-2 font-mono text-[9px] text-muted">
      {["молоко", "лук", "хлеб", "сыр"].map((item) => (
        <div key={item} data-line className="border-b border-dashed border-line/70 py-0.5 last:border-0">
          {item}
        </div>
      ))}
    </div>
  );
}

const SCENES: Record<HomePainKind, (props: { delay?: number }) => ReactElement> = {
  dinner: DinnerScene,
  onion: OnionScene,
  expiry: ExpiryScene,
  receipt: ReceiptScene,
};

/** Небольшой хаотичный перекос на карточку — единственный «нервный» блок страницы. */
const TILTS = ["rotate-[-2deg]", "rotate-[1.5deg]", "rotate-[-1deg]", "rotate-[2deg]"];

/** Разносит старт сцен по карточкам — иначе все четыре срываются в одном кадре. */
const SCENE_STAGGER_MS = 350;

export function PainChaos() {
  const items = HOME.pain.items;

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[1180px] px-6">
        <SectionKicker n="02" title={HOME.pain.title} />

        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {items.map((item, i) => {
            const Scene = SCENES[item.kind];
            const sceneDelay = i * SCENE_STAGGER_MS;
            return (
              <Reveal
                key={item.text}
                as="li"
                delay={i * 90}
                className={`flex items-center justify-between gap-4 rounded-2xl border border-line bg-surface px-5 py-4 ${TILTS[i % TILTS.length]}`}
              >
                <span className="text-[15.5px] text-ink">
                  {item.kind === "dinner" ? (
                    <>
                      «Что сегодня на <DinnerScene delay={sceneDelay} />?» — и так каждый вечер.
                    </>
                  ) : (
                    item.text
                  )}
                </span>
                {item.kind !== "dinner" && <Scene delay={sceneDelay} />}
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
