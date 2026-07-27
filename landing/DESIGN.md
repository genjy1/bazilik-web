---
name: Базилик (Bazilik)
description: A warm, editorial meal-planning landing that reads like an honest kitchen ledger with an emerald pantry glow.
colors:
  ground: "#f7f6f1"
  surface: "#efede4"
  panel: "#e9e7dd"
  line: "#e1dfd4"
  ink: "#16231c"
  muted: "#5c675f"
  accent: "#1f7a4d"
  accent-deep: "#12583a"
  accent-soft: "#ddece3"
  secondary: "#2a2116"
  herb: "#5e7238"
  amber: "#b26d24"
  gold: "#b8863a"
  danger: "#c0392b"
  on-accent: "#ffffff"
  glow: "rgba(53,176,110,0.16)"
typography:
  display:
    fontFamily: "Manrope, -apple-system, BlinkMacSystemFont, \"Helvetica Neue\", \"Segoe UI\", Roboto, Arial, sans-serif"
    fontSize: "clamp(40px, 8.6vw, 104px)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.055em"
  headline:
    fontFamily: "Manrope, -apple-system, BlinkMacSystemFont, \"Helvetica Neue\", \"Segoe UI\", Roboto, Arial, sans-serif"
    fontSize: "clamp(30px, 4.6vw, 52px)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Manrope, -apple-system, BlinkMacSystemFont, \"Helvetica Neue\", \"Segoe UI\", Roboto, Arial, sans-serif"
    fontSize: "18px"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Manrope, -apple-system, BlinkMacSystemFont, \"Helvetica Neue\", \"Segoe UI\", Roboto, Arial, sans-serif"
    fontSize: "clamp(16px, 2vw, 19px)"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  body-sm:
    fontFamily: "Manrope, -apple-system, BlinkMacSystemFont, \"Helvetica Neue\", \"Segoe UI\", Roboto, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  stat:
    fontFamily: "Manrope, -apple-system, BlinkMacSystemFont, \"Helvetica Neue\", \"Segoe UI\", Roboto, Arial, sans-serif"
    fontSize: "clamp(26px, 4vw, 42px)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.04em"
  label:
    fontFamily: "\"IBM Plex Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.14em"
  label-sm:
    fontFamily: "\"IBM Plex Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace"
    fontSize: "10px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.12em"
  kicker-number:
    fontFamily: "\"IBM Plex Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace"
    fontSize: "13px"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.14em"
  scale:
    body-base: "17px"
    body-sm-tight: "14px"
    label-xs: "9px"
rounded:
  pill: "9999px"
  focus: "4px"
  sm: "12px"
  md: "16px"
  lg: "24px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "40px"
  section-y: "clamp(64px, 10vw, 112px)"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.pill}"
    padding: "14px 24px"
  button-primary-hover:
    backgroundColor: "{colors.accent-deep}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "14px 24px"
  button-secondary-hover:
    textColor: "{colors.accent-deep}"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "24px"
  chip:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent-deep}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  toggle-active:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
    height: "44px"
  toggle-inactive:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.muted}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
    height: "44px"
---

# Design System: Базилик (Bazilik)

## Overview

**Creative North Star: "The Test Kitchen Ledger"**

