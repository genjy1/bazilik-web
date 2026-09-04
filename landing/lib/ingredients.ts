/**
 * Плоский набор SVG-ингредиентов для фонового слоя и сцен сборки блюда.
 *
 * Один и тот же набор форм используется по всей странице (`AmbientIngredients`,
 * `BasilikChain`, `PhoneStepsScene`, карточки тейков) — это сам смысл
 * сквозного сюжета «хаос → порядок» из landing-b2c-motion.md §0: один и тот же
 * помидор дрейфует вверху и прилетает в тарелку внизу.
 *
 * Цвета — реалистичные (не брендовые токены): фуд-бренд не может позволить
 * себе серый помидор. Формы — примитивы (path/circle/ellipse), viewBox
 * 0 0 64 64, происхождение в центре кадра, чтобы вращение/масштаб в CSS не
 * требовали transform-origin трюков.
 */

export type IngredientId =
  | "basil"
  | "tomato"
  | "chicken"
  | "egg"
  | "pasta"
  | "garlic"
  | "dill"
  | "meat"
  | "onion"
  | "pepper";

type Shape =
  | { kind: "path"; d: string; fill: string; opacity?: number }
  | { kind: "ellipse"; cx: number; cy: number; rx: number; ry: number; fill: string; opacity?: number }
  | { kind: "circle"; cx: number; cy: number; r: number; fill: string; opacity?: number };

export type IngredientSpec = {
  id: IngredientId;
  label: string;
  viewBox: string;
  shapes: Shape[];
};

