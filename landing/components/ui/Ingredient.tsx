import type { CSSProperties } from "react";
import { INGREDIENTS, type IngredientId } from "@/lib/ingredients";

/**
 * Один ингредиент из общего набора — чистая разметка, без анимации.
 * Позиционирование/движение накладывается снаружи через className/style
 * (transform, opacity), чтобы один и тот же узел одинаково подходил и для
 * фонового дрейфа, и для сцены сборки блюда.
 */
export function Ingredient({
  id,
  className,
  style,
}: {
  id: IngredientId;
  className?: string;
  style?: CSSProperties;
}) {
  const spec = INGREDIENTS[id];

  return (
    <svg
      viewBox={spec.viewBox}
      className={className}
      style={style}
      aria-hidden="true"
    >
      {spec.shapes.map((shape, i) => {
        if (shape.kind === "path") {
          return <path key={i} d={shape.d} fill={shape.fill} opacity={shape.opacity} />;
        }
        if (shape.kind === "circle") {
          return (
            <circle
              key={i}
              cx={shape.cx}
              cy={shape.cy}
              r={shape.r}
              fill={shape.fill}
              opacity={shape.opacity}
            />
          );
        }
        return (
          <ellipse
            key={i}
            cx={shape.cx}
            cy={shape.cy}
            rx={shape.rx}
            ry={shape.ry}
            fill={shape.fill}
            opacity={shape.opacity}
          />
        );
      })}
    </svg>
  );
}