Three ideas run through this system at once, and none of them is decorative flourish. The **Ledger**: everything reads like it was written by someone who keeps honest books — a receipt-textured mono type for every label, metric, and eyebrow; body copy that hedges its own claims instead of overselling them; a footer that literally prints its own accent hex like a supplier code. The **Emerald Pantry**: warmth and abundance carried entirely by one color — a deep, confident emerald (#1F7A4D) sitting on warm paper-and-oatmeal neutrals, never cold, never clinical. The **Test Kitchen**: this is a product that says out loud it's still being validated, and the flagship interaction (the scroll-driven 3D dish assembly) makes that literal — you watch raw ingredients become a plan in real time, and scrolling back undoes it just as honestly.

The system is warm, restrained, and editorial. It avoids two failure modes on either side of it: glossy food-influencer photography (filtered produce, lifestyle gloss, aspirational plating) and clinical health-app sterility (cold blues, clip-art icons, dashboard chrome). Instead it sits closer to a well-run kitchen's own paperwork — warm, plain-spoken, precise — with a single saturated color allowed to carry all the warmth and energy the palette needs.

**Key Characteristics:**
- Warm paper-and-oatmeal neutrals (never white, never cold gray) with a single confident emerald accent doing all the color work.
- Mono-caps labels (IBM Plex Mono, uppercase, wide tracking) everywhere a number, status, or eyebrow appears — the "ledger" texture.
- Flat, tonal-layered surfaces at rest; shadow appears only as a deliberate accent on the handful of elements meant to feel lifted.
- Full-pill shape language for anything actionable (buttons, toggles, tags); generous 16–24px rounding for anything that contains content (cards, panels).
- Motion and 3D are used to demonstrate the product's actual mechanism (ingredient reuse, scroll-as-cooking-time), not to decorate.

## Colors

Warm, low-saturation paper neutrals hold the page down; a single emerald accent is the only saturated color allowed to lead.

### Primary
- **Emerald** (`#1f7a4d`): the one accent. Primary buttons, active nav marker, active toggle states, link hovers, focus rings, the brand mark. The footer itself names this color ("Изумруд · #1F7A4D") — treat that naming as canonical, not a placeholder.
- **Emerald Deep** (`#12583a`): primary-hover and "spoken for" emphasis (accent headline word in the hero, active nav label).
- **Emerald Soft** (`#ddece3`): tint fill behind chips and small accent badges; never used at full size.

### Secondary (optional accents)
- **Olive Herb** (`#5e7238`): the "reuse/positive outcome" color — used specifically for the waste-reduction stat in the configurator and the checkmark badges in audience sections. Don't use it interchangeably with Emerald; it marks a distinct semantic (organic/reduction), not a second brand color.
- **Spice Amber** (`#b26d24`) / **Warm Gold** (`#b8863a`): sparing use for secondary macro dots and chip tones; keep both rare — they read as garnish, not structure.
- **Danger Red** (`#c0392b`): reserved for actual error/destructive states; not present in current marketing copy, don't invent uses for it.
- **Ambient Glow** (`rgba(53,176,110,0.16)`): a fixed rgba tint (the dark-mode Emerald at 16% alpha) used only for large, out-of-focus radial-gradient backgrounds behind the Engine and Recipe-Assembly sections. It's deliberately not theme-bound like the other tokens — the same value is used regardless of light/dark mode, because it's staging a moment rather than rendering brand-colored UI.

### Neutral
- **Warm Paper** (`#f7f6f1`, `--ground`): page background.
- **Oat Surface** (`#efede4`, `--surface`): section backgrounds that need to sit one step above ground (cards, footer, proof strip).
- **Oat Panel** (`#e9e7dd`, `--panel`): reserved deeper neutral, currently used sparingly beyond surface.
- **Hairline** (`#e1dfd4`, `--line`): every border, divider, and hairline in the system.
- **Ink** (`#16231c`): body text and headings.
- **Muted Ink** (`#5c675f`): secondary text, captions, inactive nav labels.
- **Espresso** (`#2a2116`, `--secondary`): dark neutral reserved for the darkest UI moments; currently under-used relative to its presence in the token set.

### Named Rules
**The One Accent Rule.** Emerald is the only saturated color that reads as "brand" on the page — herb/amber/gold are semantic garnishes for specific data (waste %, macros), never substitutes for the primary accent.

**The Dark Mirror Rule.** Every token flips to a dark-mode counterpart (e.g. Emerald → `#35b06e`, Warm Paper → `#0e1712`) via `prefers-color-scheme` or an explicit `data-theme` attribute; the frontmatter above lists the light/canonical values, but no surface should hardcode a light-mode hex where the CSS variable is available — this project is dark-mode-complete, not dark-mode-partial. An `.inverted` variant (used by the recipe-assembly section) also re-declares the full palette locally to force a dark, cinematic moment inside an otherwise light page — a deliberate exception, not a pattern to spread.

## Typography

**Display/Headline/Title Font:** Manrope (with system sans fallback)
**Body Font:** Manrope
**Label/Mono Font:** IBM Plex Mono

**Character:** A single confident grotesk carries every weight of voice from hero to caption, paired with a warm, humanist mono (chosen deliberately over a "terminal" mono like JetBrains Mono) that reads like a receipt or delivery note — fitting for a shopping-list-and-kitchen-ledger register, not a developer-tool one.

### Hierarchy
- **Display** (800, `clamp(40px,8.6vw,104px)`, line-height 0.92, tracking −0.055em): hero title only. Each line animates in from its own overflow-hidden mask; lines must not wrap, so copy length is tuned to the clamp.
- **Headline** (800, `clamp(30px,4.6vw,52px)`, line-height 1.05, tracking −0.035em): numbered section titles (paired with a small mono step-number like "01").
- **Title** (800, ~18px, tracking −0.03em): card titles, panel headers, nav brand.
- **Body** (400, `clamp(16px,2vw,19px)`, line-height 1.6): lead paragraphs and primary prose. Caps around 58–66ch measure. The plain CSS body default (outside any component override) sits at a flat 17px, one step below the lead clamp's floor — treat that as this role's un-clamped base size, not a separate step.
- **Body-sm** (400, 14–15px, line-height 1.5): secondary/supporting copy — footer link lists, card and engine-card descriptions, hypotheses answers, list-item bodies. One step down from Body, still Manrope, never mono.
- **Stat** (800, `clamp(26px,4vw,42px)`, line-height 1, tracking −0.04em, tabular-nums): large numeric displays — proof-strip counters, recipe-assembly macro values, configurator summary numbers. Always paired with a Label-sm caption underneath, never with its own descriptive sentence.
- **Label** (600, 11px, tracking 0.14em, uppercase): the mono register's primary size — eyebrows, nav links, toggle buttons, chip-adjacent copy. This is the system's most load-bearing typographic role; it appears more often than body text in most sections.
- **Label-sm** (600, 9–10.5px, tracking 0.1–0.12em, uppercase): the mono register's compact size — stat captions, chip text, footer group headings. Same voice as Label, smaller stage.
- **Kicker-number** (700, 13px, tracking 0.14em): the mono step-number ("01", "02"...) beside a Headline in `SectionKicker` — bold and accent-colored, distinct from Label-sm's muted informational tone.

Three further static steps appear outside these named roles and are enumerated in the frontmatter's `typography.scale` rather than given their own role, since each is the same voice one step tighter, not a new register: `17px` (Body's un-clamped CSS default), `14px` (Body-sm's tighter edge — e.g. recipe-assembly shopping rows), and `9px` (Label-sm's tightest edge — the day-of-week labels in the home-panel calendar preview).

