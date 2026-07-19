"use client";

import { useRef } from "react";
import { MOTION_QUERIES, gsap, useIsomorphicLayoutEffect } from "@/lib/gsap";

/**
 * Маршрут недели: одна кривая, по которой план превращается в тарелку.
 *
 * Узлы заданы первыми, а кривая построена через них (Catmull-Rom, переведённый
 * в кубические Безье), поэтому подписи и точки лежат ровно на линии — их не
 * приходится подгонять на глаз или считать getPointAtLength в рантайме.
 */
const NODES = [
  { x: 60, y: 150, label: "план" },
  { x: 330, y: 80, label: "список" },
  { x: 600, y: 150, label: "магазин" },
  { x: 870, y: 80, label: "готовка" },
  { x: 1140, y: 140, label: "тарелка" },
] as const;

const PATH_D = [
  "M 60 150",
  "C 105 138.3, 240 80, 330 80",
  "C 420 80, 510 150, 600 150",
  "C 690 150, 780 81.7, 870 80",
  "C 960 78.3, 1095 130, 1140 140",
].join(" ");

/** Три состояния одной иконки в конце маршрута: корзина → кастрюля → тарелка. */
const SHAPES = {
  cart: "M8 16 L40 16 L35 38 L13 38 Z",
  pot: "M10 18 L38 18 L36 38 L12 38 Z",
  plate: "M6 26 C 6 20, 42 20, 42 26 C 42 34, 6 34, 6 26 Z",
} as const;

/** Лист из знака бренда, уменьшенный до бегунка по маршруту. */
const LEAF_D = "M0 0 C -4 -3, -4 -10, 0 -14 C 4 -10, 4 -3, 0 0 Z";

/** Запускает бесконечные циклы только пока элемент виден. */
function playWhileVisible(el: Element, play: () => void, pause: () => void) {
  const io = new IntersectionObserver(([entry]) =>
    entry.isIntersecting ? play() : pause(),
  );
  io.observe(el);
  return () => io.disconnect();
}

export function JourneyBand() {
  const root = useRef<SVGSVGElement>(null);

  useIsomorphicLayoutEffect(() => {
    const svg = root.current;
    if (!svg) return;

    const mm = gsap.matchMedia();

    mm.add(MOTION_QUERIES, (ctx) => {
      const { reduced } = ctx.conditions as { reduced: boolean };

      // Без анимации всё уже отрисовано разметкой — трогать нечего.
      if (reduced) return;

      // Селекторы скоупим по своему SVG: id глобальны, и второй экземпляр
      // компонента иначе перехватил бы чужие элементы.
      const q = gsap.utils.selector(svg);

      // querySelector, а не gsap.utils.selector: MotionPath принимает именно
      // SVGPathElement, а селектор gsap типизирован под HTML-элементы.
      const path = svg.querySelector<SVGPathElement>("[data-journey-path]");
      const leaf = svg.querySelector<SVGPathElement>("[data-leaf]");
      const icon = svg.querySelector<SVGPathElement>("[data-morph]");
      if (!path || !leaf || !icon) return;

      const intro = gsap.timeline({
        scrollTrigger: { trigger: svg, start: "top 85%", once: true },
      });

      // DrawSVG рисует кривую от начала к концу…
      intro
        .from(path, { drawSVG: "0%", duration: 1.5, ease: "power2.inOut" })
        // …узлы и подписи проявляются следом, по ходу линии
        .from(
          q("[data-node]"),
          {
            opacity: 0,
            scale: 0,
            transformOrigin: "center",
            stagger: 0.12,
            duration: 0.4,
          },
          "-=1.0",
        )
        .from(q("[data-label]"), { opacity: 0, y: 6, stagger: 0.12, duration: 0.4 }, "<")
        // …и только потом по маршруту отправляется лист
        .from(leaf, { opacity: 0, duration: 0.3 }, "-=0.2");

      // MotionPath: бегунок едет по той же кривой, разворачиваясь по касательной.
      const travel = gsap.to(leaf, {
        motionPath: {
          path,
          align: path,
          alignOrigin: [0.5, 0.5],
          autoRotate: true,
        },
        duration: 7,
        ease: "none",
        repeat: -1,
        paused: true,
      });

      // MorphSVG: иконка в конце маршрута перебирает три состояния.
      const morph = gsap
        .timeline({ repeat: -1, paused: true })
        .to(icon, { morphSVG: SHAPES.pot, duration: 0.7, ease: "power2.inOut" }, "+=1.6")
        .to(icon, { morphSVG: SHAPES.plate, duration: 0.7, ease: "power2.inOut" }, "+=1.6")
        .to(icon, { morphSVG: SHAPES.cart, duration: 0.7, ease: "power2.inOut" }, "+=1.6");

      const stopGate = playWhileVisible(
        svg,
        () => {
          travel.play();
          morph.play();
        },
        () => {
          travel.pause();
          morph.pause();
        },
      );

      return () => {
        stopGate();
        travel.kill();
        morph.kill();
        intro.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <svg
      ref={root}
      viewBox="0 0 1200 220"
      className="h-auto w-full overflow-visible"
      role="img"
      aria-label="Маршрут недели: план, список, магазин, готовка, тарелка"
    >
      <path
        data-journey-path
        d={PATH_D}
        fill="none"
        stroke="var(--accent)"
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.5}
      />

      {NODES.slice(0, -1).map((n) => (
        <circle
          key={n.label}
          data-node
          cx={n.x}
          cy={n.y}
          r={7}
          fill="var(--ground)"
          stroke="var(--accent)"
          strokeWidth={2.5}
        />
      ))}

      {/* Последний узел — не точка, а иконка, которая перетекает между формами. */}
      <g transform={`translate(${NODES[4].x - 24} ${NODES[4].y - 24})`}>
        <path
          data-morph
          data-node
          d={SHAPES.cart}
          fill="none"
          stroke="var(--accent-deep)"
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
      </g>

      {NODES.map((n) => (
        <text
          key={n.label}
          data-label
          x={n.x}
          y={n.y + 36}
          textAnchor="middle"
          fill="var(--muted)"
          className="font-mono"
          fontSize={17}
          letterSpacing={1.6}
        >
          {n.label}
        </text>
      ))}

      {/* Стартовая позиция задана разметкой: без неё лист до первого кадра
          MotionPath мигнул бы в левом верхнем углу. */}
      <path
        data-leaf
        d={LEAF_D}
        fill="var(--accent)"
        transform={`translate(${NODES[0].x} ${NODES[0].y})`}
      />
    </svg>
  );
}
