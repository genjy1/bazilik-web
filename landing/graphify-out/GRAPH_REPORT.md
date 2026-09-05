# Graph Report - landing  (2026-09-05)

## Corpus Check
- 101 files · ~101,146 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 712 nodes · 1011 edges · 44 communities (40 shown, 4 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 22 edges (avg confidence: 0.55)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `84d63780`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- 001 — Fix scale(0) entrance on engine icon marks
- Anti-Slop Frontend Design Skill (design-taste-frontend)
- compilerOptions
- PlanConfigurator.tsx
- Components
- devDependencies
- Product Marketing Context
- Three.js Fundamentals Skill
- Product
- PhoneStepsScene.tsx
- layout.tsx
- Animation Standards Reference
- site.ts
- Animation Audit Playbook
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- Apple Design
- Workflow
- Лендинг B2C
- Glossary
- app/page.tsx
- Finding Animation Opportunities
- Лендинг B2C — визуал и анимации
- Лендинг B2B2C
- The list
- Reveal.tsx
- PainChaos.tsx
- Design Engineering
- Component Building Principles
- AudienceHero.tsx
- GoalsSection.tsx
- The Animation Decision Framework
- gsap.ts
- clip-path for Animation
- Performance Rules
- Gesture and Drag Interactions
- CSS Transform Mastery
- The Sonner Principles (Building Loved Components)
- Spring Animations
- Core Philosophy
- Debugging Animations
- alt

## God Nodes (most connected - your core abstractions)
1. `Anti-Slop Frontend Design Skill (design-taste-frontend)` - 23 edges
2. `Apple Design` - 20 edges
3. `compilerOptions` - 16 edges
4. `Design Engineering` - 16 edges
5. `Animation Standards Reference` - 16 edges
6. `Product Marketing Context` - 14 edges
7. `Reveal()` - 13 edges
8. `Glossary` - 13 edges
9. `SectionKicker()` - 12 edges
10. `useLoopWhileVisible()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `generateMetadata()` --calls--> `inheritedOgImages()`  [EXTRACTED]
  app/cookies/page.tsx → lib/site.ts
- `robots()` --calls--> `absoluteUrl()`  [EXTRACTED]
  app/robots.ts → lib/site.ts
- `sitemap()` --calls--> `absoluteUrl()`  [EXTRACTED]
  app/sitemap.ts → lib/site.ts
- `generateMetadata()` --calls--> `inheritedOgImages()`  [EXTRACTED]
  app/specialists/page.tsx → lib/site.ts
- `DinnerScene()` --calls--> `useLoopWhileVisible()`  [EXTRACTED]
  components/PainChaos.tsx → lib/gsap.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **GSAP Skill Family (core, frameworks, performance, plugins, react, scrolltrigger, timeline, utils)** — _agents_skills_gsap_core_skill_skill, _agents_skills_gsap_frameworks_skill_skill, _agents_skills_gsap_performance_skill_skill, _agents_skills_gsap_plugins_skill_skill, _agents_skills_gsap_react_skill_skill, _agents_skills_gsap_scrolltrigger_skill_skill, _agents_skills_gsap_timeline_skill_skill, _agents_skills_gsap_utils_skill_skill [EXTRACTED 1.00]
- **Three.js Skill Family (animation, fundamentals, geometry, interaction, lighting, loaders, materials)** — _agents_skills_threejs_animation_skill_skill, _agents_skills_threejs_fundamentals_skill_skill, _agents_skills_threejs_geometry_skill_skill, _agents_skills_threejs_interaction_skill_skill, _agents_skills_threejs_lighting_skill_skill, _agents_skills_threejs_loaders_skill_skill, _agents_skills_threejs_materials_skill_skill [EXTRACTED 1.00]
- **Project Root Documentation Set (AGENTS.md, CLAUDE.md, README.md)** — agents_doc, claude_doc, readme_doc [EXTRACTED 1.00]

## Communities (44 total, 4 thin omitted)

### Community 0 - "001 — Fix scale(0) entrance on engine icon marks"
Cohesion: 0.04
Nodes (39): 001 — Fix scale(0) entrance on engine icon marks, Boundaries, Problem, Repo conventions to follow, Steps, Target, Verification, 002 — Gate smooth anchor scrolling behind prefers-reduced-motion (+31 more)

### Community 1 - "Anti-Slop Frontend Design Skill (design-taste-frontend)"
Cohesion: 0.10
Nodes (38): Anti-Slop Frontend Design Skill (design-taste-frontend), GSAP Core Skill, GSAP Frameworks Skill (Vue/Svelte/Nuxt), GSAP Performance Skill, GSAP Plugins Skill, GSAP React Skill, GSAP ScrollTrigger Skill, GSAP Timeline Skill (+30 more)

### Community 2 - "compilerOptions"
Cohesion: 0.07
Nodes (28): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+20 more)

### Community 3 - "PlanConfigurator.tsx"
Cohesion: 0.12
Nodes (20): mealsWord(), PlanConfigurator(), tripsWord(), AnimatedNumber(), Props, BASE, Config, DEFAULT_CONFIG (+12 more)

### Community 4 - "Components"
Cohesion: 0.07
Nodes (27): Buttons, Cards / Containers, Chips & Pills, Colors, Components, Design System: Базилик (Bazilik), Do:, Do's and Don'ts (+19 more)

### Community 5 - "devDependencies"
Cohesion: 0.05
Nodes (36): dependencies, gsap, lucide-react, next, react, react-dom, devDependencies, eslint (+28 more)

### Community 6 - "Product Marketing Context"
Cohesion: 0.13
Nodes (14): Brand Voice, Changelog, Competitive Landscape, Customer Language, Differentiation, Goals, Objections, Personas (+6 more)

### Community 7 - "Three.js Fundamentals Skill"
Cohesion: 0.27
Nodes (16): Three.js Animation Skill, Three.js Fundamentals Skill, Three.js Geometry Skill, Three.js Interaction Skill, Three.js Lighting Skill, Three.js Loaders Skill, Three.js Materials Skill, Three.js AnimationMixer/AnimationClip/AnimationAction System (+8 more)

### Community 8 - "Product"
Cohesion: 0.17
Nodes (11): Accessibility & Inclusion, Brand Commitments, Capabilities and Constraints, Evidence on Hand, Operating Context, Platform, Positioning, Product (+3 more)

### Community 9 - "PhoneStepsScene.tsx"
Cohesion: 0.05
Nodes (33): AmbientIngredients(), ITEMS, COOK_STEPS, DIET_GOALS, LIFE_GOALS, productWord(), SHOPPING, ShoppingItem (+25 more)

### Community 10 - "layout.tsx"
Cohesion: 0.15
Nodes (16): metadata, viewport, CookieConsent(), HashScrollManager(), scrollToHash(), targetFromHash(), InlineScript(), YandexMetrika() (+8 more)

### Community 11 - "Animation Standards Reference"
Cohesion: 0.07
Nodes (25): Aggressive Escalation Triggers, Guidelines, Operating Posture, Part 1 — Findings table (REQUIRED), Part 2 — Verdict (REQUIRED), Remedial Preference Hierarchy, Required Output Format, Reviewing Animations (+17 more)

### Community 12 - "site.ts"
Cohesion: 0.07
Nodes (31): generateMetadata(), metadata, Image(), markUri(), size, robots(), sitemap(), generateMetadata() (+23 more)

### Community 13 - "Animation Audit Playbook"
Cohesion: 0.09
Nodes (21): 1. Purpose & frequency, 2. Easing & duration, 3. Physicality & origin, 4. Interruptibility, 5. Performance, 6. Accessibility, 7. Cohesion & tokens, 8. Missed opportunities (+13 more)

### Community 17 - "Apple Design"
Cohesion: 0.10
Nodes (20): 10. Gesture design details (the "feel" checklist), 11. Frame-level smoothness, 12. Materials & depth — translucency conveys hierarchy, 13. Multimodal feedback — motion + sound + haptics, 14. Reduced motion & accessibility, 15. Typography — optical sizing, tracking, leading, 16. Design foundations — the eight principles, 17. Process (+12 more)

### Community 18 - "Workflow"
Cohesion: 0.10
Nodes (18): Behavior contract, Markup, Reference wiring, Rules, Styles, The Picker, Hard Rules, Invocation Variants (+10 more)

### Community 19 - "Лендинг B2C"
Cohesion: 0.18
Nodes (10): 1. Первый экран (Hero) — с интерактивом «Включить Базилик», 2. «Знакомо?» (боль), 3. Что ты получаешь (простые тейки), 4. Как это работает (3 шага), 5. Чем мы не как все, 6. Если у тебя есть цель (премиум-крючки), 7. Финальный экран, Лендинг B2C (+2 more)

### Community 20 - "Glossary"
Cohesion: 0.11
Nodes (17): Animation Vocabulary, Easing — how speed changes over an animation, Entrances & Exits — how elements appear and disappear, Examples, Feedback & Interaction — responding to the user's actions, Glossary, Instructions, Looping & Ambient Motion — animations that run on their own (+9 more)

### Community 21 - "app/page.tsx"
Cohesion: 0.16
Nodes (14): CtaSection(), FinalCopy, ExistingClientsSection(), FaqSection(), PainList(), PhoneStepsScene(), SectionDivider(), AUDIENCE_ROUTES (+6 more)

### Community 22 - "Finding Animation Opportunities"
Cohesion: 0.12
Nodes (15): 1. Frequency — how often will a user see this?, 2. Purpose — why does this animate?, 3. Speed — can it stay inside budget?, 4. Function — does motion help or hinder here?, Finding Animation Opportunities, Hard Rules, Operating Posture, Part 1 — Opportunities table (+7 more)

### Community 23 - "Лендинг B2C — визуал и анимации"
Cohesion: 0.15
Nodes (12): 0. Главная идея движения (motion-концепция), 10. Что отдать в производство (ассеты), 1. Фон и постоянные слои (живут всегда), 2. Раздел Hero — тумблер «Базилик выключен → Включить Базилик», 3. Раздел «Знакомо?» (боль) — единственный «нервный» блок, 4. Раздел «Как это работает» — ГЛАВНАЯ scroll-сцена «сборка блюда», 5. Раздел тейков — каждый со своей микроанимацией/инфографикой, 6. Раздел «Чем мы не как все» — сравнение «до / после» (+4 more)

### Community 24 - "Лендинг B2B2C"
Cohesion: 0.17
Nodes (11): 1. Первый экран (Hero), 2. Узнаёте?, 3. Win-win: удобно и вам, и клиенту, 4. Как это работает (3 шага), 5. Маркетплейс планов, 6. Дайте доступ тем, кто уже купил, 7. Встраивается в вашу работу, 8. Финальный экран (+3 more)

### Community 25 - "The list"
Cohesion: 0.20
Nodes (9): Charts, Common mismatches to catch, How to use this, Interaction & performance, Motion & visuals, Picking The Right Library, State & styling, The list (+1 more)

### Community 26 - "Reveal.tsx"
Cohesion: 0.15
Nodes (15): ComparisonSection(), Row, HIGHLIGHTS, MarketplaceSection(), Process(), Props, Step, SectionKicker() (+7 more)

### Community 27 - "PainChaos.tsx"
Cohesion: 0.17
Nodes (16): DinnerScene(), ExpiryScene(), ForgotScene(), PainChaos(), ReceiptScene(), SCENES, TILTS, CloneScene() (+8 more)

### Community 28 - "Design Engineering"
Cohesion: 0.22
Nodes (8): Accessibility, Design Engineering, Initial Response, prefers-reduced-motion, Review Checklist, Review Format (Required), Stagger Animations, Touch device hover states

### Community 29 - "Component Building Principles"
Cohesion: 0.25
Nodes (8): Animate enter states with @starting-style, Buttons must feel responsive, Component Building Principles, Make popovers origin-aware, Never animate from scale(0), Tooltips: skip delay on subsequent hovers, Use blur to mask imperfect transitions, Use CSS transitions over keyframes for interruptible UI

### Community 30 - "AudienceHero.tsx"
Cohesion: 0.22
Nodes (11): AudienceHero(), BasilikChain(), Props, BasilikToggleButton(), BasilikToggleContext, BasilikToggleProvider(), BasilikToggleValue, useBasilikToggle() (+3 more)

### Community 31 - "GoalsSection.tsx"
Cohesion: 0.15
Nodes (9): GoalsMode, GoalsSection(), MODES, RING_FILL, Chip(), Tone, tones, Counter() (+1 more)

### Community 32 - "The Animation Decision Framework"
Cohesion: 0.33
Nodes (6): 1. Should this animate at all?, 2. What is the purpose?, 3. What easing should it use?, 4. How fast should it be?, Perceived performance, The Animation Decision Framework

### Community 33 - "gsap.ts"
Cohesion: 0.31
Nodes (6): BackgroundFX(), BLOBS, clamp01(), remap(), WIDE_MOTION_QUERIES, WideMotionConditions

### Community 34 - "clip-path for Animation"
Cohesion: 0.33
Nodes (6): clip-path for Animation, Comparison sliders, Hold-to-delete pattern, Image reveals on scroll, Tabs with perfect color transitions, The inset shape

### Community 35 - "Performance Rules"
Cohesion: 0.33
Nodes (6): CSS animations beat JS under load, CSS variables are inheritable, Framer Motion hardware acceleration caveat, Only animate transform and opacity, Performance Rules, Use WAAPI for programmatic CSS animations

### Community 36 - "Gesture and Drag Interactions"
Cohesion: 0.33
Nodes (6): Damping at boundaries, Friction instead of hard stops, Gesture and Drag Interactions, Momentum-based dismissal, Multi-touch protection, Pointer capture for drag

### Community 37 - "CSS Transform Mastery"
Cohesion: 0.40
Nodes (5): 3D transforms for depth, CSS Transform Mastery, scale() scales children too, transform-origin, translateY with percentages

### Community 38 - "The Sonner Principles (Building Loved Components)"
Cohesion: 0.40
Nodes (5): Asymmetric enter/exit timing, Cohesion matters, Review your work the next day, The opacity + height combination, The Sonner Principles (Building Loved Components)

### Community 39 - "Spring Animations"
Cohesion: 0.40
Nodes (5): Interruptibility advantage, Spring Animations, Spring-based mouse interactions, Spring configuration, When to use springs

### Community 40 - "Core Philosophy"
Cohesion: 0.50
Nodes (4): Beauty is leverage, Core Philosophy, Taste is trained, not innate, Unseen details compound

### Community 41 - "Debugging Animations"
Cohesion: 0.50
Nodes (4): Debugging Animations, Frame-by-frame inspection, Slow motion testing, Test on real devices

## Knowledge Gaps
- **395 isolated node(s):** `metadata`, `viewport`, `metadata`, `size`, `ITEMS` (+390 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Design Engineering` connect `Design Engineering` to `The Animation Decision Framework`, `clip-path for Animation`, `Performance Rules`, `Gesture and Drag Interactions`, `CSS Transform Mastery`, `The Sonner Principles (Building Loved Components)`, `Spring Animations`, `Core Philosophy`, `Debugging Animations`, `Component Building Principles`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **Why does `MOTION_QUERIES` connect `AudienceHero.tsx` to `gsap.ts`, `PlanConfigurator.tsx`, `PhoneStepsScene.tsx`, `layout.tsx`, `site.ts`, `app/page.tsx`, `GoalsSection.tsx`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **Why does `Anti-Slop Frontend Design Skill (design-taste-frontend)` connect `Anti-Slop Frontend Design Skill (design-taste-frontend)` to `Three.js Fundamentals Skill`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Anti-Slop Frontend Design Skill (design-taste-frontend)` (e.g. with `GSAP Core Skill` and `GSAP Performance Skill`) actually correct?**
  _`Anti-Slop Frontend Design Skill (design-taste-frontend)` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `metadata`, `viewport`, `metadata` to the rest of the system?**
  _395 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `001 — Fix scale(0) entrance on engine icon marks` be split into smaller, more focused modules?**
  _Cohesion score 0.044444444444444446 - nodes in this community are weakly interconnected._
- **Should `Anti-Slop Frontend Design Skill (design-taste-frontend)` be split into smaller, more focused modules?**
  _Cohesion score 0.10099573257467995 - nodes in this community are weakly interconnected._