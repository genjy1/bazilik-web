# Graph Report - .  (2026-07-27)

## Corpus Check
- 66 files · ~76,929 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 294 nodes · 504 edges · 18 communities (13 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.69)
- Token cost: 269,401 input · 0 output

## Community Hubs (Navigation)
- Landing Page Content & Layout
- Design & GSAP Skill Docs
- TypeScript Configuration
- Plan Configurator Engine
- Hero & Motion UI Components
- Core Package Dependencies
- Dev Tooling & Type Dependencies
- Three.js Skills & Concepts
- Plan Panels & Dish Images
- Recipe Assembly Animation
- Root Layout & Scroll Management
- Engine Section & 3D Brand Scene
- Theme Toggle
- 3D Brand Mark
- ESLint Config File
- Next.js Config File
- PostCSS Config File
- Hero Background Image

## God Nodes (most connected - your core abstractions)
1. `Anti-Slop Frontend Design Skill (design-taste-frontend)` - 23 edges
2. `compilerOptions` - 16 edges
3. `GSAP Core Skill` - 12 edges
4. `MOTION_QUERIES` - 11 edges
5. `Reveal()` - 9 edges
6. `GSAP Frameworks Skill (Vue/Svelte/Nuxt)` - 9 edges
7. `GSAP Plugins Skill` - 9 edges
8. `GSAP React Skill` - 9 edges
9. `GSAP ScrollTrigger Skill` - 9 edges
10. `GSAP Animation Library` - 9 edges

## Surprising Connections (you probably didn't know these)
- `PlanConfigurator()` --calls--> `estimatePlan()`  [EXTRACTED]
  components/PlanConfigurator.tsx → lib/configurator.ts
- `HomePanel()` --calls--> `photoUrl()`  [EXTRACTED]
  components/panels/HomePanel.tsx → lib/images.ts
- `ProsPanel()` --calls--> `photoUrl()`  [EXTRACTED]
  components/panels/ProsPanel.tsx → lib/images.ts
- `Anti-Slop Frontend Design Skill (design-taste-frontend)` --references--> `Next.js Framework`  [EXTRACTED]
  .agents/skills/design-taste-frontend/SKILL.md → README.md
- `GSAP Core Skill` --semantically_similar_to--> `Anti-Slop Frontend Design Skill (design-taste-frontend)`  [INFERRED] [semantically similar]
  .agents/skills/gsap-core/SKILL.md → .agents/skills/design-taste-frontend/SKILL.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **GSAP Skill Family (core, frameworks, performance, plugins, react, scrolltrigger, timeline, utils)** — _agents_skills_gsap_core_skill_skill, _agents_skills_gsap_frameworks_skill_skill, _agents_skills_gsap_performance_skill_skill, _agents_skills_gsap_plugins_skill_skill, _agents_skills_gsap_react_skill_skill, _agents_skills_gsap_scrolltrigger_skill_skill, _agents_skills_gsap_timeline_skill_skill, _agents_skills_gsap_utils_skill_skill [EXTRACTED 1.00]
- **Three.js Skill Family (animation, fundamentals, geometry, interaction, lighting, loaders, materials)** — _agents_skills_threejs_animation_skill_skill, _agents_skills_threejs_fundamentals_skill_skill, _agents_skills_threejs_geometry_skill_skill, _agents_skills_threejs_interaction_skill_skill, _agents_skills_threejs_lighting_skill_skill, _agents_skills_threejs_loaders_skill_skill, _agents_skills_threejs_materials_skill_skill [EXTRACTED 1.00]
- **Project Root Documentation Set (AGENTS.md, CLAUDE.md, README.md)** — agents_doc, claude_doc, readme_doc [EXTRACTED 1.00]

## Communities (18 total, 5 thin omitted)

### Community 0 - "Landing Page Content & Layout"
Cohesion: 0.09
Nodes (36): metadata, metadata, AudienceLinks(), AudienceSection(), CheckItem, BackgroundFX(), BLOBS, BrandMark() (+28 more)

