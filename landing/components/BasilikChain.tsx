"use client";

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
  className?: string;
};

/**
 * Запас снизу под мягкую тень изумрудных пилюль: стенд обрезает всё лишнее
 * (иначе полная цепочка торчала бы из свёрнутого состояния), и без запаса
 * свечение срезалось бы ровно по нижней кромке пилюли.
 */
const STAGE_PAD = 16;

/**
 * Механизм «Базилик выключен → Включить Базилик»: полная цепочка из 8 шагов
 * сворачивается в «✓ готовый план → приготовить → съесть»
 * (landing-b2c.md §1, landing-b2c-motion.md §2). Состояние общее на страницу
 * через `useBasilikToggle`, кнопка-тумблер живёт отдельно
 * (`BasilikToggleButton`) — под карточкой, а не внутри неё.
 *
 * Два слоя (полный и свёрнутый) лежат друг на друге, но переход между ними —
 * не кроссфейд: три «выживших» шага перелетают из полной цепочки на свои места
 * в свёрнутой и уже там передают эстафету слою-двойнику. Кроссфейд без перелёта
 * выглядел сломанным именно потому, что «приготовить → съесть» стоят во второй
 * строке полной цепочки и в первой — свёрнутой: пилюли телепортировались.
 */
export function BasilikChain({
  chain,
  keepLabel,
  statusOff,
  statusOn,
  className = "",
}: Props) {
  const { on } = useBasilikToggle();
  const stageRef = useRef<HTMLDivElement>(null);
  const fullRef = useRef<HTMLDivElement>(null);
  const compactRef = useRef<HTMLDivElement>(null);

  const kept = chain.slice(-2);

  /** Текущее значение тумблера для колбэков matchMedia и ResizeObserver. */
  const liveOn = useRef(on);
  const playRef = useRef<((next: boolean) => void) | null>(null);

  useIsomorphicLayoutEffect(() => {
    const stage = stageRef.current;
    const full = fullRef.current;
    const compactEl = compactRef.current;
    if (!stage || !full || !compactEl) return;

    const mm = gsap.matchMedia();

    mm.add(MOTION_QUERIES, (ctx) => {
      const { reduced } = ctx.conditions as { reduced: boolean };

      const q = gsap.utils.selector(full);
      const mids = gsap.utils.toArray<HTMLElement>(q("[data-chain-mid]"));
      const arrows = gsap.utils.toArray<HTMLElement>(q("[data-chain-arrow]"));
      // Пары «кто летит» → «куда летит». Порядок важен: первый шаг → карточка
      // «готовый план», два последних → крупные изумрудные пилюли.
      const morphs = gsap.utils
        .toArray<HTMLElement>(q("[data-chain-morph]"))
        .map((from) => ({
          from,
          to: compactEl.querySelector<HTMLElement>(
            `[data-compact-morph="${from.dataset.chainMorph}"]`,
          ),
        }))
        .filter((pair): pair is { from: HTMLElement; to: HTMLElement } => !!pair.to);
      const movers = morphs.map((m) => m.from);

      let tl: gsap.core.Timeline | null = null;
      /** Куда и насколько летит каждый «выживший» шаг — от натуральной позиции. */
      let flights: Array<{ el: HTMLElement; x: number; y: number; scale: number }> = [];

      /**
       * Замер перелётов. Считаем сами, а не через Flip.fit: тот подгоняет
       * ширину и высоту по отдельности, и «решить» растягивалось бы в
       * «готовый план» почти вдвое по горизонтали — текст поплыл бы.
       * Равномерный масштаб по высоте пилюли этого не делает (кегль исходника
       * при этом почти сходится с кеглем цели), а разницу в ширине закрывает
       * подмена слоёв. Вызывать только когда пилюли без трансформа — иначе
       * замерим уже смещённое.
       */
      const measureFlights = () => {
        flights = morphs.map(({ from, to }) => {
          const a = from.getBoundingClientRect();
          const b = to.getBoundingClientRect();
          return {
            el: from,
            x: b.left + b.width / 2 - (a.left + a.width / 2),
            y: b.top + b.height / 2 - (a.top + a.height / 2),
            scale: b.height / a.height,
          };
        });
      };

      /**
       * Высота стенда под состояние. Свёрнутый слой позиционирован
       * `absolute inset-x-0 top-0`, а не `inset-0`: при `inset-0` он растягивался
       * бы по стенду и `offsetHeight` возвращал бы высоту полной цепочки —
       * ровно из-за этого карточка раньше не сжималась вовсе.
       */
      const heightFor = (state: boolean) =>
        (state ? compactEl : full).offsetHeight + STAGE_PAD;

      /** Мгновенная расстановка без анимации: маунт, resize, reduced-motion. */
      const settle = (state: boolean) => {
        tl?.kill();
        tl = null;
        gsap.set(mids, {
          opacity: state ? 0 : 1,
          scale: state ? 0.35 : 1,
          y: state ? -4 : 0,
        });
        gsap.set(arrows, { opacity: state ? 0 : 1 });
        gsap.set(movers, { opacity: state ? 0 : 1, x: 0, y: 0, scale: 1 });
        measureFlights();
        if (state) {
          for (const f of flights) gsap.set(f.el, { x: f.x, y: f.y, scale: f.scale });
        }
        // aria-hidden обязателен: скринридер иначе читает оба слоя подряд,
        // прозрачность и pointer-events его не касаются.
        gsap.set(full, {
          pointerEvents: state ? "none" : "auto",
          attr: { "aria-hidden": state ? "true" : "false" },
        });
        gsap.set(compactEl, {
          opacity: state ? 1 : 0,
          pointerEvents: state ? "auto" : "none",
          attr: { "aria-hidden": state ? "false" : "true" },
        });
        stage.style.height = `${heightFor(state)}px`;
      };

      const play = (next: boolean) => {
        if (reduced) {
          settle(next);
          return;
        }

        tl?.kill();
        // Слой-приёмник должен быть готов к перехвату эстафеты, но пока не
        // виден и не кликабелен; a11y переключаем сразу — состояние уже сменилось.
        gsap.set(full, {
          pointerEvents: next ? "none" : "auto",
          attr: { "aria-hidden": next ? "true" : "false" },
        });
        gsap.set(compactEl, {
          pointerEvents: next ? "auto" : "none",
          attr: { "aria-hidden": next ? "false" : "true" },
        });

        tl = gsap.timeline();

        if (next) {
          // Сборка. 1) средние звенья гаснут каскадом слева направо,
          // 2) стрелки рутины уходят, 3) выжившие перелетают на свои места,
          // 4) стенд сжимается, 5) слой-двойник принимает эстафету.
          tl.to(mids, {
            opacity: 0,
            scale: 0.35,
            y: -4,
            duration: 0.3,
            ease: "power2.in",
            stagger: 0.055,
          }, 0)
            .to(arrows, { opacity: 0, duration: 0.25, ease: "power1.in" }, 0.12)
            .to(stage, { height: heightFor(true), duration: 0.6, ease: "power2.inOut" }, 0.45);

          for (const f of flights) {
            tl.to(
              f.el,
              { x: f.x, y: f.y, scale: f.scale, duration: 0.6, ease: "power2.inOut" },
              0.45,
            );
          }

          // Передача эстафеты в точке, где летящая пилюля уже совпала с целью
          // по месту и размеру: подмена читается как заливка цветом, а не как
          // растворение одной картинки в другой.
          tl.to(movers, { opacity: 0, duration: 0.26, ease: "power1.inOut" }, 0.78)
            .to(compactEl, { opacity: 1, duration: 0.26, ease: "power1.inOut" }, 0.78);
        } else {
          // Разборка — обратный ход (спека требует обратимости).
          tl.to(compactEl, { opacity: 0, duration: 0.24, ease: "power1.inOut" }, 0)
            .to(movers, { opacity: 1, duration: 0.24, ease: "power1.inOut" }, 0)
            .to(movers, { x: 0, y: 0, scale: 1, duration: 0.55, ease: "power2.inOut" }, 0)
            .to(stage, { height: heightFor(false), duration: 0.55, ease: "power2.inOut" }, 0)
            .to(arrows, { opacity: 1, duration: 0.3, ease: "power1.out" }, 0.3)
            .to(
              mids,
              {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.32,
                ease: "power2.out",
                stagger: 0.05,
              },
              0.35,
            );
        }
      };

      playRef.current = play;
      settle(liveOn.current);

      // Перевёрстка цепочки (ресайз окна, догрузка шрифта) меняет и высоту
      // стенда, и точки перелёта. Пересчитываем на месте — но только когда
      // анимация не идёт, иначе собьём её на полпути.
      const ro = new ResizeObserver(() => {
        if (tl?.isActive()) return;
        settle(liveOn.current);
      });
      ro.observe(full);
      ro.observe(compactEl);

      return () => {
        ro.disconnect();
        tl?.kill();
        playRef.current = null;
      };
    });

    return () => mm.revert();
  }, []);

  // Анимацию играем только на реальном переключении: на маунте состояние уже
  // расставлено `settle`, и проигрывать сборку там нечего.
  useIsomorphicLayoutEffect(() => {
    if (liveOn.current === on) return;
    liveOn.current = on;
    playRef.current?.(on);
  }, [on]);

  return (
    <div className={className}>
      <div className="mb-4 inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
        <span
          aria-hidden="true"
          className={`size-1.5 rounded-full transition-colors duration-300 ${on ? "bg-accent" : "bg-muted/60"}`}
        />
        {on ? statusOn : statusOff}
      </div>

      <div
        ref={stageRef}
        className="relative overflow-hidden"
        style={{ paddingBottom: STAGE_PAD }}
      >
        <div ref={fullRef} className="flex flex-wrap items-center gap-2">
          {chain.map((step, i) => {
            const isFirst = i === 0;
            const isMid = i > 0 && i < chain.length - 2;
            // Средние звенья гаснут вместе со своей стрелкой — иначе на месте
            // свёрнутых пилюль остаётся висеть ряд стрелок в никуда.
            const morphId = isFirst ? "first" : isMid ? undefined : `keep-${i - (chain.length - 2)}`;
            return (
              <span
                key={step}
                data-chain-mid={isMid || undefined}
                className="inline-flex items-center gap-2"
              >
                <span
                  data-chain-morph={morphId}
                  className={`whitespace-nowrap rounded-full border px-3.5 py-2 text-sm font-bold tracking-tight ${
                    isFirst
                      ? "border-accent/40 bg-accent-soft text-accent-deep"
                      : "border-line bg-ground text-muted"
                  }`}
                >
                  {step}
                </span>
                {i < chain.length - 1 && (
                  <span
                    data-chain-arrow={isMid ? undefined : true}
                    aria-hidden="true"
                    className="font-mono text-sm font-bold text-line"
                  >
                    →
                  </span>
                )}
              </span>
            );
          })}
        </div>

        <div
          ref={compactRef}
          className="absolute inset-x-0 top-0 flex flex-wrap items-center gap-2 opacity-0"
          style={{ pointerEvents: "none" }}
        >
          <span
            data-compact-morph="first"
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-accent/30 bg-accent-soft/70 px-4 py-2.5 text-[15px] font-extrabold tracking-tight text-accent-deep"
          >
            ✓ {keepLabel}
          </span>
          <span aria-hidden="true" className="font-mono text-sm font-bold text-accent">
            →
          </span>
          {kept.map((step, i) => (
            <span key={step} className="inline-flex items-center gap-2">
              <span
                data-compact-morph={`keep-${i}`}
                className="whitespace-nowrap rounded-full bg-accent px-4 py-2.5 text-[15px] font-extrabold tracking-tight text-on-accent shadow-[var(--shadow-accent-lift)] sm:px-5 sm:text-base"
              >
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
