"use client";

import { useEffect, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";

// Регистрация должна произойти один раз и только в браузере.
// DrawSVG, MorphSVG, Draggable и InertiaPlugin раньше были платными —
// с gsap 3.13 они входят в пакет.
if (typeof window !== "undefined") {
  gsap.registerPlugin(
    ScrollTrigger,
    DrawSVGPlugin,
    MorphSVGPlugin,
    MotionPathPlugin,
    Draggable,
    InertiaPlugin,
  );
}

/**
 * useLayoutEffect на сервере не выполняется и React предупреждает о его
 * использовании при SSR. Клиентские компоненты всё равно рендерятся на
 * сервере, поэтому подменяем реализацию.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export {
  gsap,
  ScrollTrigger,
  DrawSVGPlugin,
  MorphSVGPlugin,
  MotionPathPlugin,
  Draggable,
  InertiaPlugin,
};

/** Единая кривая и длительности, чтобы движение по странице было одинаковым. */
export const EASE = "power3.out";
export const DUR = 0.7;

/** Запрос, по которому все анимации выключаются. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const MOTION_QUERIES = {
  motion: MOTION_OK,
  reduced: "(prefers-reduced-motion: reduce)",
} as const;

/** Общие хелперы для скролл-сцен, где прогресс 0..1 — чистая функция. */
export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
/** Линейный ремап в [0,1] с отсечкой по краям. */
export const remap = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
