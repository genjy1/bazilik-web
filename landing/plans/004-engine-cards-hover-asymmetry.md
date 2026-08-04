# 004 — Fix backwards hover asymmetry on engine cards

- **Status**: DONE
- **Commit**: 2d44475
- **Severity**: MEDIUM
- **Category**: Interruptibility
- **Estimated scope**: 1 file, 2 duration values

## Problem

`components/EngineCards.tsx`'s `EngineCard` pointer-tilt layer lifts/glows
the card on `pointerenter` and settles it back on `pointerleave`, but the
leave (release) animation is slower than the enter (arrival) animation —
backwards from AUDIT.md §4's rule: "deliberate phases (press, hold) animate
slower; the system's response snaps. Symmetric timing on press-and-release
is a finding" — the intent generalizes to any enter/leave pair: the active,
attention-grabbing phase can take its time, but the system settling back to
rest should feel snappy, not lingering.

```ts
/* components/EngineCards.tsx:82-103 — current */
const onEnter = (e: PointerEvent) => {
  rect = el.getBoundingClientRect();
  applyPointer(e);
  gsap.to(inner, {
    scale: 1.02,
    y: -4,
    duration: 0.4,
    ease: "power3.out",
  });
  if (glow) {
    gsap.to(glow, { opacity: 1, duration: 0.3, ease: "power2.out" });
  }
};

const onLeave = () => {
  rotX(0);
  rotY(0);
  gsap.to(inner, { scale: 1, y: 0, duration: 0.5, ease: "power3.out" });
  if (glow) {
    gsap.to(glow, { opacity: 0, duration: 0.45, ease: "power2.out" });
  }
};
```

Enter: 0.4s (lift) / 0.3s (glow in). Leave: 0.5s (settle) / 0.45s (glow
out) — leave is slower on both properties, the opposite of the intended
feel. Both tweens correctly use `.to()` (not `.fromTo()`), so rapid
hover in/out already retargets smoothly with no snapping — this finding is
specifically about the wrong-direction asymmetry, not an interruption bug.

## Target

```ts
/* components/EngineCards.tsx:82-103 — target */
const onEnter = (e: PointerEvent) => {
  rect = el.getBoundingClientRect();
  applyPointer(e);
  gsap.to(inner, {
    scale: 1.02,
    y: -4,
    duration: 0.4,
    ease: "power3.out",
  });
  if (glow) {
    gsap.to(glow, { opacity: 1, duration: 0.3, ease: "power2.out" });
  }
};

const onLeave = () => {
  rotX(0);
  rotY(0);
  gsap.to(inner, { scale: 1, y: 0, duration: 0.25, ease: "power3.out" });
  if (glow) {
    gsap.to(glow, { opacity: 0, duration: 0.2, ease: "power2.out" });
  }
};
```

Only the two `duration` values inside `onLeave` change: `0.5` → `0.25` and
`0.45` → `0.2`. `onEnter`'s durations, and every `ease` value on both
handlers, stay exactly as they are.

## Repo conventions to follow

- No new tokens needed — this is a same-file, same-tween-shape duration
  swap. The rest of `EngineCards.tsx` already establishes the pattern of
  independent `inner`/`glow` durations per phase; this plan keeps that
  shape and only rebalances which phase is faster.

## Steps

1. In `components/EngineCards.tsx`, inside `onLeave` (around line 99), change `gsap.to(inner, { scale: 1, y: 0, duration: 0.5, ease: "power3.out" });` to `gsap.to(inner, { scale: 1, y: 0, duration: 0.25, ease: "power3.out" });`.
2. In the same function (around line 101), change `gsap.to(glow, { opacity: 0, duration: 0.45, ease: "power2.out" });` to `gsap.to(glow, { opacity: 0, duration: 0.2, ease: "power2.out" });`.

## Boundaries

- Do NOT change any value inside `onEnter`.
- Do NOT change `ease` values anywhere in this file as part of this plan (a separate plan handles easing-token consolidation).
- Do NOT touch the `quickTo` tilt tweens (`rotX`/`rotY`, lines 54-61) — they're unrelated to this finding.
- If the code at `components/EngineCards.tsx:82-103` doesn't match the excerpt above (drift since commit `2d44475`), STOP and report instead of improvising.

## Verification

- **Mechanical**: `npm run build` completes with no new errors.
- **Feel check**: run the dev server, scroll to the engine-mechanics card grid, and hover on/off a card several times with a real mouse (or in-browser cursor emulation).
  - The card lifting on hover-in should still feel deliberate; settling back on hover-out should now feel noticeably snappier/quicker than the lift, not slower.
  - Move the cursor rapidly in and out of a card several times in a row: confirm no visual snapping or restart-from-zero — motion should keep retargeting smoothly (this was already correct and must stay correct).
  - In DevTools, set Animations panel playback to 10% and compare the recorded duration of the enter vs. leave tweens on `[data-engine-inner]` and `[data-engine-glow]` — leave should visibly finish faster.
- **Done when**: hover-out consistently completes faster than hover-in on every engine card, with no regression to the smooth-retargeting behavior on rapid hover toggling.
