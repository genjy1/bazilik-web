# Graph Report - landing  (2026-08-03)

## Corpus Check
- 110 files · ~129,176 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 715 nodes · 1031 edges · 44 communities (39 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.58)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a3a8c141`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- UX Critique — `/home` (Bazilik) — re-run
- Anti-Slop Frontend Design Skill (design-taste-frontend)
- compilerOptions
- PlanConfigurator.tsx
- Hero.tsx
- devDependencies
- 001 — Fix scale(0) entrance on engine icon marks
- Three.js Fundamentals Skill
- UX Critique — `/home` (Bazilik) — confirm-fixes re-run
- gsap.ts
- layout.tsx
- EngineCards.tsx
- ThemeToggle.tsx
- BrandMark3D.tsx
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- Hero Background Image (Salad/Food Bar Spread)
- Animation Standards Reference
- Design System: Базилик (Bazilik)
- Animation Audit Playbook
- content.ts
- Apple Design
- Workflow
- Glossary
- Finding Animation Opportunities
- UX Critique — `/home` (Bazilik) — 4th run, confirming latest fixes
- Лендинг B2C — визуал и анимации
- Лендинг B2B2C
- Product
- Лендинг B2C
- The list
- Design Engineering
- 2026-07-27T20-24-02Z__app-page-tsx.md
- Component Building Principles
- The Animation Decision Framework
- clip-path for Animation
- Performance Rules
- Gesture and Drag Interactions
- CSS Transform Mastery
- The Sonner Principles (Building Loved Components)
- Spring Animations
- Core Philosophy
- Debugging Animations

## God Nodes (most connected - your core abstractions)
1. `Anti-Slop Frontend Design Skill (design-taste-frontend)` - 23 edges
2. `MOTION_QUERIES` - 20 edges
3. `Apple Design` - 20 edges
4. `Reveal()` - 17 edges
5. `compilerOptions` - 16 edges
6. `Design Engineering` - 16 edges
7. `Animation Standards Reference` - 16 edges
8. `SectionKicker()` - 14 edges
9. `Glossary` - 13 edges
10. `Лендинг B2C — визуал и анимации` - 12 edges

## Surprising Connections (you probably didn't know these)
- `HomePanel()` --calls--> `photoUrl()`  [EXTRACTED]
  components/panels/HomePanel.tsx → lib/images.ts
- `ProsPanel()` --calls--> `photoUrl()`  [EXTRACTED]
  components/panels/ProsPanel.tsx → lib/images.ts
- `BasilikChain()` --calls--> `useBasilikToggle()`  [EXTRACTED]
  components/BasilikChain.tsx → lib/basilikToggle.tsx
- `PlanConfigurator()` --calls--> `estimatePlan()`  [EXTRACTED]
  components/PlanConfigurator.tsx → lib/configurator.ts
- `Anti-Slop Frontend Design Skill (design-taste-frontend)` --references--> `Next.js Framework`  [EXTRACTED]
  .agents/skills/design-taste-frontend/SKILL.md → README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **GSAP Skill Family (core, frameworks, performance, plugins, react, scrolltrigger, timeline, utils)** — _agents_skills_gsap_core_skill_skill, _agents_skills_gsap_frameworks_skill_skill, _agents_skills_gsap_performance_skill_skill, _agents_skills_gsap_plugins_skill_skill, _agents_skills_gsap_react_skill_skill, _agents_skills_gsap_scrolltrigger_skill_skill, _agents_skills_gsap_timeline_skill_skill, _agents_skills_gsap_utils_skill_skill [EXTRACTED 1.00]
- **Three.js Skill Family (animation, fundamentals, geometry, interaction, lighting, loaders, materials)** — _agents_skills_threejs_animation_skill_skill, _agents_skills_threejs_fundamentals_skill_skill, _agents_skills_threejs_geometry_skill_skill, _agents_skills_threejs_interaction_skill_skill, _agents_skills_threejs_lighting_skill_skill, _agents_skills_threejs_loaders_skill_skill, _agents_skills_threejs_materials_skill_skill [EXTRACTED 1.00]
- **Project Root Documentation Set (AGENTS.md, CLAUDE.md, README.md)** — agents_doc, claude_doc, readme_doc [EXTRACTED 1.00]

## Communities (44 total, 5 thin omitted)

### Community 0 - "UX Critique — `/home` (Bazilik) — re-run"
Cohesion: 0.18
Nodes (10): Design Health Score, Design Specificity Verdict, Minor Observations, Overall Impression, Persona Red Flags, Priority Issues, Questions to Consider, UX Critique — `/home` (Bazilik) — re-run (+2 more)

### Community 1 - "Anti-Slop Frontend Design Skill (design-taste-frontend)"
Cohesion: 0.10
Nodes (38): Anti-Slop Frontend Design Skill (design-taste-frontend), GSAP Core Skill, GSAP Frameworks Skill (Vue/Svelte/Nuxt), GSAP Performance Skill, GSAP Plugins Skill, GSAP React Skill, GSAP ScrollTrigger Skill, GSAP Timeline Skill (+30 more)

### Community 2 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 3 - "PlanConfigurator.tsx"
Cohesion: 0.16
Nodes (15): PlanConfigurator(), BASE, Config, DEFAULT_CONFIG, Diet, DIETS, DISHES, estimatePlan() (+7 more)

### Community 4 - "Hero.tsx"
Cohesion: 0.09
Nodes (24): Hero(), JourneyBand(), NODES, PATH_D, playWhileVisible(), SHAPES, HomePanel(), week (+16 more)

### Community 5 - "devDependencies"
Cohesion: 0.05
Nodes (40): eslint, eslint-config-next, gsap, lucide-react, next, dependencies, gsap, lucide-react (+32 more)

### Community 6 - "001 — Fix scale(0) entrance on engine icon marks"
Cohesion: 0.04
Nodes (39): 001 — Fix scale(0) entrance on engine icon marks, Boundaries, Problem, Repo conventions to follow, Steps, Target, Verification, 002 — Gate smooth anchor scrolling behind prefers-reduced-motion (+31 more)

### Community 7 - "Three.js Fundamentals Skill"
Cohesion: 0.27
Nodes (16): Three.js Animation Skill, Three.js Fundamentals Skill, Three.js Geometry Skill, Three.js Interaction Skill, Three.js Lighting Skill, Three.js Loaders Skill, Three.js Materials Skill, Three.js AnimationMixer/AnimationClip/AnimationAction System (+8 more)

### Community 8 - "UX Critique — `/home` (Bazilik) — confirm-fixes re-run"
Cohesion: 0.22
Nodes (8): Confirmed: All Four Previous Fixes Hold, Design Health Score, Design Specificity Verdict, Detector Noise (re-confirmed false positives), New Findings From This Independent Pass, Persona Red Flags (new this run), Questions to Consider, UX Critique — `/home` (Bazilik) — confirm-fixes re-run

### Community 9 - "gsap.ts"
Cohesion: 0.06
Nodes (44): AmbientIngredients(), ITEMS, DishAssemblyScene(), Move, MOVES, SHOPPING, DinnerScene(), ExpiryScene() (+36 more)

### Community 10 - "layout.tsx"
Cohesion: 0.24
Nodes (8): metadata, mono, sans, viewport, HashScrollManager(), scrollToHash(), targetFromHash(), InlineScript()

### Community 11 - "EngineCards.tsx"
Cohesion: 0.21
Nodes (8): Engine(), EngineCards(), icons, BrandMark3D, BrandScene(), subscribe(), ENGINE, EngineIcon

### Community 12 - "ThemeToggle.tsx"
Cohesion: 0.47
Nodes (5): listeners, readTheme(), subscribe(), Theme, ThemeToggle()

### Community 18 - "Animation Standards Reference"
Cohesion: 0.07
Nodes (25): Aggressive Escalation Triggers, Guidelines, Operating Posture, Part 1 — Findings table (REQUIRED), Part 2 — Verdict (REQUIRED), Remedial Preference Hierarchy, Required Output Format, Reviewing Animations (+17 more)

### Community 19 - "Design System: Базилик (Bazilik)"
Cohesion: 0.08
Nodes (25): Buttons, Cards / Containers, Chips & Pills, Colors, Components, Design System: Базилик (Bazilik), Do:, Do's and Don'ts (+17 more)

### Community 20 - "Animation Audit Playbook"
Cohesion: 0.09
Nodes (21): 1. Purpose & frequency, 2. Easing & duration, 3. Physicality & origin, 4. Interruptibility, 5. Performance, 6. Accessibility, 7. Cohesion & tokens, 8. Missed opportunities (+13 more)

### Community 21 - "content.ts"
Cohesion: 0.05
Nodes (57): metadata, metadata, AudienceHero(), AudienceLinks(), CheckItem, BackgroundFX(), BLOBS, BasilikChain() (+49 more)

### Community 22 - "Apple Design"
Cohesion: 0.10
Nodes (20): 10. Gesture design details (the "feel" checklist), 11. Frame-level smoothness, 12. Materials & depth — translucency conveys hierarchy, 13. Multimodal feedback — motion + sound + haptics, 14. Reduced motion & accessibility, 15. Typography — optical sizing, tracking, leading, 16. Design foundations — the eight principles, 17. Process (+12 more)

### Community 23 - "Workflow"
Cohesion: 0.10
Nodes (18): Behavior contract, Markup, Reference wiring, Rules, Styles, The Picker, Hard Rules, Invocation Variants (+10 more)

### Community 24 - "Glossary"
Cohesion: 0.11
Nodes (17): Animation Vocabulary, Easing — how speed changes over an animation, Entrances & Exits — how elements appear and disappear, Examples, Feedback & Interaction — responding to the user's actions, Glossary, Instructions, Looping & Ambient Motion — animations that run on their own (+9 more)

### Community 25 - "Finding Animation Opportunities"
Cohesion: 0.12
Nodes (15): 1. Frequency — how often will a user see this?, 2. Purpose — why does this animate?, 3. Speed — can it stay inside budget?, 4. Function — does motion help or hinder here?, Finding Animation Opportunities, Hard Rules, Operating Posture, Part 1 — Opportunities table (+7 more)

### Community 26 - "UX Critique — `/home` (Bazilik) — 4th run, confirming latest fixes"
Cohesion: 0.40
Nodes (4): Confirmed: All Six Prior Fixes Hold (dual-verified), Design Health Score, New Findings (both narrower/more marginal than prior rounds), UX Critique — `/home` (Bazilik) — 4th run, confirming latest fixes

### Community 28 - "Лендинг B2C — визуал и анимации"
Cohesion: 0.15
Nodes (12): 0. Главная идея движения (motion-концепция), 10. Что отдать в производство (ассеты), 1. Фон и постоянные слои (живут всегда), 2. Раздел Hero — тумблер «Базилик выключен → Включить Базилик», 3. Раздел «Знакомо?» (боль) — единственный «нервный» блок, 4. Раздел «Как это работает» — ГЛАВНАЯ scroll-сцена «сборка блюда», 5. Раздел тейков — каждый со своей микроанимацией/инфографикой, 6. Раздел «Чем мы не как все» — сравнение «до / после» (+4 more)

### Community 29 - "Лендинг B2B2C"
Cohesion: 0.17
Nodes (11): 1. Первый экран (Hero), 2. Узнаёте?, 3. Win-win: удобно и вам, и клиенту, 4. Как это работает (3 шага), 5. Маркетплейс планов, 6. Дайте доступ тем, кто уже купил, 7. Встраивается в вашу работу, 8. Финальный экран (+3 more)

### Community 30 - "Product"
Cohesion: 0.17
Nodes (11): Accessibility & Inclusion, Brand Commitments, Capabilities and Constraints, Evidence on Hand, Operating Context, Platform, Positioning, Product (+3 more)

### Community 31 - "Лендинг B2C"
Cohesion: 0.18
Nodes (10): 1. Первый экран (Hero) — с интерактивом «Включить Базилик», 2. «Знакомо?» (боль), 3. Что ты получаешь (простые тейки), 4. Как это работает (3 шага), 5. Чем мы не как все, 6. Если у тебя есть цель (премиум-крючки), 7. Финальный экран, Лендинг B2C (+2 more)

### Community 32 - "The list"
Cohesion: 0.20
Nodes (9): Charts, Common mismatches to catch, How to use this, Interaction & performance, Motion & visuals, Picking The Right Library, State & styling, The list (+1 more)

### Community 34 - "Design Engineering"
Cohesion: 0.22
Nodes (8): Accessibility, Design Engineering, Initial Response, prefers-reduced-motion, Review Checklist, Review Format (Required), Stagger Animations, Touch device hover states

### Community 35 - "2026-07-27T20-24-02Z__app-page-tsx.md"
Cohesion: 0.22
Nodes (8): Design Health Score, Design Specificity Verdict, Minor Observations, Overall Impression, Persona Red Flags, Priority Issues, Questions to Consider, What's Working

### Community 36 - "Component Building Principles"
Cohesion: 0.25
Nodes (8): Animate enter states with @starting-style, Buttons must feel responsive, Component Building Principles, Make popovers origin-aware, Never animate from scale(0), Tooltips: skip delay on subsequent hovers, Use blur to mask imperfect transitions, Use CSS transitions over keyframes for interruptible UI

### Community 37 - "The Animation Decision Framework"
Cohesion: 0.33
Nodes (6): 1. Should this animate at all?, 2. What is the purpose?, 3. What easing should it use?, 4. How fast should it be?, Perceived performance, The Animation Decision Framework

### Community 38 - "clip-path for Animation"
Cohesion: 0.33
Nodes (6): clip-path for Animation, Comparison sliders, Hold-to-delete pattern, Image reveals on scroll, Tabs with perfect color transitions, The inset shape

### Community 39 - "Performance Rules"
Cohesion: 0.33
Nodes (6): CSS animations beat JS under load, CSS variables are inheritable, Framer Motion hardware acceleration caveat, Only animate transform and opacity, Performance Rules, Use WAAPI for programmatic CSS animations

### Community 40 - "Gesture and Drag Interactions"
Cohesion: 0.33
Nodes (6): Damping at boundaries, Friction instead of hard stops, Gesture and Drag Interactions, Momentum-based dismissal, Multi-touch protection, Pointer capture for drag

### Community 41 - "CSS Transform Mastery"
Cohesion: 0.40
Nodes (5): 3D transforms for depth, CSS Transform Mastery, scale() scales children too, transform-origin, translateY with percentages

### Community 42 - "The Sonner Principles (Building Loved Components)"
Cohesion: 0.40
Nodes (5): Asymmetric enter/exit timing, Cohesion matters, Review your work the next day, The opacity + height combination, The Sonner Principles (Building Loved Components)

### Community 43 - "Spring Animations"
Cohesion: 0.40
Nodes (5): Interruptibility advantage, Spring Animations, Spring-based mouse interactions, Spring configuration, When to use springs

### Community 44 - "Core Philosophy"
Cohesion: 0.50
Nodes (4): Beauty is leverage, Core Philosophy, Taste is trained, not innate, Unseen details compound

### Community 45 - "Debugging Animations"
Cohesion: 0.50
Nodes (4): Debugging Animations, Frame-by-frame inspection, Slow motion testing, Test on real devices

## Knowledge Gaps
- **401 isolated node(s):** `metadata`, `sans`, `mono`, `metadata`, `viewport` (+396 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `MOTION_QUERIES` connect `gsap.ts` to `PlanConfigurator.tsx`, `Hero.tsx`, `layout.tsx`, `EngineCards.tsx`, `content.ts`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Why does `Design Engineering` connect `Design Engineering` to `Component Building Principles`, `The Animation Decision Framework`, `clip-path for Animation`, `Performance Rules`, `Gesture and Drag Interactions`, `CSS Transform Mastery`, `The Sonner Principles (Building Loved Components)`, `Spring Animations`, `Core Philosophy`, `Debugging Animations`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **Why does `Anti-Slop Frontend Design Skill (design-taste-frontend)` connect `Anti-Slop Frontend Design Skill (design-taste-frontend)` to `Three.js Fundamentals Skill`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Anti-Slop Frontend Design Skill (design-taste-frontend)` (e.g. with `GSAP Core Skill` and `GSAP Performance Skill`) actually correct?**
  _`Anti-Slop Frontend Design Skill (design-taste-frontend)` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `metadata`, `sans`, `mono` to the rest of the system?**
  _401 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Anti-Slop Frontend Design Skill (design-taste-frontend)` be split into smaller, more focused modules?**
  _Cohesion score 0.10099573257467995 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._