# 005 — Stop replaying the dish-list reveal on every configurator click

- **Status**: DONE
- **Commit**: 2d44475
- **Severity**: HIGH
- **Category**: Purpose & frequency / Interruptibility / Easing & duration
- **Estimated scope**: 1 file, ~10 line change

## Problem

`components/PlanConfigurator.tsx` renders three independent button groups
(Goal, Diet, Pace). Clicking any one of them recomputes `plan` via
`estimatePlan()`, and the dish-chip list re-fires its entrance animation
every single time — even though `dishes` is filtered only by `diets`:

```ts
/* lib/configurator.ts:81-103 — current, confirms dishes is diet-only */
export function estimatePlan({ goal, diets, pace }: Config): PlanEstimate {
  const factor = GOAL_FACTORS[goal];
  const fast = pace === "fast";

  const dishes = DISHES.filter(
    (d) => !d.conflicts.some((c) => diets.includes(c)),
  ).map((d) => d.name);
  // ...
  return {
    // ...
    dishes: dishes.slice(0, 4),
  };
}
```

Clicking a **Goal** or **Pace** button never changes which dishes are
filtered in — but `plan` is a fresh object from `useMemo` every time any of
the three controls change, so `plan.dishes` is a new array reference
regardless, and the effect below treats every click as a reason to replay:

```tsx
/* components/PlanConfigurator.tsx:60-82 — current */
const dishesRef = useRef<HTMLUListElement>(null);

// Список блюд меняется составом, а не значением — числа тут не перетекают,
// поэтому подсвечиваем сам факт пересборки.
useIsomorphicLayoutEffect(() => {
  const el = dishesRef.current;
  if (!el) return;

  const mm = gsap.matchMedia();

  mm.add(MOTION_QUERIES, (ctx) => {
    const { reduced } = ctx.conditions as { reduced: boolean };
    if (reduced) return;

    gsap.fromTo(
      el.children,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: "power2.out" },
    );
  });

  return () => mm.revert();
}, [plan.dishes]);
```

