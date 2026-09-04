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
  herb-ink: "#4a5c2c"
  amber: "#b26d24"
  amber-deep: "#87531c"
  gold: "#b8863a"
  danger: "#c0392b"
  on-accent: "#ffffff"
  glow: "rgba(53,176,110,0.16)"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Helvetica Neue\", \"Segoe UI\", Roboto, Arial, sans-serif"
    fontSize: "clamp(40px, 8vw, 92px)"
    fontWeight: 800
    lineHeight: 0.94
    letterSpacing: "-0.05em"
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Helvetica Neue\", \"Segoe UI\", Roboto, Arial, sans-serif"
    fontSize: "clamp(30px, 4.6vw, 52px)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.035em"
  headline-cta:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Helvetica Neue\", \"Segoe UI\", Roboto, Arial, sans-serif"
    fontSize: "clamp(28px, 4.4vw, 48px)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.045em"
  title-lg:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Helvetica Neue\", \"Segoe UI\", Roboto, Arial, sans-serif"
    fontSize: "clamp(22px, 2.4vw, 24px)"
    fontWeight: 800
    lineHeight: 1.375
    letterSpacing: "-0.025em"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Helvetica Neue\", \"Segoe UI\", Roboto, Arial, sans-serif"
    fontSize: "18px"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  title-sm:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Helvetica Neue\", \"Segoe UI\", Roboto, Arial, sans-serif"
    fontSize: "15.5px"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.025em"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Helvetica Neue\", \"Segoe UI\", Roboto, Arial, sans-serif"
    fontSize: "clamp(16px, 2vw, 19px)"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  body-sm:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Helvetica Neue\", \"Segoe UI\", Roboto, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  stat:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Helvetica Neue\", \"Segoe UI\", Roboto, Arial, sans-serif"
    fontSize: "clamp(32px, 4vw, 36px)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.025em"
  stat-sm:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Helvetica Neue\", \"Segoe UI\", Roboto, Arial, sans-serif"
    fontSize: "26px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.04em"
  label:
    fontFamily: "ui-monospace, \"SF Mono\", Menlo, Consolas, monospace"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.14em"
  label-sm:
    fontFamily: "ui-monospace, \"SF Mono\", Menlo, Consolas, monospace"
    fontSize: "10px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.12em"
  step-number:
    fontFamily: "ui-monospace, \"SF Mono\", Menlo, Consolas, monospace"
    fontSize: "13px"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.14em"
  scale:
    body-base: "1.0625rem"
    body-sm-tight: "14px"
    chip: "10.5px"
    chip-lg: "12px"
    page-title: "28px"
    phone-screen-body: "12.5px"
    phone-counter: "24px"
    scene-label-hidden: "9px"
rounded:
  pill: "9999px"
  focus: "4px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  phone: "36px"
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
  chip-herb:
    textColor: "{colors.herb-ink}"
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