### Community 1 - "Design & GSAP Skill Docs"
Cohesion: 0.10
Nodes (38): Anti-Slop Frontend Design Skill (design-taste-frontend), GSAP Core Skill, GSAP Frameworks Skill (Vue/Svelte/Nuxt), GSAP Performance Skill, GSAP Plugins Skill, GSAP React Skill, GSAP ScrollTrigger Skill, GSAP Timeline Skill (+30 more)

### Community 2 - "TypeScript Configuration"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 3 - "Plan Configurator Engine"
Cohesion: 0.13
Nodes (17): PlanConfigurator(), AnimatedNumber(), Props, BASE, Config, DEFAULT_CONFIG, Diet, DIETS (+9 more)

### Community 4 - "Hero & Motion UI Components"
Cohesion: 0.14
Nodes (15): Hero(), JourneyBand(), NODES, PATH_D, playWhileVisible(), SHAPES, Button(), styles (+7 more)

### Community 5 - "Core Package Dependencies"
Cohesion: 0.09
Nodes (21): gsap, lucide-react, next, dependencies, gsap, lucide-react, next, react (+13 more)

### Community 6 - "Dev Tooling & Type Dependencies"
Cohesion: 0.11
Nodes (19): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+11 more)

### Community 7 - "Three.js Skills & Concepts"
Cohesion: 0.27
Nodes (16): Three.js Animation Skill, Three.js Fundamentals Skill, Three.js Geometry Skill, Three.js Interaction Skill, Three.js Lighting Skill, Three.js Loaders Skill, Three.js Materials Skill, Three.js AnimationMixer/AnimationClip/AnimationAction System (+8 more)

### Community 8 - "Plan Panels & Dish Images"
Cohesion: 0.20
Nodes (12): HomePanel(), week, plans, ProsPanel(), Chip(), Pill(), Tone, tones (+4 more)

### Community 9 - "Recipe Assembly Animation"
Cohesion: 0.18
Nodes (10): clamp01(), lerp(), lerp3(), MACRO_DOT, Move, MOVES, RecipeAssembly(), remap() (+2 more)

### Community 10 - "Root Layout & Scroll Management"
Cohesion: 0.24
Nodes (8): metadata, mono, sans, viewport, HashScrollManager(), scrollToHash(), targetFromHash(), InlineScript()

### Community 11 - "Engine Section & 3D Brand Scene"
Cohesion: 0.21
Nodes (8): Engine(), EngineCards(), icons, BrandMark3D, BrandScene(), subscribe(), ENGINE, EngineIcon

### Community 12 - "Theme Toggle"
Cohesion: 0.47
Nodes (5): listeners, readTheme(), subscribe(), Theme, ThemeToggle()

## Knowledge Gaps
- **108 isolated node(s):** `metadata`, `sans`, `mono`, `metadata`, `viewport` (+103 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Anti-Slop Frontend Design Skill (design-taste-frontend)` connect `Design & GSAP Skill Docs` to `Three.js Skills & Concepts`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Why does `MOTION_QUERIES` connect `Hero & Motion UI Components` to `Landing Page Content & Layout`, `Plan Configurator Engine`, `Engine Section & 3D Brand Scene`, `Recipe Assembly Animation`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Why does `Three.js 3D Library` connect `Three.js Skills & Concepts` to `Design & GSAP Skill Docs`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Anti-Slop Frontend Design Skill (design-taste-frontend)` (e.g. with `GSAP Core Skill` and `GSAP Performance Skill`) actually correct?**
  _`Anti-Slop Frontend Design Skill (design-taste-frontend)` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `metadata`, `sans`, `mono` to the rest of the system?**
  _108 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Landing Page Content & Layout` be split into smaller, more focused modules?**
  _Cohesion score 0.08831168831168831 - nodes in this community are weakly interconnected._
- **Should `Design & GSAP Skill Docs` be split into smaller, more focused modules?**
  _Cohesion score 0.10099573257467995 - nodes in this community are weakly interconnected._