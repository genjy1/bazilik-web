"use client";

import { Check, ChefHat, ShoppingCart, Users } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { HOME } from "@/lib/content";
import {
  ScrollTrigger,
  gsap,
  remap,
  useIsomorphicLayoutEffect,
} from "@/lib/gsap";
import { BrandMark } from "./BrandMark";
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

/** Габариты макета телефона; высота нужна ещё и подгонке сцены под экран. */
const SHELL_SIZE = "h-[500px] w-[244px]";
const PHONE_H = 500;
const RING_RADIUS = 320;
const PERSPECTIVE = 1400;
/**
 * Передняя грань кольца вынесена на себя к камере, поэтому рисуется крупнее
 * своей коробки — подгонка обязана считать по видимой высоте, иначе телефон
 * вылезает за сцену ровно на этот запас (так он и обрезался снизу).
 */
const DEPTH_GAIN = PERSPECTIVE / (PERSPECTIVE - RING_RADIUS);
/** Воздух над и под телефоном, который подгонка обязана сохранить. */
const FIT_GUTTER = 72;

/**
 * Раскадровка кольца: на «полке» телефон стоит лицом к зрителю и не двигается,
 * между полками кольцо доворачивается на 120°. Контент экрана рисуется внутри
 * своей полки и успевает замереть до следующего поворота — раньше окна контента
 * наезжали на поворот, и экран приезжал к зрителю недорисованным: список
 * дочёркивался уже после того, как телефон прошёл центр.
 *
 * Полки: 0 — [0, 0.18], 1 — [0.36, 0.58], 2 — [0.76, 1].
 */
const TURNS = [
  [0.18, 0.36],
  [0.58, 0.76],
] as const;

/** Границы шагов для трёхсегментного индикатора в шапке. */
const STEP_SPANS = [
  [0, 0.36],
  [0.36, 0.76],
  [0.76, 1],
] as const;

const smoothstep = (t: number) => t * t * (3 - 2 * t);

type ShoppingItem = { id: IngredientId; name: string };

const SHOPPING: readonly ShoppingItem[] = [
  { id: "chicken", name: "Куриное филе" },
  { id: "tomato", name: "Помидоры" },
  { id: "pasta", name: "Паста" },
  { id: "onion", name: "Лук" },
  { id: "basil", name: "Базилик" },
  { id: "garlic", name: "Чеснок" },
];

const COOK_STEPS = [
  "Отварить пасту",
  "Обжарить курицу",
  "Добавить томаты",
  "Всыпать базилик",
  "Подавать",
];

/** Цель по питанию — одиночный выбор. */
const DIET_GOALS = [
  { label: "Похудение" },
  { label: "Поддержание", on: true },
  { label: "Набор массы" },
];

/**
 * Что важно в быту — множественный выбор. Для «дома» это и есть настоящая
 * мотивация: цель по КБЖУ вторична рядом с «накормить семью» и «тратить меньше».
 */
const LIFE_GOALS = [
  { label: "Накормить семью", on: true },
  { label: "Меньше готовить" },
  { label: "Меньше закупаться" },
  { label: "Экономить деньги", on: true },
];

const productWord = (n: number) => {
  const tail10 = n % 10;
  const tail100 = n % 100;
  if (tail10 === 1 && tail100 !== 11) return "продукт";
  if (tail10 >= 2 && tail10 <= 4 && (tail100 < 12 || tail100 > 14)) return "продукта";
  return "продуктов";
};

function PhoneShell({ children }: { children: ReactNode }) {
  return (
    <div
      className={`relative ${SHELL_SIZE} shrink-0 rounded-[36px] border-[6px] border-[var(--phone-frame)] bg-[var(--phone-frame)] shadow-[var(--phone-shadow)]`}
    >
      <div className="absolute top-0 left-1/2 z-10 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-[var(--phone-frame)]" />
      <div className="relative h-full w-full overflow-hidden rounded-[30px] bg-ground">
        {children}
      </div>
    </div>
  );
}

/**
 * Задняя крышка. Без неё грани, повёрнутые от зрителя, показывали свой же экран
 * зеркально — читался вывернутый текст, и карусель выглядела сломанной.
 */
