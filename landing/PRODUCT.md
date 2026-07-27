# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two co-equal audiences, each with its own page, neither subordinate to the other:

- **Specialists (b2b2c):** nutritionists, dietitians, and fitness coaches who currently build meal plans by hand in Word/Excel/PDF and want a plan constructor plus a way to sell finished plans more than once.
- **Home users (b2c):** whoever is responsible for feeding a household, receiving a plan (usually from their specialist, via the marketplace) and following it day to day — deciding what's for dinner, shopping, and cooking without re-planning from scratch.

## Product Purpose

Bazilik (Базилик) plans a week of meals without requiring manual pantry/inventory tracking. It assumes ingredients bought for the plan are still on hand, designs recipes around ingredient reuse across the week, and re-plans around whatever is actually left when a meal is skipped or a recipe swapped. For specialists, it replaces manual plan authoring with a constructor (recipes, auto-calculated macros, shopping lists) and a marketplace to resell a plan built once. For home users, a purchased plan lands in a calendar and unfolds into step-by-step cooking, a shopping list, and honest prep-time estimates.

Success (product-level, not yet measured): less food waste, fewer shopping trips, and specialists spending less time on manual plan admin.

## Positioning

The core bet a neighboring meal-planning product could not truthfully copy without adopting the same trade-off: Bazilik deliberately accepts a *probabilistic* pantry state (assume what was bought for the plan is still there, tolerate drift) instead of demanding full manual inventory logging. The product's stated position is that ~90% useful accuracy with zero manual entry beats 100% accuracy that requires daily upkeep — and it treats this as an explicit, unproven bet rather than a settled fact.

## Operating Context

- Specialists build plans in a constructor: recipes (own or public), day/meal-slot distribution, auto-computed macros (KБЖУ), then publish to a marketplace (public, private, or client-specific access) or hand a plan to one client directly.
- Home users start a purchased/assigned plan from a chosen calendar date; the week unfolds into breakfast/snack/lunch/snack/dinner slots plus a marked shopping day. Day-to-day use is: open the current meal, cook it step-by-step (photo + step + progress, phone stays on the counter), and let substitutions ("didn't find it in the store," allergy, dislike) trigger an automatic re-plan rather than a manual redo.
- The shopping list is generated from the whole week at once, accounting for ingredient reuse, aiming for one shopping trip instead of several.
- The actual product is a mobile app (iOS · Android, per the hero pills); this Next.js project is the marketing/landing surface only, not the app itself.

## Capabilities and Constraints

- Confirmed: recipe authoring with auto macro (KБЖУ) calculation; week-level plan assembly designed for ingredient reuse; marketplace resale of a single authored plan; automatic re-plan on skipped meals or ingredient substitution; adherence tracking (what's actually cooked/skipped/eaten/thrown away) intended to feed future recommendations.
- Undecided/open (tracked explicitly in-product as hypotheses, not resolved): whether users will actually accept probabilistic/assumed pantry state over manual tracking; what specialists and households will actually pay (vs. what they say they'd pay); whether "decision fatigue" is a valid framing at all — the product's own copy notes reviewed literature doesn't clearly support decision-fatigue-about-food as a real, measurable phenomenon, so the team deliberately avoids leaning on it and instead measures time, extra trips, waste, and cost.
- The CTA's interactive configurator is explicitly labeled a simplified demo, not the real calculation engine — do not treat its numbers as product truth.

## Brand Commitments

- Product name: **Базилик** (Bazilik / "Basil").
- Voice, per the project's internal brand book (`brand-book-v50`, referenced in code comments but not present in this repo): say "week / reuse / leftovers / measurable / we're testing"; avoid "revolution," "smart nutrition," and treating "decision fatigue" as an established fact.
- Language: Russian throughout, for a Russian-speaking market.

## Evidence on Hand

- No customer testimonials, logos, press, or case studies exist in this project; none should be fabricated.
- The stat strip (5–15% food typically wasted, 90% usefulness without full manual input, 8 steps in the old chain collapsed to 2) are framed in-product as hypotheses/claims under test, not verified results — future work must preserve that framing rather than presenting them as proven.
- No live app, paying customers, or marketplace transactions exist yet (see Capabilities and Constraints / product stage below).

## Product Principles

1. Prefer honest, hedged claims over confident marketing — the product's own copy explicitly avoids overstating unproven mechanisms (e.g., decision fatigue) and labels demo numbers as demo numbers.
2. Treat ingredient reuse and probabilistic pantry state as the product's one real point of differentiation; every surface should reinforce this rather than genericize into "smart meal planning."
3. Serve specialists and home users as two equal, separate journeys rather than collapsing them into one generic audience.
4. Optimize for measurable outcomes (time, trips, waste, cost, adherence) over emotional/aspirational claims.
5. This is a pre-launch, validating-stage product: design and copy should support hypothesis-testing and signal collection, not imply a mature, proven product.

## Accessibility & Inclusion

No product-specific accessibility requirement has been established beyond standard web accessibility practice.