Three ideas run through this system at once, and none of them is decorative flourish. The **Ledger**: everything reads like it was written by someone who keeps honest books — a receipt-textured mono type for every label, metric, and status; body copy that hedges its own claims instead of overselling them; demo numbers that call themselves demo numbers in the interface. The **Emerald Pantry**: warmth and abundance carried entirely by one color — a deep, confident emerald (#1F7A4D) sitting on warm paper-and-oatmeal neutrals, never cold, never clinical. The **Test Kitchen**: this is a product that says out loud it's still being validated, and the flagship interaction makes the mechanism literal — the hero's eight-step routine collapses to two on a real toggle, and the "three steps" section pins a phone that turns on a ring as you scroll, screen by screen, and turns back just as honestly when you scroll up.

The system is warm, restrained, and editorial. It avoids two failure modes on either side of it: glossy food-influencer photography (filtered produce, lifestyle gloss, aspirational plating) and clinical health-app sterility (cold blues, clip-art icons, dashboard chrome). Instead it sits closer to a well-run kitchen's own paperwork — warm, plain-spoken, precise — with a single saturated color allowed to carry all the warmth and energy the palette needs. There are no photographs on the live pages at all: every dish, ingredient, and app screen is drawn in code from the same token set.

**Key Characteristics:**
- Warm paper-and-oatmeal neutrals (never white, never cold gray) with a single confident emerald accent doing all the color work.
- Mono-caps labels (system mono, uppercase, wide tracking) wherever a number, status, or caption appears — the "ledger" texture.
- Flat, tonal-layered surfaces at rest; shadow appears only as a deliberate accent on the handful of elements meant to feel lifted, and every shadow is a theme-aware token.
- Full-pill shape language for anything actionable (buttons, toggles, tags); generous 16–24px rounding for anything that contains content (cards, panels).
- Motion demonstrates the product's actual mechanism (chain collapsing, a week filling in, a scanner yielding to an assumed pantry), never decorates; every animation has a reduced-motion and no-JS end state baked into the markup.

## Colors

Warm, low-saturation paper neutrals hold the page down; a single emerald accent is the only saturated color allowed to lead.

### Primary
- **Emerald** (`#1f7a4d`): the one accent. Primary buttons, active nav marker, active toggle states, link hovers, focus rings, the brand mark, progress segments and the shopping-list checks inside the phone screens.
- **Emerald Deep** (`#12583a`): primary-hover and "spoken for" emphasis (accent headline word in the hero, active nav label, the eyebrow, callout prose).
- **Emerald Soft** (`#ddece3`): tint fill behind chips, the "ready plan" pill, the comparison's "us" column and the two outro callouts; never used at full size.

### Secondary (optional accents)
- **Olive Herb** (`#5e7238`): the "reuse / positive outcome" color — fills and dots only: the checkmark badges in the specialists sections, the lunch slot in the calendar scene, the herb chip's tinted background. Don't use it interchangeably with Emerald; it marks a distinct semantic (organic, reduction), not a second brand color.
- **Herb Ink** (`#4a5c2c`): the text-safe olive. Herb on its own 15 % tint measures 4.07:1, which fails AA for the 10.5–12 px chips it lives on; Herb Ink measures 6.4:1 there. Any olive *text* (chip labels, the waste stat) takes Herb Ink; any olive *fill* keeps Herb.
- **Spice Amber** (`#b26d24`) / **Amber Deep** (`#87531c`) / **Warm Gold** (`#b8863a`): sparing use for the dinner slot, the expiry badges in the pain scenes and chip tones; keep all three rare — they read as garnish, not structure. Amber text uses Amber Deep for contrast.
- **Danger Red** (`#c0392b`): reserved for actual error/destructive states and the two "crossed out" strokes in the receipt and scanner scenes; not present in marketing copy, don't invent uses for it.
- **Ambient Glow** (`rgba(53,176,110,0.16)`, `--glow`): the dark-mode emerald at 16 % alpha, used only for the large out-of-focus radial gradient behind the phone stage. Deliberately the same value in both themes because it stages a moment rather than rendering brand-colored UI; still a token so no component carries the rgba literal.

### Neutral
- **Warm Paper** (`#f7f6f1`, `--ground`): page background.
- **Oat Surface** (`#efede4`, `--surface`): section backgrounds that need to sit one step above ground (cards, footer, hero chain panel).
- **Oat Panel** (`#e9e7dd`, `--panel`): reserved deeper neutral, currently used sparingly beyond surface.
- **Hairline** (`#e1dfd4`, `--line`): every border, divider, and hairline in the system.
- **Ink** (`#16231c`): body text and headings.
- **Muted Ink** (`#5c675f`): secondary text, captions, inactive nav labels. Always at full opacity — a 70 % muted fails contrast in both themes.
- **Espresso** (`#2a2116`, `--secondary`): dark neutral reserved for the darkest UI moments; currently under-used relative to its presence in the token set.

### Named Rules
**The One Accent Rule.** Emerald is the only saturated color that reads as "brand" on the page — herb/amber/gold are semantic garnishes for specific data (waste %, meal slots, expiry), never substitutes for the primary accent.

**The Dark Mirror Rule.** Every token flips to a dark-mode counterpart (Emerald → `#35b06e`, Warm Paper → `#0e1712`, Herb Ink → `#9bb169`) via `prefers-color-scheme` or an explicit `data-theme` attribute; the frontmatter above lists the light/canonical values. No surface hardcodes a light-mode value where the CSS variable is available, and that includes shadows and gradients: they are tokens too (see Elevation). This project is dark-mode-complete, not dark-mode-partial.

**The Realistic Ingredient Rule.** The drawn ingredients in `lib/ingredients.ts` (tomato, basil, chicken, egg, garlic, dill, onion, pepper, pasta) use realistic food colors outside the token set on purpose — a food brand cannot afford a grey tomato. Those hex values are the ingredient palette, not UI colors: never recolor them to brand tokens, and never borrow them for interface elements.

## Typography

**Display/Headline/Title Font:** System sans — `-apple-system` / `BlinkMacSystemFont` / Helvetica Neue / Segoe UI / Roboto
**Body Font:** the same system sans
**Label/Mono Font:** System mono — `ui-monospace` / SF Mono / Menlo / Consolas

**Character:** No web font is loaded. The landing renders in the platform's own grotesk and its own mono — the same stacks the iOS and Android apps draw with (SwiftUI `.system`, Compose `FontFamily.Default`), as brand book §04 specifies. A single confident grotesk carries every weight of voice from hero to caption; the mono is the ledger register — receipts, delivery notes, shopping lists — never a developer-tool one. The trade is deliberate: letterforms shift between macOS, Windows and Android instead of being pinned by a downloaded face, and in exchange the site matches the product and paints on the first frame.

### Hierarchy
- **Display** (800, `clamp(40px,8vw,92px)`, line-height 0.94, tracking −0.05em): hero title only, two lines with the second in Emerald Deep. Copy length is tuned to the clamp so it never wraps to a third line at 375 px.
- **Headline** (800, `clamp(30px,4.6vw,52px)`, line-height 1.05, tracking −0.035em): section titles via `SectionKicker` — a bare H2 with an optional lead, no number. The final CTA headline and the pinned phone-stage headline run one step tighter (`clamp(28px,4.4vw,48px)` / `clamp(28px,3.6vw,46px)`).
- **Title-lg** (800, 22px → 24px at `md`, line-height ~1.4): card titles in the "what you get" grid; the specialists process rows run the same role fluidly (`clamp(20px,2.6vw,27px)`).
- **Title** (800, 18px, tracking −0.03em): nav brand, footer brand, the waste/reuse/time tiles in the configurator.
- **Title-sm** (700, 15–15.5px, tracking −0.025em): comparison row titles, check-grid headings, panel headers, the "next step" lead.
- **Body** (400, `clamp(16px,2vw,19px)`, line-height 1.6): lead paragraphs and primary prose, capped at 58–66ch. The CSS body default is `1.0625rem` (17px at the browser default) so a reader's own font-size preference still counts; it is Body's un-clamped base, not a separate step.
- **Body-sm** (400, 14–15.5px, line-height 1.5): supporting copy — card descriptions, comparison cells, footer links, pain-card sentences, hypothesis disclaimers. One step down from Body, still the system sans, never mono.
- **Stat** (800, `clamp(32px,4vw,36px)`, line-height 1, tabular-nums): the ring values in the goals section. **Stat-sm** (800, 26px): the four configurator summary numbers. Both are always paired with a Label-sm caption underneath, never with their own sentence.
- **Label** (600, 11–11.5px, tracking 0.1–0.22em, uppercase): the mono register's primary size — eyebrows, nav links, toggle buttons, ring captions. The system's most load-bearing typographic role.
- **Label-sm** (600, 10–10.5px, tracking 0.1–0.16em, uppercase): the mono register's compact size — stat captions, configurator group labels, phone-screen field labels, comparison column labels, chip text, footer group headings. **10 px is the floor for anything a screen reader or a sighted reader is meant to read.**
- **Step-number** (700, 11–13px, tracking 0.14em, Emerald): the mono numeral beside a step in an actual sequence — the three captions above the phone stage and the 01/02/03 rows of the specialists process. It is *not* a section decoration.

Three static sizes sit outside the named roles and are listed in the frontmatter's `typography.scale`: `12.5px` (phone-screen body rows), `24px` (the household counter on the first phone screen), `12px` (the larger chip variant in the goals section), `28px` (the cookies page title), and `9px`, which is permitted only inside `aria-hidden` scene frames (the "what you get" mini-screens) where the type is texture, not text.

### Named Rules
**The Mono-Caps-Never-For-Prose Rule.** The mono in uppercase is reserved for short labels, numbers, and status words. It never carries a sentence — the moment it would need to wrap, switch back to the sans.

**The Ten-Pixel Floor Rule.** Readable text stops at 10 px. Anything smaller lives only inside a container marked `aria-hidden`, where it is drawn detail rather than content.

**The Number-Means-Sequence Rule.** A mono numeral appears only where order carries information the reader needs (steps in a process). Sections, cards and benefits are not numbered.

## Layout

Single centered container at `max-w-[1180px]` with `px-6` gutters throughout — no wider content anywhere on the page; the hero narrows to `max-w-[900px]` and centers its text. Vertical rhythm between major sections is generous and consistent: `py-16 md:py-28` (roughly 64px → 112px), and sections are separated by an animated hairline (`SectionDivider`) that draws itself from the center outward once, then stays.

Two-column sections (the configurator, the specialists win-win grid) collapse to a single stacked column below `lg`/`md`. Card grids are two-up from `sm` (pain cards, "what you get") or three-up from `md` (existing-clients). The pinned phone stage exists only at `md` and above with motion allowed; below that, or under `prefers-reduced-motion`, the same three screens render as a static centered column with a caption under each.

Density is intentionally low for narrative sections (one idea per screen-height-ish section) but tightens noticeably inside data-bearing panels (the configurator summary, the phone screens), where a 2–4 column metric grid packs several numbers into a single card. That contrast — spacious narrative shell, dense data panel — is deliberate: it signals "this specific box is the real product logic" against the surrounding marketing copy.

Sticky header is 64px tall, blurred (`backdrop-blur-xl`) and transparent until scrolled 12px, at which point it gains a hairline border and a more opaque ground fill — never a hard color change, always a soft threshold crossing. Every control in the header, footer, cookie banner and goals toggle holds a 44px minimum hit area (`min-h-11`), regardless of how little the compact mono label needs.

## Elevation & Depth

Flat by default. The system relies on tonal layering (ground → surface → panel, each one step warmer/darker) plus a 1px hairline rather than shadows to separate content from background. Shadow is reserved as a deliberate accent for the small set of elements meant to feel lifted, and every shadow is a CSS token with its own dark-mode value: emerald-tinted in light, tinted with the dark emerald or a plain neutral dark in dark.

### Shadow Vocabulary
- **`--shadow-accent`** (`0 2px 6px rgba(31,122,77,0.26), 0 12px 30px rgba(31,122,77,0.22)`): the primary button at rest — the accent color announces itself even in the shadow.
- **`--shadow-accent-strong`** (`0 2px 8px rgba(31,122,77,0.28), 0 18px 44px rgba(31,122,77,0.28)`): the one oversized CTA, the "Включить Базилик" toggle in its off state.
- **`--shadow-accent-lift`** (`0 12px 28px rgba(31,122,77,0.24)`): the compact emerald pills of the collapsed chain.
- **`--shadow-accent-soft`** (`0 6px 18px rgba(31,122,77,0.12)`): the toggle once it is on — quieter, because the collapsed chain beside it now carries the emerald.
- **`--shadow-panel`** (`0 24px 80px rgba(18,88,58,0.10)` light, `0 24px 80px rgba(0,0,0,0.45)` dark): the hero's chain panel — large, soft, low-opacity, "floats slightly above the page."
- **`--phone-shadow`**: the phone shell in the steps scene; in dark mode it adds a hairline rim and an emerald glow because a black shadow on a dark ground draws no silhouette.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest, separated by tonal steps and hairlines, not shadows. Shadow appears only for importance, and when it does it is a named token, never an rgba literal in a class.

Depth beyond the UI layer also comes from two fixed, full-page background layers: three soft blurred emerald/herb blobs (`blur-2xl`, low-opacity radial gradients) and nine drawn ingredients at 35 % opacity. Both drift slowly and parallax with scroll, but only at 768px and above with motion allowed; on phones they sit still. They are ambient, out-of-focus depth cues rather than structural ones.

## Shapes

Two clear silhouette families, applied by function, not by size:

- **Full-pill (`rounded-full`)** for anything actionable or label-like: buttons, toggle buttons, chips, pills, the nav's mobile menu button, the chain steps. If a user can click it or it's a tag/status, it's a pill.
- **Generous rounded rectangles** for anything that contains content: `12px` (`rounded-xl`) for compact list rows, callouts, comparison cells and mobile menu items, `16px` (`rounded-2xl`) for standard cards (pain cards, "what you get" cards, the hero chain panel), `24px` (`rounded-3xl`) for the largest content panels (configurator summary), and `36px` for the phone shell.

Borders are a 1px hairline (`--line`) on almost every card and panel edge — the system leans on this border plus a tonal background shift rather than shadow to define most containers. Callouts (the comparison outro, the win-win summary, the "us" column of each comparison row) use the same hairline plus an Emerald Soft fill and Emerald Deep text; there is no thicker colored rail anywhere in the system. No sharp corners appear.

The one radius outside the pill/12/16/24/36 scale is the `:focus-visible` outline's own `4px` corner (`rounded.focus`) — small on purpose, since it traces a 2px outline sitting 3px off a control's own (usually much larger) radius.

## Components

### Buttons
- **Shape:** full pill (`rounded-full`), `px-6 py-3.5`, bold 15px text, tight tracking.
- **Primary:** emerald background, white text, `--shadow-accent`, hover shifts to Emerald Deep and lifts `-2px` on Y with a 200ms transform/color transition; arrow icon nudges right on hover when present.
- **Secondary:** oat-surface background, ink text, hairline border; hover only changes border/text color to emerald — no shadow, no lift. Deliberately quieter than primary.
- **The Basilik toggle** (`BasilikToggleButton`): the hero's single ask, larger than any other control (`min-h-14`, 16–18px extrabold). Off: solid emerald with `--shadow-accent-strong` and a slow 1 → 1.03 breathing pulse on its wrapper. On: Emerald Soft fill, Emerald Deep text, `--shadow-accent-soft`, no pulse — the collapsed chain beside it now carries the color.

### Chips & Pills
- **Chip:** small mono pill (10.5px; 12px in the goals section), tinted background + matching text color per "tone" (accent / herb / amber / neutral), thin matching-tone border. The herb tone sets its text in Herb Ink, not Herb. Used for statuses, tags, dish names, and inline metadata.
- **Toggle button** (configurator, goals mode switch): same pill shape and mono-caps type as a Chip, but functions as a real input — active state is solid emerald + white text, inactive is ground background + hairline border + muted text, `aria-pressed` reflects state. Every toggle button, plus the theme toggle, the mobile menu button and the cookie button, holds a 44px minimum touch target (`min-h-11`, and `min-w-11` for icon-only squares).

### Cards / Containers
- **Corner style:** `16px` standard (pain cards, "what you get" cards), `24px` for the configurator panel.
- **Background:** oat surface (or ground, one step lighter, when nested inside a surface-toned parent — e.g. the configurator summary inside the CTA panel).
- **Shadow strategy:** flat at rest; only the hero chain panel carries `--shadow-panel`.
- **Border:** 1px hairline on essentially every card.
- **Internal padding:** 20–32px typical; compact metric tiles use 12–16px.
- **Signature behavior:** the pain cards tilt a static 1–2° each way — the page's one "nervous" block — and each holds a looping mini-scene that plays only while visible, a bounded number of times.

### Scene Frames (the "what you get" cards)
Each of the five benefit cards ends in a mini app screen: a slim header with a mono label and a short mono hint on the right, then a fixed 92px field. The frame is `aria-hidden` (the title and body above it carry the meaning), which is what licenses its 8.5–9px type. Markup always describes the *end* state of the scene; GSAP rewinds and plays it once on entry and again on hover or tap.

### Inputs / Fields
- No traditional text inputs exist in the current implementation; all "input" surfaces are pill toggle buttons (see above). If text inputs are added, they should inherit the hairline-border-on-oat-background language already established by secondary buttons and toggles, at `12–16px` radius, not full pill.

### Navigation
- Sticky, 64px, blurred/translucent until scrolled past 12px, then gains a hairline bottom border and a more opaque ground fill (soft threshold, not a hard swap).
- Desktop links are mono-caps 11px with wide tracking, each a 44px-tall flex item; an animated underline marker slides beneath whichever section is centered in the viewport (ScrollTrigger-driven, not `:hover`) and sits 6px above the link's bottom edge.
- Mobile collapses into a height-animated panel (measured against actual content height) with staggered item entrance and `inert` while closed; items are 44px rows; the toggle button is a plain hairline-bordered circle, not styled as a primary/secondary button.

### Section Kicker
A section opens with a bare Headline H2 and an optional lead in Body, wrapped in a one-time reveal. Nothing else: no eyebrow, no numeral, no rule. The mono eyebrow appears exactly twice on a page — above the hero title and above the final CTA — so it reads as a bookend rather than grammar.

### The Phone Steps Scene (signature component)
A single pinned, scroll-scrubbed stage (`h-screen`, 2.4 viewport-heights of scroll): three drawn app screens sit on the faces of a 3D ring (`perspective 1400px`, radius 320px) inside a phone shell with a matching back cover. Progress 0→1 is a pure function of scroll: the ring rests on each "shelf" while that screen's content draws itself (shopping rows check off, cooking steps tick), then turns 120° to the next; scrolling back turns it back. A three-segment progress bar and a swapping caption in the header track the same progress. Below `md` or under reduced motion the stage is replaced by a static column of the same three screens. This is the system's one moment of literal product demonstration; its emerald radial `--glow` behind the stage is the only large-area color wash on the page.

## Do's and Don'ts

### Do:
- **Do** let Emerald (`#1f7a4d` / dark-mode `#35b06e`) be the only saturated brand color on any given screen; everything else is neutral or a rare semantic accent (herb/amber/gold), and olive *text* is always Herb Ink.
- **Do** use the system mono uppercase with wide tracking (0.1–0.22em) for every label, stat caption, and status — it's the system's signature texture, not an occasional accent — and keep it at 10px or larger wherever it is meant to be read.
- **Do** keep surfaces flat by default and reserve shadow for the specific moments something is meant to feel lifted, always through a `--shadow-*` token so dark mode gets its own value.
- **Do** use full-pill shape for anything actionable, generous 12–24px rounding for anything that holds content, and a 1px hairline border on nearly every container, callouts included.
- **Do** give every interactive control a 44px minimum touch target (`min-h-11`/`min-w-11`) even when its compact mono-caps label would render shorter on its own — pill height should never be purely a function of font-size and padding.
- **Do** respect `prefers-reduced-motion` and the no-JS case: every animation branches on `gsap.matchMedia`, hides its start state only under the `.js` class, and leaves the finished state in the markup.
- **Do** register a GSAP plugin in the component that calls it, not globally — `lib/gsap.ts` registers only ScrollTrigger and DrawSVG because those are the only two every page uses.

### Don't:
- **Don't** introduce a second saturated brand color, a gradient-heavy hero, or glossy lifestyle food photography — both read as a different, less honest product than the one this system documents.
- **Don't** use rgba shadow literals in class names or generic gray drop shadows; every shadow is a token, color-matched to its element or a very low-opacity, large, soft neutral.
- **Don't** number sections, cards or benefits. A mono numeral means "this is step N of a real sequence" and nothing else.
- **Don't** mark a callout with a thicker colored left or top border; the system's callout is hairline + Emerald Soft fill + Emerald Deep text.
- **Don't** set mono-caps type on anything long enough to wrap onto a second line — it's a label typeface, not a paragraph typeface.
- **Don't** treat the configurator's live numbers as real product output in new copy — the system's own disclaimer language ("demo-calculation, simplified model") is a durable brand commitment, not boilerplate to trim.
- **Don't** recolor the drawn ingredients to brand tokens, or borrow their realistic hues for UI.
