# 003 — Transition colors on theme toggle instead of snapping

- **Status**: DONE
- **Commit**: 2d44475
- **Severity**: MEDIUM
- **Category**: Missed opportunity (additive)
- **Estimated scope**: 1 file, 1 rule addition

## Problem

`components/ui/ThemeToggle.tsx:45-54` swaps the theme by setting a single
DOM attribute:

```ts
/* components/ui/ThemeToggle.tsx:45-54 — current */
function toggle() {
  const next: Theme = readTheme() === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  try {
    localStorage.setItem(KEY, next);
  } catch {
    // приватный режим — тема просто не запомнится
  }
  listeners.forEach((l) => l());
}
```

That attribute drives every color custom property on the page via
`:root[data-theme="dark"]` (`app/globals.css:48-64`), which redefines
`--ground`, `--surface`, `--panel`, `--line`, `--ink`, `--muted`, `--accent`,
`--accent-deep`, `--accent-soft`, `--secondary`, `--herb`, `--amber`,
`--gold`, `--danger`, `--on-accent` all at once. `app/globals.css` has no
`transition` on `body` or `html` for any of these — the entire page's
background, text, and border colors snap instantly on every click. This is
the site's most visible ungated state change: AUDIT.md §8 flags exactly
this scenario ("state changes that teleport ... where a brief transition
would prevent a jarring change").

```css
/* app/globals.css:97-105 — current */
body {
  background: var(--ground);
  color: var(--ink);
  font-family: var(--font-sans);
  font-size: 17px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}
```

## Target

```css
/* app/globals.css:97-106 — target */
body {
  background: var(--ground);
  color: var(--ink);
  font-family: var(--font-sans);
  font-size: 17px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
  transition: background-color 200ms ease, color 200ms ease;
}
```

200ms/`ease` is deliberate: AUDIT.md §2's decision order puts "Hover / color
change → `ease`" (not a directional `ease-out`/`ease-in-out` curve, since
this isn't an entrance or on-screen movement), and 200ms matches this repo's
own existing convention for color-adjacent transitions — see Repo
conventions below. Per AUDIT.md §6, reduced-motion should keep color
feedback and only drop movement, so this transition does NOT need a
`prefers-reduced-motion` override — leave it ungated.

## Repo conventions to follow

- This codebase has no shared CSS `--duration-*`/`--ease-*` custom
  properties (only GSAP-side `EASE`/`DUR` in `lib/gsap.ts`, which don't
  apply to a plain CSS transition). For a hand-written CSS transition,
  match the duration this repo already uses for its other color-adjacent
  transitions: `components/ui/Button.tsx:9` uses
  `transition-[transform,box-shadow,background-color,border-color,color] duration-200`
  — 200ms is this repo's established color-transition duration. Reuse it
  literally, don't invent a new value.

## Steps

1. In `app/globals.css`, inside the existing `body` rule (`app/globals.css:97-105`, inside the `@layer base { html { ... } body { ... } }` block), add one line: `transition: background-color 200ms ease, color 200ms ease;` as the last declaration before the closing `}`.

## Boundaries

- Do NOT add this transition to `html`, `:root`, or any other selector — `body` only.
- Do NOT add `border-color` to the transition list — this plan is scoped to the background/text snap described above; individual components (Button, Nav, etc.) already manage their own border-color transitions locally and adding a second global one risks stacking/timing conflicts with those.
- Do NOT wrap this in a `@media (prefers-reduced-motion: reduce)` block — color transitions should be kept under reduced motion per AUDIT.md §6.
- Do NOT touch `components/ui/ThemeToggle.tsx` — the fix is CSS-only.
- If the code at `app/globals.css:97-105` doesn't match the excerpt above (drift since commit `2d44475`), STOP and report instead of improvising.

## Verification

- **Mechanical**: `npm run build` completes with no new errors; confirm no visual regression by diffing a screenshot of the page in both themes before/after (colors should be identical at rest — only the transition timing changes).
- **Feel check**: run the dev server, click the theme toggle in the nav.
  - The background and text colors should visibly cross-fade over ~200ms rather than snapping instantly.
  - Elements that already have their own `transition-colors` (nav links, buttons, cards) should not look like they're fighting or double-animating — they were already transitioning their own colors, this just adds the same behavior to the page background/base text that previously had none.
  - In DevTools, set Animations panel playback to 10% (if it captures the CSS transition) or use the Rendering panel's paint flashing to confirm the swap is now gradual, not instantaneous.
  - Confirm page load itself (first paint, before any toggle) still shows the correct theme immediately with no visible transition flash — the inline script in `layout` sets `data-theme` before hydration, so this should be unaffected, but verify.
- **Done when**: toggling the theme produces a visible ~200ms color cross-fade instead of an instant snap, with no flash-of-wrong-theme on initial page load.