function PhoneBack() {
  return (
    <div
      className={`relative ${SHELL_SIZE} shrink-0 rounded-[36px] border-[6px] border-[var(--phone-frame)] bg-[var(--phone-frame)] shadow-[var(--phone-shadow)]`}
    >
      {/* Крышка берёт цвет рамки телефона, а рельеф даёт полупрозрачный
          градиент — тогда она остаётся правильной и в тёмной теме. */}
      <div className="relative h-full w-full overflow-hidden rounded-[30px] bg-[var(--phone-frame)]">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(160deg,rgba(255,255,255,0.1)_0%,rgba(0,0,0,0.34)_65%)]"
        />
        <div className="absolute top-5 left-5 grid size-12 place-items-center rounded-2xl bg-black/35">
          <span className="size-5 rounded-full bg-black/60 ring-1 ring-white/10" />
        </div>
        <BrandMark className="absolute top-1/2 left-1/2 size-10 -translate-x-1/2 -translate-y-1/2 opacity-20" />
      </div>
    </div>
  );
}

/** Грань карусели: экран спереди, крышка сзади, обе с отсечкой изнанки. */
function PhoneSlot({ index, children }: { index: number; children: ReactNode }) {
  return (
    <div
      data-phone={index}
      className="absolute inset-0"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div data-face className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
        <PhoneShell>{children}</PhoneShell>
      </div>
      <div
        data-face
        aria-hidden="true"
        className="absolute inset-0"
        style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
      >
        <PhoneBack />
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

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <div className="font-mono text-[9px] tracking-[0.12em] text-muted uppercase">{children}</div>
  );
}

function Chip({ label, on = false }: { label: string; on?: boolean }) {
  return (
    <span
      className={`rounded-full border px-2.5 py-[3px] text-[10px] font-bold tracking-tight ${
        on ? "border-transparent bg-accent text-on-accent" : "border-line text-muted"
      }`}
    >
      {label}
    </span>
  );
}

