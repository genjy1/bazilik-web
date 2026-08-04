# 001 — Fix scale(0) entrance on engine icon marks

- **Status**: DONE
- **Commit**: 2d44475
- **Severity**: HIGH
- **Category**: Physicality & origin
- **Estimated scope**: 1 file, 1-line value change

## Problem

`components/EngineCards.tsx:211-223` animates the four engine-section icon
marks in from `scale: 0`. Nothing in the real world appears from nothing —
AUDIT.md §3 makes this an always-flag: "Never `scale(0)` — target:
`scale(0.9–0.97)` + `opacity: 0`."

```tsx
/* components/EngineCards.tsx:211-223 — current */
gsap.fromTo(
  marks,
  { scale: 0, rotate: -25 },
  {
    scale: 1,
    rotate: 0,
    duration: 0.6,
    ease: "back.out(2)",
    stagger: 0.1,
    delay: 0.18,
    scrollTrigger: trigger,
  },
);
```

Note: the `back.out(2)` overshoot ease on this same tween is **not** a
finding — it's explicitly justified by the comment above `EngineCards()`
("Разные кривые для карточки и иконки дают ощущение веса — плита тяжёлая,
значок лёгкий" / "different curves for card and icon convey weight — the
slab is heavy, the icon is light"). Do not touch the `ease` or `rotate`
values. Only the starting `scale` is wrong.

## Target

```tsx
/* components/EngineCards.tsx:211-223 — target */
gsap.fromTo(
  marks,
  { scale: 0.9, rotate: -25 },
  {
    scale: 1,
    rotate: 0,
    duration: 0.6,
    ease: "back.out(2)",
    stagger: 0.1,
    delay: 0.18,
    scrollTrigger: trigger,
  },
);
```

Only the `scale: 0` → `scale: 0.9` change. No opacity property needs to be
added: `marks` (`[data-engine-icon]`) are DOM children of the card element
(`[data-reveal]`), which already fades in via its own separate `opacity: 0 →
1` tween a few lines above (`components/EngineCards.tsx:196-209`) — the icon
inherits that fade for free. Adding a second, independent opacity tween on
the icon itself would be redundant and risks double-animating opacity.

## Repo conventions to follow

- No CSS easing/duration tokens exist for this file — motion here is
  entirely GSAP-driven, configured inline per tween. `lib/gsap.ts` exports
  shared `EASE`/`DUR` for the common case, but this tween intentionally
  deviates (see Problem section) — do not replace `back.out(2)` with `EASE`.
- Exemplar for a correct non-zero scale entrance in the same file: the card
  tween immediately above, `components/EngineCards.tsx:196-209`, already
  starts from `scale: 0.96` (correct) — this plan just brings the icon mark
  tween in line with the pattern its own sibling tween already follows.

## Steps

1. In `components/EngineCards.tsx`, change line 213 from `{ scale: 0, rotate: -25 }` to `{ scale: 0.9, rotate: -25 }`. No other lines in this tween change.

## Boundaries

- Do NOT touch the `cards` tween (`components/EngineCards.tsx:196-209`) — it's already correct.
- Do NOT change `ease: "back.out(2)"`, `duration`, `stagger`, or `delay` on the `marks` tween.
- Do NOT add an `opacity` property to this tween.
- Do NOT touch any other file.
- If the code at `components/EngineCards.tsx:211-223` doesn't match the excerpt above (drift since commit `2d44475`), STOP and report instead of improvising.

## Verification

- **Mechanical**: `npm run build` (or `npx tsc --noEmit` if build is slow) completes with no new errors.
- **Feel check**: run the dev server, scroll to the engine-mechanics section (4-card grid) until it enters the viewport for the first time.
  - The 4 icon marks should visibly start from a slightly shrunk state (not literally invisible/zero-sized) before overshooting into place — they should never look like they're "popping into existence" from a single point.
  - In DevTools, set Animations panel playback to 10% and scrub through the icon-mark entrance: confirm the icon is faintly visible (small but present) at the very start of the tween, not a zero-size dot.
  - Toggle `prefers-reduced-motion` (Rendering panel): confirm this section still just uses `gsap.set(cards, { opacity: 1 })` (the existing `reduced` branch a few lines above) and shows icons at full scale immediately — this branch is untouched by this plan.
- **Done when**: the `scale: 0` literal no longer appears anywhere in `components/EngineCards.tsx`, and the feel check above passes.
