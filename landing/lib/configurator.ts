/**
 * Упрощённая модель плана для демо в CTA.
 *
 * Это НЕ движок продукта: настоящий планировщик считает по рецептам,
 * остаткам и поведению. Здесь — детерминированная функция от трёх настроек,
 * чтобы показать, что план вообще реагирует на вход. Отсюда и подпись
 * «демо-расчёт» в интерфейсе: обещать точность, которой нет, нельзя.
 *
 * Логика вынесена из компонента, чтобы её можно было читать и проверять
 * отдельно от разметки.
 */

export type Goal = "loss" | "keep" | "gain";
export type Diet = "lactoseFree" | "glutenFree" | "vegan";
export type Pace = "fast" | "regular";

export type Config = {
  goal: Goal;
  diets: readonly Diet[];
  pace: Pace;
};

export type PlanEstimate = {
  kcal: number;
  protein: number;
  meals: number;
  shopping: number;
  reuse: number;
  waste: number;
  activeHours: number;
  dishes: readonly string[];
};

export const GOALS: ReadonlyArray<{ id: Goal; label: string }> = [
  { id: "loss", label: "похудение" },
  { id: "keep", label: "поддержание" },
  { id: "gain", label: "набор массы" },
];

export const DIETS: ReadonlyArray<{ id: Diet; label: string }> = [
  { id: "lactoseFree", label: "без лактозы" },
  { id: "glutenFree", label: "без глютена" },
  { id: "vegan", label: "веган" },
];

export const PACES: ReadonlyArray<{ id: Pace; label: string; hint: string }> = [
  { id: "fast", label: "быстро", hint: "до 30 минут активного времени" },
  { id: "regular", label: "обычный", hint: "без ограничения по времени" },
];

/**
 * Блюда помечены тем, чему они противоречат (ограничения) и под какие цели
 * они подходят. Ограничение — жёсткий фильтр, цель — приоритет: первая цель
 * в списке — основная, остальные — «сойдёт и так». Блюда под основную цель
 * встают первыми, потом подходящие по совместительству, потом остальные —
 * так неделя добирается, даже если ограничения сузили пул слишком сильно.
 */
const DISHES: ReadonlyArray<{
  name: string;
  conflicts: readonly Diet[];
  goals: readonly Goal[];
}> = [
  // Похудение: лёгкие, объёмные, много овощей и клетчатки.
  { name: "Запечённая треска с овощами", conflicts: ["vegan"], goals: ["loss"] },
  { name: "Овощное рагу с фасолью", conflicts: [], goals: ["loss"] },
  { name: "Салат с киноа и авокадо", conflicts: [], goals: ["loss"] },
  { name: "Тыквенный суп с имбирём", conflicts: [], goals: ["loss"] },
  { name: "Чечевичный суп", conflicts: [], goals: ["loss", "keep"] },
  // Поддержание: сбалансированная база на каждый день.
  { name: "Паста с базиликом", conflicts: ["glutenFree"], goals: ["keep"] },
  { name: "Гречка с грибами", conflicts: [], goals: ["keep", "loss"] },
  { name: "Нут с томатами и зеленью", conflicts: [], goals: ["keep"] },
  { name: "Рис с тофу и брокколи", conflicts: [], goals: ["keep", "gain"] },
  { name: "Курица с булгуром", conflicts: ["glutenFree", "vegan"], goals: ["keep", "gain"] },
  // Набор массы: плотнее по калориям и белку.
  { name: "Омлет с творогом", conflicts: ["lactoseFree", "vegan"], goals: ["gain"] },
  { name: "Лосось с рисом и авокадо", conflicts: ["vegan"], goals: ["gain"] },
  { name: "Индейка с бататом", conflicts: ["vegan"], goals: ["gain"] },
  { name: "Тофу-скрэмбл с фасолью", conflicts: [], goals: ["gain"] },
  { name: "Паста с чечевицей и тахини", conflicts: ["glutenFree"], goals: ["gain"] },
];

const BASE = {
  kcal: 2000,
  protein: 100,
  /** 3 приёма пищи × 7 дней. */
  meals: 21,
  reuse: 12,
  waste: 12,
} as const;

const GOAL_FACTORS: Record<Goal, { kcal: number; protein: number }> = {
  loss: { kcal: 0.82, protein: 1.15 },
  keep: { kcal: 1, protein: 1 },
  gain: { kcal: 1.18, protein: 1.3 },
};

/** Округление до ближайшего шага — иначе демо сыплет ложной точностью. */
const roundTo = (value: number, step: number) => Math.round(value / step) * step;

export function estimatePlan({ goal, diets, pace }: Config): PlanEstimate {
  const factor = GOAL_FACTORS[goal];
  const fast = pace === "fast";

  const allowed = DISHES.filter(
    (d) => !d.conflicts.some((c) => diets.includes(c)),
  );
  // Ранг по цели: 0 — основная, 1 — подходит, 2 — нейтральное. Сортировка
  // стабильная, порядок внутри ранга сохраняется — клик по цели переставляет
  // состав предсказуемо, а не перемешивает его.
  const rank = (goals: readonly Goal[]) =>
    goals[0] === goal ? 0 : goals.includes(goal) ? 1 : 2;
  const dishes = allowed
    .map((d, i) => ({ d, i }))
    .sort((a, b) => rank(a.d.goals) - rank(b.d.goals) || a.i - b.i)
    .map(({ d }) => d.name);

  // Каждое ограничение сужает пул продуктов, поэтому переиспользовать сложнее,
  // а отходов становится чуть больше. Батч-готовка действует в обратную сторону.
  const reuse = Math.max(4, BASE.reuse + (fast ? 3 : 0) - diets.length);
  const waste = Math.min(18, BASE.waste - (fast ? 3 : 0) + diets.length);

  return {
    kcal: roundTo(BASE.kcal * factor.kcal, 10),
    protein: roundTo(BASE.protein * factor.protein, 5),
    meals: BASE.meals,
    shopping: fast ? 1 : 2,
    reuse,
    waste,
    activeHours: fast ? 3.5 : 5.5,
    dishes: dishes.slice(0, 4),
  };
}

export const DEFAULT_CONFIG: Config = {
  goal: "keep",
  diets: [],
  pace: "fast",
};