This is a decorative animation on a control meant to be clicked repeatedly
in one sitting — AUDIT.md §1's frequency table puts this in "tens of
times/day → remove or drastically reduce" territory, and here it's
literally replaying with nothing visually different to show for two of the
three controls. On top of that: `gsap.fromTo` hard-resets every chip to
`opacity: 0` at the instant it's called, so a second click before the 0.35s
animation finishes snaps mid-fade chips back to invisible and restarts them
from zero (AUDIT.md §4: "gesture handlers/keyframe-style tweens that
restart from zero" on rapidly-triggered UI). The duration (350ms) and ease
(`power2.out`) also exceed this repo's UI budget and shared token — AUDIT.md
§2 caps UI animations at 300ms, and `lib/gsap.ts` exports a shared
`EASE = "power3.out"` this tween doesn't use.

## Target

```tsx
/* components/PlanConfigurator.tsx:60-82 — target */
const dishesRef = useRef<HTMLUListElement>(null);
const prevDishesRef = useRef<readonly string[]>(plan.dishes);

// Список блюд меняется составом, а не значением — числа тут не перетекают,
// поэтому подсвечиваем сам факт пересборки, но только когда состав
// действительно другой: Цель и Темп не влияют на dishes (см. estimatePlan),
// и их клики не должны переигрывать анимацию впустую.
useIsomorphicLayoutEffect(() => {
  const el = dishesRef.current;
  if (!el) return;

  const prev = prevDishesRef.current;
  prevDishesRef.current = plan.dishes;

  const unchanged =
    prev.length === plan.dishes.length &&
    prev.every((name, i) => name === plan.dishes[i]);
  if (unchanged) return;

  const mm = gsap.matchMedia();

  mm.add(MOTION_QUERIES, (ctx) => {
    const { reduced } = ctx.conditions as { reduced: boolean };
    if (reduced) return;

    gsap.fromTo(
      el.children,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.2, stagger: 0.05, ease: EASE },
    );
  });

  return () => mm.revert();
}, [plan.dishes]);
```

And update the import at the top of the file to also pull in `EASE`:

```tsx
/* components/PlanConfigurator.tsx:15 — current */
import { MOTION_QUERIES, gsap, useIsomorphicLayoutEffect } from "@/lib/gsap";
```

```tsx
/* components/PlanConfigurator.tsx:15 — target */
import { EASE, MOTION_QUERIES, gsap, useIsomorphicLayoutEffect } from "@/lib/gsap";
```

Duration goes from 0.35 → 0.2 (200ms): AUDIT.md's budget table puts this
small reactive chip list closest to "Dropdowns, selects → 150–250ms", not
the 300ms+ range it was running at.

## Repo conventions to follow

- `lib/gsap.ts` exports the shared `EASE = "power3.out"` specifically so
  tweens across the site don't hand-type slightly different curves — import
  and use it here instead of the ad-hoc `"power2.out"`.
- Exemplar for the "skip the effect if nothing meaningful changed" pattern:
  there isn't an existing one in this codebase to copy verbatim, so keep
  the comparison as simple and literal as the target code above (array
  length + per-index string equality) — do not generalize this into a
  shared utility or add a deep-equality dependency.

## Steps

1. In `components/PlanConfigurator.tsx:15`, add `EASE` to the existing `import { ... } from "@/lib/gsap";` line.
2. In `components/PlanConfigurator.tsx`, right after the `const dishesRef = useRef<HTMLUListElement>(null);` line (currently line 60), add `const prevDishesRef = useRef<readonly string[]>(plan.dishes);`.
3. Inside the `useIsomorphicLayoutEffect` callback, immediately after the `if (!el) return;` line, add the `prev`/`prevDishesRef.current = plan.dishes` assignment and the `unchanged` check with early `return`, exactly as shown in the target code above.
4. In the same effect's `gsap.fromTo` call, change `duration: 0.35` to `duration: 0.2` and `ease: "power2.out"` to `ease: EASE`.

## Boundaries

- Do NOT change the effect's dependency array (`[plan.dishes]`) — it stays as-is; the new `unchanged` check inside the effect is what prevents the wasted replay, not the dependency list.
- Do NOT attempt to animate only the newly-added dish chips individually (e.g. diffing which specific `<li>` entries are new) — that's a larger change with more failure modes than this plan covers. This plan's fix is: skip the whole-list replay when the list didn't change, full stop.
- Do NOT touch `lib/configurator.ts` or `estimatePlan()` — the dish-filtering logic is correct as-is; this plan only fixes when the reveal animation fires.
- Do NOT touch the Goal/Diet/Pace button markup or their `transition-colors` classes — that's a separate finding (press feedback), not in scope here.
- If the code at `components/PlanConfigurator.tsx:60-82` doesn't match the excerpt above (drift since commit `2d44475`), STOP and report instead of improvising.

## Verification

- **Mechanical**: `npm run build` (or `npx tsc --noEmit`) completes with no new errors — pay attention to the `readonly string[]` type on `prevDishesRef` matching `plan.dishes`'s inferred type from `PlanEstimate["dishes"]`.
- **Feel check**: run the dev server, open the plan configurator (CTA section).
  - Click a **Goal** button (e.g. switch "поддержание" → "похудение"): the dish chip list should NOT replay its fade-in animation, since the dish set is unaffected by Goal.
  - Click a **Pace** button: same — no replay, dish set unaffected.
  - Toggle a **Diet** checkbox-style button (e.g. "веган"): the dish chip list SHOULD replay its fade-in animation, since this changes which dishes are filtered in.
  - Click two different Diet toggles in quick succession, faster than 200ms apart: confirm chips don't visibly snap to invisible and restart — the tween should retarget smoothly from wherever it currently is.
  - In DevTools, set Animations panel playback to 10% during a genuine Diet-triggered replay and confirm the new 200ms duration / `power3.out` curve.
  - Toggle `prefers-reduced-motion` (Rendering panel): confirm the dish list still updates instantly (via the existing `if (reduced) return;` branch, untouched by this plan) regardless of which control was clicked.
- **Done when**: only Diet-button clicks (the control that actually changes `dishes`) trigger the reveal animation; Goal/Pace clicks update the numbers (via `AnimatedNumber`, unaffected by this plan) without touching the dish list's opacity/transform at all.