/** Экран 1 — вводные: сколько человек и какие цели. Статичный, без прогресса. */
function AudienceScreen() {
  return (
    <div className="flex h-full flex-col p-5">
      <ScreenHeader step="Шаг 1" title="Расскажи о себе" />

      <div className="mt-4 rounded-2xl border border-line bg-surface p-3.5">
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

      <div className="mt-4">
        <FieldLabel>Цель</FieldLabel>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {DIET_GOALS.map((g) => (
            <Chip key={g.label} label={g.label} on={g.on} />
          ))}
        </div>
      </div>

      <div className="mt-3.5">
        <FieldLabel>Что важно</FieldLabel>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {LIFE_GOALS.map((g) => (
            <Chip key={g.label} label={g.label} on={g.on} />
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
    <div className="flex h-full flex-col p-5">
      <ScreenHeader step="Шаг 2" title="Купи по готовому списку" />

      <ul className="mt-4 flex flex-col gap-1.5">
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

      <div className="mt-auto flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2.5">
        <ShoppingCart size={13} className="text-accent" aria-hidden="true" />
        <span className="font-mono text-[9.5px] tracking-[0.1em] text-muted uppercase">
          {SHOPPING.length} {productWord(SHOPPING.length)} · 1 поход
        </span>
      </div>
    </div>
  );
}

/** Экран 3 — готовка по шагам. Тот же приём: шаги отмечаются по скролл-прогрессу. */
function CookScreen({ animated = false }: { animated?: boolean }) {
  return (
    <div className="flex h-full flex-col p-5">
      <ScreenHeader step="Шаг 3" title="Готовь по шагам" />

      <div className="mt-4 rounded-2xl border border-line bg-surface p-3.5">
        <div className="text-[13px] font-bold tracking-tight text-ink">Курица с томатами</div>
        <div className="mt-1.5 flex items-center gap-2 font-mono text-[9px] tracking-[0.1em] text-muted uppercase">
          <span>25 мин</span>
          <span className="size-1 rounded-full bg-line" aria-hidden="true" />
          <span>4 порции</span>
        </div>
      </div>

      <ol className="mt-3.5 flex flex-col gap-1.5">
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

export function PhoneStepsScene() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const fitRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const header = headerRef.current;
    const fit = fitRef.current;
    const ring = ringRef.current;
    if (!root || !stage || !header || !fit || !ring) return;

    const captions = Array.from(root.querySelectorAll<HTMLElement>("[data-caption]"));
    const segments = Array.from(root.querySelectorAll<HTMLElement>("[data-progress-seg]"));
    const slots = Array.from(ring.querySelectorAll<HTMLElement>("[data-phone]"));
    const faces = slots.map((slot) =>
      Array.from(slot.querySelectorAll<HTMLElement>("[data-face]")),
    );
    const shopRows = Array.from(ring.querySelectorAll<HTMLElement>("[data-shop-row]"));
    const shopChecks = Array.from(ring.querySelectorAll<HTMLElement>("[data-shop-check]"));
    const cookRows = Array.from(ring.querySelectorAll<HTMLElement>("[data-cook-row]"));
    const cookMarks = Array.from(ring.querySelectorAll<HTMLElement>("[data-cook-mark]"));
    const cookDone = ring.querySelector<HTMLElement>("[data-cook-done]");

    /** Телефон выше свободного места — ужимаем сцену целиком, а не режем её. */
    function fitScene() {
      const gutter = Math.min(FIT_GUTTER, stage!.clientHeight * 0.09);
      const avail = stage!.clientHeight - header!.offsetHeight - gutter;
      const scale = Math.max(0.45, Math.min(1, avail / (PHONE_H * DEPTH_GAIN)));
      fit!.style.transform = `scale(${scale})`;
    }

    function applyOverlay(p: number) {
      // Подпись держится всю свою полку: гаснет в начале своего поворота,
      // следующая загорается во второй половине того же поворота.
      captions.forEach((el, i) => {
        const inTurn = TURNS[i - 1];
        const outTurn = TURNS[i];
        const appear = inTurn
          ? remap(p, inTurn[0] + (inTurn[1] - inTurn[0]) * 0.45, inTurn[1])
          : 1;
        const leave = outTurn
          ? 1 - remap(p, outTurn[0], outTurn[0] + (outTurn[1] - outTurn[0]) * 0.55)
          : 1;
        const o = Math.min(appear, leave);
        el.style.opacity = String(o);
        el.style.transform = `translateY(${(1 - o) * 6}px)`;
      });

      // Индикатор: пройденные шаги залиты целиком, текущий заполняется. Даже
      // в самом начале активный сегмент виден — иначе шапка читается пустой.
      segments.forEach((el, i) => {
        const [from, to] = STEP_SPANS[i];
        const fill = remap(p, from, to);
        const active = p >= from && p < to;
        el.style.transform = `scaleX(${active ? 0.12 + fill * 0.88 : fill})`;
      });

      // Список покупок — рисуется на полке шага 2 и замирает до поворота.
      shopRows.forEach((el, i) => {
        const rf = remap(p, 0.375 + i * 0.016, 0.425 + i * 0.016);
        el.style.opacity = String(rf);
        el.style.transform = `translateX(${(1 - rf) * -8}px)`;
      });
      shopChecks.forEach((el, i) => {
        el.style.opacity = String(remap(p, 0.4 + i * 0.016, 0.445 + i * 0.016));
      });

      // Шаги готовки — полка шага 3, отмечаются по одному, в конце «готово».
      cookRows.forEach((el, i) => {
        const rf = remap(p, 0.765 + i * 0.02, 0.815 + i * 0.02);
        el.style.opacity = String(rf);
        el.style.transform = `translateX(${(1 - rf) * -8}px)`;
      });
      cookMarks.forEach((el, i) => {
        const done = remap(p, 0.785 + i * 0.02, 0.825 + i * 0.02);
        el.style.borderColor = done > 0.5 ? "transparent" : "";
        el.style.background = done > 0.5 ? "var(--accent)" : "";
        el.style.color = done > 0.5 ? "var(--on-accent)" : "";
      });
      if (cookDone) cookDone.style.opacity = String(remap(p, 0.885, 0.935));

      // Карусель: кольцо стоит на полке и доворачивается на 120° между ними.
      // Та же тригонометрия говорит, насколько грань отвёрнута, — по ней гасим
      // боковые телефоны.
      const ringDeg =
        -120 *
        (smoothstep(remap(p, TURNS[0][0], TURNS[0][1])) +
          smoothstep(remap(p, TURNS[1][0], TURNS[1][1])));
      ring!.style.transform = `rotateY(${ringDeg}deg)`;
      slots.forEach((el, i) => {
        const angle = (i * 120 + ringDeg) * (Math.PI / 180);
        const factor = (Math.cos(angle) + 1) / 2;
        const opacity = String(0.5 + factor * 0.5);
        const filter = `brightness(${0.72 + factor * 0.28})`;
        faces[i].forEach((face) => {
          face.style.opacity = opacity;
          face.style.filter = filter;
        });
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

      fitScene();
      applyOverlay(0);

      // Высота шапки меняется и после первого кадра — от подгрузки шрифта до
      // смены высоты окна. Меряем её наблюдателем, иначе подгонка один раз
      // считает по недоверстанной шапке и телефон упирается в края сцены.
      const ro = new ResizeObserver(() => fitScene());
      ro.observe(header!);
      ro.observe(stage!);

      const st = ScrollTrigger.create({
        trigger: stage,
        start: "top top",
        end: () => "+=" + window.innerHeight * 2.4,
        pin: stage,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => applyOverlay(self.progress),
        onRefresh: (self) => {
          fitScene();
          applyOverlay(self.progress);
        },
      });

      return () => {
        ro.disconnect();
        st.kill();
      };
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
      {/* Десктоп: пин-сцена с 3D-каруселью телефонов. Заголовок секции живёт
          внутри пина — иначе на закреплённом экране висела одна подпись без
          всякой привязки, а до пина под заголовком зияла пустая полоса. */}
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
          <header ref={headerRef} className="pt-[clamp(76px,8.5vh,100px)]">
            <div className="flex flex-wrap items-baseline gap-3.5">
              <span className="font-mono text-[13px] font-bold tracking-[0.14em] text-accent">
                04
              </span>
              <h2 className="text-[clamp(28px,3.6vw,46px)]">
                Три шага — и неделя спланирована
              </h2>
            </div>

            <div className="relative mt-4 h-7 max-w-[52ch]">
              {HOME.process.map((step, i) => (
                <p
                  key={step.caption}
                  data-caption
                  className="absolute inset-x-0 top-0 flex items-baseline gap-2.5 text-[15px] text-muted"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                >
                  <span className="font-mono text-[11px] font-bold tracking-[0.14em] text-accent">
                    0{i + 1}
                  </span>
                  {step.caption}
                </p>
              ))}
            </div>

            <div className="mt-3 flex items-center gap-1.5">
              {HOME.process.map((step) => (
                <div
                  key={step.caption}
                  className="h-[3px] w-12 overflow-hidden rounded-full bg-line"
                >
                  <div
                    data-progress-seg
                    className="h-full origin-left rounded-full bg-accent"
                    style={{ transform: "scaleX(0)" }}
                  />
                </div>
              ))}
            </div>
          </header>

          <div className="relative flex flex-1 items-center justify-center">
            <div ref={fitRef} style={{ transform: "scale(1)" }}>
              <div style={{ perspective: `${PERSPECTIVE}px` }}>
                <div
                  ref={ringRef}
                  className={`relative ${SHELL_SIZE}`}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <PhoneSlot index={0}>
                    <AudienceScreen />
                  </PhoneSlot>
                  <PhoneSlot index={1}>
                    <ShoppingScreen animated />
                  </PhoneSlot>
                  <PhoneSlot index={2}>
                    <CookScreen animated />
                  </PhoneSlot>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Мобиль / prefers-reduced-motion: статичная колонка тех же трёх экранов. */}
      <div className="motion-safe:md:hidden">
        <div className="mx-auto max-w-[1180px] px-6 pt-16 md:pt-24">
          <SectionKicker n="04" title="Три шага — и неделя спланирована" />
        </div>
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