### Named Rules
**The Mono-Caps-Never-For-Prose Rule.** IBM Plex Mono uppercase is reserved for short labels, numbers, and status words. It never carries a sentence — the moment it would need to wrap, switch back to Manrope.

## Layout

Single centered container at `max-w-[1180px]` with `px-6` gutters throughout — no wider content anywhere on the page. Vertical rhythm between major sections is generous and consistent: `py-16 md:py-28` (roughly 64px → 112px). Two-column sections (audience panels, configurator) collapse to a single stacked column below `lg`, with the media/panel column always reordered after the text column on mobile regardless of desktop order.

Density is intentionally low for narrative sections (one idea per screen-height-ish section) but tightens noticeably inside data-bearing panels (the plan-configurator summary, the recipe-assembly plan panel), where a 2–4 column metric grid packs several numbers into a single card. That contrast — spacious narrative shell, dense data panel — is deliberate: it signals "this specific box is the real product logic" against the surrounding marketing copy.

Sticky header is 64px tall, blurred (`backdrop-blur-xl`) and transparent until scrolled, at which point it gains a hairline border and a more opaque ground fill — never a hard color change, always a soft threshold crossing.

## Elevation & Depth

Flat by default. The system relies on tonal layering (ground → surface → panel, each one step warmer/darker) rather than shadows to separate content from background. Shadow is reserved as a deliberate accent for the small set of elements meant to feel lifted or important, and every shadow used is either colored (emerald-tinted, matching the element it belongs to) or a soft neutral dark — never a generic gray box-shadow.

