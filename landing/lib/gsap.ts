"use client";

import { useEffect, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

// Регистрация должна произойти один раз и только в браузере.
// DrawSVG и MorphSVG раньше были платными — с gsap 3.13 они входят в пакет.
if (typeof window !== "undefined") {
  gsap.registerPlugin(
    ScrollTrigger,
    DrawSVGPlugin,
    MorphSVGPlugin,
    MotionPathPlugin,
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
