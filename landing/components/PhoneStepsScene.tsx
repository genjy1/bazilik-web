"use client";

import { Check, ChefHat, ShoppingCart, Users } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { HOME } from "@/lib/content";
import {
  ScrollTrigger,
  clamp01,
  gsap,
  remap,
  useIsomorphicLayoutEffect,
} from "@/lib/gsap";
import { SectionKicker } from "./SectionKicker";
import { Ingredient } from "./ui/Ingredient";
import type { IngredientId } from "@/lib/ingredients";

/* ============================================================
   «Как это работает» — три экрана приложения в телефоне, который
   разворачивается на 3D-карусели по мере скролла (одна карточка-грань
   на шаг, как в референсе scroll-to-rotate-3d-phone). Раньше здесь была
   сцена сборки блюда в three.js — её сменили, потому что абстрактная
   3D-еда не показывает продукт: пользователь должен узнать сам интерфейс.

   Экраны собраны из кода в стиле остальных сцен страницы (TakesSection) —
   не скриншоты настоящего приложения (макетов в этом репозитории нет), а
   стилизованная имитация в токенах бренда.

   Прогресс 0..1 крутит телефон одной чистой функцией — обратимо: скролл
   назад так же разворачивает карусель обратно, как вперёд — раскручивал.

   На мобиле и при prefers-reduced-motion пин и 3D-вращение отключены —
   те же три экрана идут статичной колонкой с обычным появлением при
   попадании во вьюпорт (см. landing-b2c-motion.md §9).
   ============================================================ */

const STAGE_QUERIES = {
  stage: "(prefers-reduced-motion: no-preference) and (min-width: 768px)",
  flat: "(prefers-reduced-motion: reduce), (max-width: 767px)",
} as const;

type ShoppingItem = { id: IngredientId; name: string };

const SHOPPING: readonly ShoppingItem[] = [
  { id: "chicken", name: "Куриное филе" },
  { id: "tomato", name: "Помидоры" },
  { id: "basil", name: "Базилик" },
  { id: "garlic", name: "Чеснок" },
];

const COOK_STEPS = ["Обжарить курицу", "Добавить томаты", "Всыпать базилик", "Подавать"];

const GOALS_PREVIEW = ["Похудение", "Поддержание", "Набор массы"];

function PhoneShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative h-[420px] w-[204px] shrink-0 rounded-[36px] border-[6px] border-[#151517] bg-[#151517] shadow-[0_30px_50px_-24px_rgba(0,0,0,0.5)] md:h-[472px] md:w-[228px]">
      <div className="absolute top-0 left-1/2 z-10 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-[#151517]" />
      <div className="relative h-full w-full overflow-hidden rounded-[30px] bg-ground">
        {children}
      </div>
    </div>
  );
}

function ScreenHeader({ step, title }: { step: string; title: string }) {
  return (
    <div>
      <div className="font-mono text-[9px] tracking-[0.14em] text-muted uppercase">{step}</div>
      <h4 className="mt-1 text-[15px] font-extrabold tracking-tight text-ink">{title}</h4>
    </div>
  );
}