### Shadow Vocabulary
- **Primary action glow** (`0 2px 6px rgba(31,122,77,0.26), 0 12px 30px rgba(31,122,77,0.22)`): the primary button at rest — the accent color announces itself even in the shadow.
- **Compact accent lift** (`0 10px 26px rgba(31,122,77,0.24)` / `0 12px 28px rgba(31,122,77,0.24)`): smaller emerald CTAs (the "включить базилик" toggle, compact chain pills).
- **Card hover lift** (`0 18px 44px rgba(0,0,0,0.35)`): engine cards on hover — neutral dark, structural rather than brand-colored, because it's a state change rather than a brand moment.
- **Panel resting shadow** (`0 24px 80px rgba(18,88,58,0.10)` / `0 18px 44px rgba(0,0,0,0.28)`): the problem-chain panel and the recipe-assembly plan panel — a large, soft, low-opacity shadow that reads as "this panel floats slightly above the page," not as a hard drop shadow.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest, separated by tonal steps, not shadows. Shadow appears only in response to hover/importance, and when it does, prefer the element's own color over generic gray.

Depth beyond the UI layer also comes from a fixed, full-page background layer of three soft blurred emerald/herb blobs drifting slowly behind all content (`blur-3xl`, low-opacity radial gradients, animated only on `transform`/`opacity`) — an ambient, out-of-focus depth cue rather than a structural one.

## Shapes

Two clear silhouette families, applied by function, not by size:

- **Full-pill (`rounded-full`)** for anything actionable or label-like: buttons, toggle buttons, chips, pills, the nav's mobile menu button. If a user can click it or it's a tag/status, it's a pill.
- **Generous rounded rectangles** for anything that contains content: `12px` (`rounded-xl`) for compact list rows and mobile menu items, `16px` (`rounded-2xl`) for standard cards (engine cards, macro tiles, the problem-chain panel), `24px` (`rounded-3xl`) for the largest content panels (recipe-assembly plan panel, configurator summary panel).

Borders are a 1px hairline (`--line`) on almost every card and panel edge — the system leans on this border plus a tonal background shift rather than shadow to define most containers. No sharp corners appear anywhere in the implemented system.

The one radius outside the pill/12/16/24 scale is the `:focus-visible` outline's own `4px` corner (`rounded.focus`) — small on purpose, since it traces a 2px outline sitting 3px off a control's own (usually much larger) radius, not a container shape in its own right.

## Components

### Buttons
- **Shape:** full pill (`rounded-full`), `px-6 py-3.5`, bold 15px text, tight tracking.
- **Primary:** emerald background, white text, colored ambient shadow (see Elevation), hover shifts to Emerald Deep and lifts `-2px` on Y with a 200ms transform/color transition; icon (arrow) nudges right on hover when present.
- **Secondary:** oat-surface background, ink text, hairline border; hover only changes border/text color to emerald — no shadow, no lift. Deliberately quieter than primary.

### Chips & Pills
- **Chip:** small mono-caps pill (10.5px), tinted background + matching text color per "tone" (accent/herb/amber/neutral), thin matching-tone border. Used for statuses, tags, and inline metadata.
- **Pill:** slightly larger mono-caps pill on a neutral surface/hairline border — used for hero meta tags ("iOS · Android", etc.), visually quieter than a tone-colored Chip.
- **Toggle button** (configurator): same pill shape and mono-caps type as a Chip, but functions as a real input — active state is solid emerald + white text, inactive is ground background + hairline border + muted text, `aria-pressed` reflects state. Every toggle button, plus the theme toggle and the mobile menu button, holds a 44px minimum touch target (`min-h-11`, and `min-w-11` for icon-only squares) regardless of how little padding the compact mono-caps label needs on its own.