export const INGREDIENTS: Record<IngredientId, IngredientSpec> = {
  basil: {
    id: "basil",
    label: "базилик",
    viewBox: "0 0 64 64",
    shapes: [
      { kind: "path", d: "M32 6 C 40 6 46 18 46 30 C 46 46 40 56 32 60 C 24 56 18 46 18 30 C 18 18 24 6 32 6 Z", fill: "#3f9d4a" },
      { kind: "path", d: "M31 12 L33 12 L33 56 L31 56 Z", fill: "#2f7a3a", opacity: 0.55 },
    ],
  },
  tomato: {
    id: "tomato",
    label: "помидор",
    viewBox: "0 0 64 64",
    shapes: [
      { kind: "circle", cx: 32, cy: 36, r: 22, fill: "#d63a29" },
      { kind: "ellipse", cx: 25, cy: 27, rx: 6, ry: 4, fill: "#f0776a", opacity: 0.55 },
      { kind: "path", d: "M32 14 L36 20 L32 18 L28 20 Z", fill: "#4f8a3c" },
      { kind: "path", d: "M32 12 L37 19 L32 22 L27 19 Z", fill: "#5e9d48" },
      { kind: "path", d: "M20 20 L32 22 L23 27 Z", fill: "#4f8a3c" },
      { kind: "path", d: "M44 20 L32 22 L41 27 Z", fill: "#4f8a3c" },
    ],
  },
  chicken: {
    id: "chicken",
    label: "курица",
    viewBox: "0 0 64 64",
    shapes: [
      { kind: "path", d: "M14 34 C 14 22 22 14 34 15 C 46 16 50 26 48 36 C 46 46 36 52 26 50 C 16 48 14 42 14 34 Z", fill: "#e7cfa4" },
      { kind: "ellipse", cx: 24, cy: 28, rx: 7, ry: 4, fill: "#f3e3c4", opacity: 0.6 },
    ],
  },
  egg: {
    id: "egg",
    label: "яйцо",
    viewBox: "0 0 64 64",
    shapes: [
      { kind: "path", d: "M32 8 C 44 8 50 30 50 40 C 50 52 42 58 32 58 C 22 58 14 52 14 40 C 14 30 20 8 32 8 Z", fill: "#f6ecd8" },
      { kind: "ellipse", cx: 25, cy: 24, rx: 5, ry: 3.5, fill: "#ffffff", opacity: 0.7 },
    ],
  },
  pasta: {
    id: "pasta",
    label: "паста",
    viewBox: "0 0 64 64",
    shapes: [
      { kind: "path", d: "M10 40 C 20 20 30 50 40 30 C 46 18 52 24 54 34", fill: "#e8c368" },
      { kind: "path", d: "M9 33 C 22 46 26 18 38 38 C 44 48 50 40 55 44", fill: "#efd07e" },
      { kind: "path", d: "M12 46 C 24 30 34 46 44 26 C 48 18 54 22 56 28", fill: "#dcb75a" },
    ],
  },
  garlic: {
    id: "garlic",
    label: "чеснок",
    viewBox: "0 0 64 64",
    shapes: [
      { kind: "path", d: "M32 14 C 44 14 48 26 46 36 C 44 48 38 54 32 54 C 26 54 20 48 18 36 C 16 26 20 14 32 14 Z", fill: "#f3ede0" },
      { kind: "path", d: "M32 14 L32 54", fill: "#e2d9c2", opacity: 0.7 },
      { kind: "path", d: "M32 10 C 30 6 30 2 32 0 C 34 2 34 6 32 10 Z", fill: "#7a8f5a" },
    ],
  },
  dill: {
    id: "dill",
    label: "зелень",
    viewBox: "0 0 64 64",
    shapes: [
      { kind: "path", d: "M31 12 L33 12 L34 58 L30 58 Z", fill: "#4a7a35" },
      { kind: "path", d: "M32 16 C 20 12 14 18 10 14 C 16 24 24 22 32 24 Z", fill: "#5fae52" },
      { kind: "path", d: "M32 24 C 44 20 50 26 54 22 C 48 32 40 30 32 32 Z", fill: "#5fae52" },
      { kind: "path", d: "M32 32 C 20 28 14 34 10 30 C 16 40 24 38 32 40 Z", fill: "#4f9d46" },
      { kind: "path", d: "M32 40 C 44 36 50 42 54 38 C 48 48 40 46 32 48 Z", fill: "#4f9d46" },
    ],
  },
  meat: {
    id: "meat",
    label: "фарш",
    viewBox: "0 0 64 64",
    shapes: [
      { kind: "path", d: "M8 20 L56 20 C 58 20 58 44 56 44 L8 44 C 6 44 6 20 8 20 Z", fill: "#ece7db" },
      { kind: "path", d: "M13 24 L51 24 C 52 24 52 40 51 40 L13 40 C 12 40 12 24 13 24 Z", fill: "#9c2f27" },
      { kind: "path", d: "M8 20 L56 20 C 58 20 58 44 56 44 L8 44 C 6 44 6 20 8 20 Z", fill: "#ffffff", opacity: 0.14 },
    ],
  },
  onion: {
    id: "onion",
    label: "лук",
    viewBox: "0 0 64 64",
    shapes: [
      { kind: "path", d: "M32 12 C 44 14 48 28 46 38 C 44 50 38 56 32 56 C 26 56 20 50 18 38 C 16 28 20 14 32 12 Z", fill: "#c9a0c4" },
      { kind: "path", d: "M32 12 C 32 26 32 42 32 56", fill: "#b489ae", opacity: 0.6 },
      { kind: "path", d: "M40 16 C 38 28 38 44 36 52", fill: "#b489ae", opacity: 0.4 },
      { kind: "path", d: "M32 12 L30 4 L34 4 Z", fill: "#8a7a4a" },
    ],
  },
  pepper: {
    id: "pepper",
    label: "перец",
    viewBox: "0 0 64 64",
    shapes: [
      { kind: "path", d: "M26 16 C 20 22 16 30 18 40 C 20 50 28 56 34 54 C 44 51 48 40 46 30 C 44 20 36 14 30 14 Z", fill: "#e0472e" },
      { kind: "path", d: "M30 14 C 28 10 30 6 34 4 C 33 8 34 12 36 14 Z", fill: "#4f8a3c" },
      { kind: "ellipse", cx: 25, cy: 26, rx: 4, ry: 6, fill: "#f0776a", opacity: 0.5 },
    ],
  },
};