/** Экран 1 — вводные: сколько человек и какая цель. Статичный, без скролл-прогресса. */
function AudienceScreen() {
  return (
    <div className="flex h-full flex-col gap-5 p-5">
      <ScreenHeader step="Шаг 1" title="Расскажи о себе" />

      <div className="rounded-2xl border border-line bg-surface p-3.5">
        <div className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.12em] text-muted uppercase">
          <Users size={12} aria-hidden="true" /> На сколько человек
        </div>
        <div className="mt-2.5 flex items-center justify-between">
          <span className="grid size-7 place-items-center rounded-full border border-line text-[15px] text-muted">
            –
          </span>
          <span className="text-[24px] font-extrabold tracking-tight text-ink">4</span>
          <span className="grid size-7 place-items-center rounded-full bg-accent text-[15px] text-on-accent">
            +
          </span>
        </div>
      </div>

      <div>
        <div className="font-mono text-[9px] tracking-[0.12em] text-muted uppercase">Цель</div>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {GOALS_PREVIEW.map((g, i) => (
            <span
              key={g}
              className={`rounded-full border px-2.5 py-1 text-[10.5px] font-bold tracking-tight ${
                i === 1
                  ? "border-transparent bg-accent text-on-accent"
                  : "border-line text-muted"
              }`}
            >
              {g}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-auto rounded-xl bg-accent px-4 py-2.5 text-center text-[12px] font-bold text-on-accent">
        Собрать план недели
      </div>
    </div>
  );
}

/**
 * Экран 2 — список покупок. `animated` включает построчную галочку по
 * скролл-прогрессу (querySelectorAll находит узлы по data-атрибуту в
 * эффекте PhoneStepsScene); в статике (мобиль/reduced) все галочки видны сразу.
 */
function ShoppingScreen({ animated = false }: { animated?: boolean }) {
  return (
    <div className="flex h-full flex-col gap-4 p-5">
      <ScreenHeader step="Шаг 2" title="Купи по готовому списку" />

      <ul className="flex flex-col gap-2">
        {SHOPPING.map((item) => (
          <li
            key={item.id}
            data-shop-row={animated ? true : undefined}
            className={`flex items-center gap-2.5 rounded-xl border border-line bg-surface px-3 py-2 ${
              animated ? "opacity-0" : ""
            }`}
          >
            <span className="size-6 shrink-0">
              <Ingredient id={item.id} className="h-full w-full" />
            </span>
            <span className="flex-1 text-[12.5px] font-bold tracking-tight text-ink">
              {item.name}
            </span>
            <Check
              size={14}
              strokeWidth={3}
              data-shop-check={animated ? true : undefined}
              className={`text-herb ${animated ? "opacity-0" : ""}`}
              aria-hidden="true"
            />
          </li>
        ))}
      </ul>

      <div className="mt-auto flex items-center gap-1.5 font-mono text-[9.5px] tracking-[0.1em] text-muted uppercase">
        <ShoppingCart size={12} aria-hidden="true" /> {SHOPPING.length} продукта · 1 поход
      </div>
    </div>
  );
}

/** Экран 3 — готовка по шагам. Тот же приём: шаги отмечаются по скролл-прогрессу. */
function CookScreen({ animated = false }: { animated?: boolean }) {
  return (
    <div className="flex h-full flex-col gap-4 p-5">
      <ScreenHeader step="Шаг 3" title="Готовь по шагам" />

      <ol className="flex flex-col gap-2">
        {COOK_STEPS.map((step, i) => (
          <li
            key={step}
            data-cook-row={animated ? true : undefined}
            className={`flex items-center gap-2.5 rounded-xl border border-line px-3 py-2 transition-colors ${
              animated ? "opacity-0" : ""
            }`}
          >
            <span
              data-cook-mark={animated ? true : undefined}
              className="grid size-5 shrink-0 place-items-center rounded-full border border-line font-mono text-[10px] text-muted"
            >
              {i + 1}
            </span>
            <span className="text-[12.5px] font-bold tracking-tight text-ink">{step}</span>
          </li>
        ))}
      </ol>

      <div
        data-cook-done={animated ? true : undefined}
        className={`mt-auto flex items-center justify-center gap-1.5 rounded-xl bg-accent px-4 py-2.5 text-[12px] font-bold text-on-accent ${
          animated ? "opacity-0" : ""
        }`}
      >
        <ChefHat size={14} aria-hidden="true" /> Ужин готов
      </div>
    </div>
  );
}

const RING_RADIUS = 264;

export function PhoneStepsScene() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const ring = ringRef.current;
    if (!root || !stage || !ring) return;

    const captions = Array.from(root.querySelectorAll<HTMLElement>("[data-caption]"));
    const progressFill = root.querySelector<HTMLElement>("[data-progress]");
    const slots = Array.from(ring.querySelectorAll<HTMLElement>("[data-phone]"));
    const shopRows = Array.from(ring.querySelectorAll<HTMLElement>("[data-shop-row]"));
    const shopChecks = Array.from(ring.querySelectorAll<HTMLElement>("[data-shop-check]"));
    const cookRows = Array.from(ring.querySelectorAll<HTMLElement>("[data-cook-row]"));
    const cookMarks = Array.from(ring.querySelectorAll<HTMLElement>("[data-cook-mark]"));
    const cookDone = ring.querySelector<HTMLElement>("[data-cook-done]");

    function applyOverlay(p: number) {
      captions.forEach((el, i) => {
        const third = 1 / captions.length;
        const start = i * third;
        const end = start + third;
        const fade = Math.min(remap(p, start, start + 0.06), 1 - remap(p, end - 0.06, end));
        el.style.opacity = String(i === captions.length - 1 ? remap(p, start, start + 0.06) : fade);
      });

      if (progressFill) progressFill.style.transform = `scaleX(${clamp01(p)})`;

      // Список покупок — окно шага 2, галочки проставляются построчно.
      shopRows.forEach((el, i) => {
        const rf = remap(p, 0.38 + i * 0.045, 0.48 + i * 0.045);
        el.style.opacity = String(rf);
        el.style.transform = `translateX(${(1 - rf) * -8}px)`;
      });
      shopChecks.forEach((el, i) => {
        el.style.opacity = String(remap(p, 0.42 + i * 0.045, 0.52 + i * 0.045));
      });

      // Шаги готовки — окно шага 3, отмечаются по одному, последний = «готово».
      cookRows.forEach((el, i) => {
        const rf = remap(p, 0.72 + i * 0.045, 0.8 + i * 0.045);
        el.style.opacity = String(rf);
        el.style.transform = `translateX(${(1 - rf) * -8}px)`;
      });
      cookMarks.forEach((el, i) => {
        const done = remap(p, 0.76 + i * 0.045, 0.82 + i * 0.045);
        el.style.borderColor = done > 0.5 ? "transparent" : "";
        el.style.background = done > 0.5 ? "var(--accent)" : "";
        el.style.color = done > 0.5 ? "var(--on-accent)" : "";
      });
      if (cookDone) cookDone.style.opacity = String(remap(p, 0.92, 1));

      // Карусель: телефон i развёрнут «к камере», когда его базовый угол
      // (i * 120°) компенсирован вращением кольца — та же тригонометрия
      // определяет, насколько остальные телефоны притемнены сбоку.
      const ringDeg = -p * 240;
      ring!.style.transform = `rotateY(${ringDeg}deg)`;
      slots.forEach((el, i) => {
        const angle = (i * 120 + ringDeg) * (Math.PI / 180);
        const factor = (Math.cos(angle) + 1) / 2;
        el.style.opacity = String(0.35 + factor * 0.65);
        el.style.filter = `brightness(${0.7 + factor * 0.3})`;
      });
    }

    const isReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const mm = gsap.matchMedia();

    mm.add(STAGE_QUERIES, (ctx) => {
      const { stage: isStage } = ctx.conditions as { stage: boolean };
      if (!isStage) return;

      slots.forEach((el, i) => {
        el.style.transform = `rotateY(${i * 120}deg) translateZ(${RING_RADIUS}px)`;
      });

      applyOverlay(0);

      const st = ScrollTrigger.create({
        trigger: stage,
        start: "top top",
        end: () => "+=" + window.innerHeight * 2.2,
        pin: stage,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => applyOverlay(self.progress),
        onRefresh: (self) => applyOverlay(self.progress),
      });

      return () => st.kill();
    });

    // Плоский (мобиль/reduced) вариант — просто конечное состояние оверлеев,
    // без пина и вращения; сам блок скрыт в разметке под CSS-вариантами.
    if (isReduced() || window.matchMedia(STAGE_QUERIES.flat).matches) {
      applyOverlay(1);
    }

    return () => mm.revert();
  }, []);

  return (
    <section ref={rootRef} id="how" className="relative">
      <div className="mx-auto max-w-[1180px] px-6 pt-16 md:pt-24">
        <SectionKicker n="04" title="Три шага — и неделя спланирована" />
      </div>

      {/* Десктоп: пин-сцена с 3D-каруселью телефонов. */}
      <div
        ref={stageRef}
        className="relative hidden h-screen w-full overflow-hidden bg-ground motion-safe:md:block"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%]"
          style={{
            background:
              "radial-gradient(60% 80% at 50% 100%, rgba(53,176,110,0.16) 0%, transparent 70%)",
          }}
        />

        <div className="relative mx-auto flex h-full max-w-[1180px] flex-col px-6">
          <header className="pt-20 md:pt-24">
            <div className="relative h-6 max-w-[52ch]">
              {HOME.process.map((step, i) => (
                <p
                  key={step.caption}
                  data-caption
                  className="absolute inset-x-0 top-0 text-[15px] text-muted"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                >
                  {step.caption}
                </p>
              ))}
            </div>

            <div className="mt-5 h-[3px] w-44 overflow-hidden rounded-full bg-line">
              <div
                data-progress
                className="h-full origin-left bg-accent"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
          </header>

          <div
            className="relative flex flex-1 items-center justify-center"
            style={{ perspective: "1400px" }}
          >
            <div
              ref={ringRef}
              className="relative h-[420px] w-[204px] md:h-[472px] md:w-[228px]"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div data-phone={0} className="absolute inset-0">
                <PhoneShell>
                  <AudienceScreen />
                </PhoneShell>
              </div>
              <div data-phone={1} className="absolute inset-0">
                <PhoneShell>
                  <ShoppingScreen animated />
                </PhoneShell>
              </div>
              <div data-phone={2} className="absolute inset-0">
                <PhoneShell>
                  <CookScreen animated />
                </PhoneShell>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Мобиль / prefers-reduced-motion: статичная колонка тех же трёх экранов. */}
      <div className="motion-safe:md:hidden">
        <div className="mx-auto flex max-w-[1180px] flex-col items-center gap-8 px-6 py-12">
          {HOME.process.map((step, i) => (
            <div key={step.caption} className="flex flex-col items-center gap-4">
              <PhoneShell>
                {i === 0 && <AudienceScreen />}
                {i === 1 && <ShoppingScreen />}
                {i === 2 && <CookScreen />}
              </PhoneShell>
              <p className="max-w-[30ch] text-center text-[14px] text-muted">{step.caption}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