### Cards / Containers
- **Corner style:** `16px` standard (engine cards, macro tiles), `24px` for the largest panels.
- **Background:** oat surface (or ground, one step lighter, when nested inside a surface-toned parent — e.g. macro tiles inside the emerald-assembly panel).
- **Shadow strategy:** flat at rest; see Elevation for the specific hover/importance shadows.
- **Border:** 1px hairline on essentially every card.
- **Internal padding:** 20–24px typical; compact metric tiles use 14–16px.
- **Signature behavior:** the Engine cards tilt toward the cursor in 3D (±6°, `perspective(1000px)`, pointer-fine only) with a soft radial emerald glow following the pointer — reserved for the four "engine mechanics" cards specifically, not a general card behavior.

### Inputs / Fields
- No traditional text inputs exist in the current implementation; all "input" surfaces are pill toggle buttons (see above) with `aria-pressed` state, or the interactive 3D scroll scene itself. If text inputs are added, they should inherit the hairline-border-on-oat-background language already established by secondary buttons and toggles, at `12–16px` radius, not full pill.

### Navigation
- Sticky, 64px, blurred/translucent until scrolled past 12px, then gains a hairline bottom border and a more opaque ground fill (soft threshold, not a hard swap).
- Desktop links are mono-caps 11px with wide tracking; an animated underline marker slides beneath whichever section is centered in the viewport (ScrollTrigger-driven, not simple `:hover`).
- Mobile collapses into a height-animated panel (measured against actual content height, not a fixed max-height) with staggered item entrance; the toggle button is a plain hairline-bordered circle, not styled as a primary/secondary button.

### The Recipe Assembly (signature component)
A single pinned, scroll-scrubbed 3D scene (three.js, dynamically loaded, rendered on demand from `ScrollTrigger.onUpdate` rather than a running render loop): raw modeled ingredients (tomato, chicken, basil, ground meat) fly in from off-screen, assemble onto a plate, then dissolve into a live macro/shopping-list data panel as the user keeps scrolling — and reassemble in reverse on scroll-up. This is the system's one moment of literal, physical-feeling brand demonstration; it sits inside a full-bleed `.inverted` (dark) section, the only place in the system where the palette flips locally regardless of site-wide theme. Treat this component's dark, cinematic staging as intentionally exceptional — don't extend `.inverted` sections elsewhere without the same justification (a mechanism worth staging as a moment, not routine content).

## Do's and Don'ts

### Do:
- **Do** let Emerald (`#1f7a4d` / dark-mode `#35b06e`) be the only saturated brand color on any given screen; everything else is neutral or a rare semantic accent (herb/amber/gold).
- **Do** use IBM Plex Mono uppercase with wide tracking (0.1–0.22em) for every label, eyebrow, stat caption, and status — it's the system's signature texture, not an occasional accent.
- **Do** keep surfaces flat by default and reserve shadow for the specific moments something is meant to feel lifted, using a color-matched shadow when the element itself is emerald.
- **Do** use full-pill shape for anything actionable, generous 16–24px rounding for anything that holds content, and a 1px hairline border on nearly every container.
- **Do** give every interactive control a 44px minimum touch target (`min-h-11`/`min-w-11`) even when its compact mono-caps label would render shorter on its own — pill height should never be purely a function of font-size and padding.
- **Do** respect `prefers-reduced-motion`: every current animation (hero intro, nav marker, card tilt, background blobs, the 3D scroll scene) has a static/reduced fallback baked in — new motion must too.

### Don't:
- **Don't** introduce a second saturated brand color, a gradient-heavy hero, or glossy lifestyle food photography — both read as a different, less honest product than the one this system documents.
- **Don't** use generic gray drop shadows; every shadow in the system is either color-matched to its element or a very low-opacity, large, soft neutral shadow.
- **Don't** set mono-caps type on anything long enough to wrap onto a second line — it's a label typeface, not a paragraph typeface.
- **Don't** spread the `.inverted` dark-flip pattern to more sections just for visual variety; it currently marks exactly one moment (the recipe assembly) as cinematically distinct from the rest of the page.
- **Don't** treat the configurator's live numbers as real product output in new copy — the system's own disclaimer language ("demo-calculation, simplified model") is a durable brand commitment, not boilerplate to trim.
