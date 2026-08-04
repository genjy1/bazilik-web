# 002 — Gate smooth anchor scrolling behind prefers-reduced-motion

- **Status**: DONE
- **Commit**: 2d44475
- **Severity**: HIGH
- **Category**: Accessibility
- **Estimated scope**: 1 file, ~4 line change

## Problem

`components/HashScrollManager.tsx` intercepts every same-page anchor click
site-wide and scrolls with `behavior: "smooth"`, unconditionally:

```ts
/* components/HashScrollManager.tsx:18-35 — current */
function scrollToHash(hash: string, behavior: ScrollBehavior) {
  const target = targetFromHash(hash);
  if (!target) return;

  requestAnimationFrame(() => {
    ScrollTrigger.refresh();

    const header = document.querySelector("header");
    const headerHeight = header?.getBoundingClientRect().height ?? 0;
    const top =
      target.getBoundingClientRect().top +
      window.scrollY -
      headerHeight -
      EXTRA_GAP;

    window.scrollTo({ top: Math.max(0, top), behavior });
  });
}
```

```ts
/* components/HashScrollManager.tsx:53 — current */
scrollToHash(url.hash, "smooth");
```

`app/globals.css:179-183` sets `html { scroll-behavior: auto }` under
`@media (prefers-reduced-motion: reduce)`, but that CSS property only
governs *native* anchor-link scrolling and CSS `scroll-behavior` — it has no
effect on a JS call that passes an explicit `behavior: "smooth"` argument to
`window.scrollTo()`, which this file does on every anchor click. AUDIT.md
§6: "movement with no `prefers-reduced-motion` handling" is a finding, and
this is the single most-triggered scroll interaction on the site (every nav
link, every in-page anchor).

## Target

```ts
/* components/HashScrollManager.tsx:18-35 — target */
function scrollToHash(hash: string, behavior: ScrollBehavior) {
  const target = targetFromHash(hash);
  if (!target) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const effectiveBehavior: ScrollBehavior = reduced ? "auto" : behavior;

  requestAnimationFrame(() => {
    ScrollTrigger.refresh();

    const header = document.querySelector("header");
    const headerHeight = header?.getBoundingClientRect().height ?? 0;
    const top =
      target.getBoundingClientRect().top +
      window.scrollY -
      headerHeight -
      EXTRA_GAP;

    window.scrollTo({ top: Math.max(0, top), behavior: effectiveBehavior });
  });
}
```

The call site at line 53 (`scrollToHash(url.hash, "smooth")`) does not need
to change — the reduced-motion override now happens inside `scrollToHash`
itself, so every caller is covered automatically, including the two
`window.setTimeout(() => scrollToHash(window.location.hash, "auto"), ...)`
calls at lines 59-60 (which already pass `"auto"` and are unaffected either
way).

## Repo conventions to follow

- This file has no GSAP involvement (`ScrollTrigger` is imported only to
  call `.refresh()`), so `lib/gsap.ts`'s `MOTION_QUERIES`/`gsap.matchMedia`
  helpers don't apply here — use a plain `window.matchMedia(...).matches`
  check, matching the exact pattern already used elsewhere in this
  codebase for non-GSAP reduced-motion checks: `components/RecipeAssembly.tsx`
  defines `const isReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;`
  and calls it inline where needed — follow that style (a local `const`,
  not a new shared export).

## Steps

1. In `components/HashScrollManager.tsx`, inside `scrollToHash`, immediately after the `if (!target) return;` line, add:
   ```ts
   const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
   const effectiveBehavior: ScrollBehavior = reduced ? "auto" : behavior;
   ```
2. In the same function, change the final `window.scrollTo({ top: Math.max(0, top), behavior });` to `window.scrollTo({ top: Math.max(0, top), behavior: effectiveBehavior });`.

## Boundaries

- Do NOT change the function signature of `scrollToHash` or any call site.
- Do NOT add a new export to `lib/gsap.ts` for this — it's a one-off local check, not a GSAP concern.
- Do NOT touch `targetFromHash`, the click handler, or the `window.setTimeout` hash-restore logic.
- If the code at `components/HashScrollManager.tsx:18-35` doesn't match the excerpt above (drift since commit `2d44475`), STOP and report instead of improvising.

## Verification

- **Mechanical**: `npm run build` (or `npx tsc --noEmit`) completes with no new errors.
- **Feel check**: run the dev server with a normal (non-reduced) OS motion setting, click a nav anchor link — confirm the page still smooth-scrolls exactly as before (no regression).
  - Toggle `prefers-reduced-motion` in DevTools' Rendering panel to "reduce", then click a nav anchor link again: confirm the page jumps instantly to the target section with no smooth animation.
  - With reduced motion still on, reload the page directly on a URL with a `#hash` in it: confirm the initial hash-restore scroll (the two `window.setTimeout` calls) also does not animate — it already passes `"auto"`, so this should be unaffected, just verify no regression.
- **Done when**: smooth scrolling only occurs when the OS has no reduced-motion preference set, verified via the DevTools toggle above.
