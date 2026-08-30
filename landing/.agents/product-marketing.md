# Product Marketing Context

**Document version:** v1
**Last updated:** 2026-08-27

> **Provenance.** Drafted from the repository — `landing/PRODUCT.md`, `landing/lib/content.ts`, page metadata — not from customer interviews or sales calls. Two markers appear throughout:
> **[UNVERIFIED]** = inferred from code and marketing copy; plausible, but never tested against a real customer.
> **[GAP]** = could not be determined from the repo; needs a human answer before any skill leans on it.
> Section headings are English so the marketing skills parse the structure; product and customer language is kept verbatim in Russian, because that is the market and the language downstream copy must be generated in.

## Product Overview

**One-liner:** Базилик планирует неделю питания без ручного учёта запасов.

**What it does:** Bazilik assembles a week of meals designed around ingredient reuse, generates one shopping list from the whole week at once, and re-plans around what is actually left when a meal is skipped or an ingredient can't be found. It deliberately assumes that whatever was bought for the plan is still in the kitchen rather than asking anyone to log inventory. Specialists author plans in a constructor with auto-calculated КБЖУ and resell them through a marketplace; home users receive a plan into a calendar and cook it step by step with photos and timers.

**Product category:** Two shelves, because there are two audiences.
- b2c: meal planning / weekly menu app — *планировщик питания, меню на неделю, что приготовить на неделю*
- b2b2c: plan constructor + marketplace for practitioners — *конструктор планов питания для нутрициолога, программа для диетолога*

**Product type:** Mobile app (iOS · Android) with a two-sided marketplace. **This repo is the marketing landing surface only** (Next.js), not the product.

**Business model:** Marketplace commission on plan sales. Verbatim from the specialists page: «Комиссия — только с продажи. Ни абонплаты, ни платы „за вход".»
**[GAP]** No b2c pricing exists anywhere in the repo — whether home users pay per plan, subscribe, or use it free is either undecided or unwritten. Do not let any skill invent a price.

**Stage:** Pre-launch, validating. No live app, no paying customers, no marketplace transactions. The MVP ships *without* the Specialists section — see the `NAV_LINKS_HOME` comment in `landing/lib/content.ts`; `/specialists` exists as a page but is unlinked from the home CTA.

## Target Audience

Two co-equal audiences, each with its own page. Neither is subordinate to the other, and they should not be collapsed into one generic "people who eat."

**Target companies:** Not applicable in the usual B2B sense. The specialist side is individual practitioners and solo practices, not companies — there is no firmographic targeting in the repo. **[UNVERIFIED]**

**Decision-makers:**
- **Specialists (b2b2c):** нутрициологи, диетологи, фитнес-коучи. Self-employed, already selling plans to clients, currently authoring in Word/Excel/PDF. They are both the buyer and the user.
- **Home users (b2c):** «Тем, кто отвечает за еду дома» — whoever carries the household's food decisions. Usually arrives holding a plan a specialist gave or sold them.

**Primary use case:**
- Specialist: stop rebuilding near-identical plans by hand, and make one authored plan earn more than once.
- Home user: stop re-deciding dinner every evening and stop throwing out food that was bought and forgotten.

**Jobs to be done:**
- (specialist) "Give me back the hour I lose per plan in Word — and let a plan I built once sell again."
- (specialist) "Keep clients actually following the plan, because a client who follows it stays with me longer."
- (home) "Tell me what to cook tonight out of what I already bought, without making me track anything."
- (home) "Turn the week into one shopping trip and no wilted greens."

**Use cases:**
- Specialist builds a plan for one client: dishes, goal, portion size; КБЖУ computed automatically; dishes reused from previous plans.
- Specialist packages a repeatable plan («Похудение на 4 недели», «Набор массы») and lists it on the marketplace for many buyers.
- Specialist migrates an existing client base off PDF into the app — a reason to re-contact past buyers.
- Home user starts a purchased plan from a chosen date; the week unfolds into breakfast/snack/lunch/snack/dinner plus a marked shopping day.
- Home user hits a wall mid-week — skipped a meal, couldn't find an ingredient, allergy, «надоело это блюдо» — and the plan re-assembles instead of collapsing.

## Personas

Marked **[UNVERIFIED]** throughout — these are constructed from copy, not from interviews.

| Persona | Cares about | Challenge | Value we promise |
|---------|-------------|-----------|------------------|
| Specialist (user + buyer) | Time per plan; a steadier client flow; keeping their own brand visible | An hour in Word per plan; clients drift after a PDF; new clients only via word-of-mouth | Minutes instead of an hour; marketplace brings leads; plans carry their name and logo |
| Their client (end user, doesn't buy the tool) | Not losing the plan; not decoding grams | PDF lost in the chat by Wednesday | Plan lives in the phone, list builds itself, cooking is step-by-step |
| Home user (b2c buyer) | Not re-deciding dinner; not wasting food or money | The same eight-step chain every single day | Only «приготовить → съесть» is left to them |

There is no separate financial buyer or technical influencer — the specialist decides and pays alone.

## Problems & Pain Points

**Core problem:** Feeding people on a plan requires a long chain of decisions, and every existing tool either demands that chain be logged by hand or ignores it entirely. The landing names the chain explicitly, eight steps long: решить → проверить наличие → проверить сроки → составить список → купить → принести → приготовить → съесть.

**Why alternatives fall short:**
- Pantry and meal apps require manual inventory entry — «Другие приложения заставляют вносить каждую пачку и банку вручную.» People abandon the logging within days, and the app's value collapses with it.
- Recipe apps serve isolated dishes — «Обычное приложение выдаёт разрозненные блюда: под каждое — свой набор продуктов, половина остаётся.»
- Nothing adapts when life interferes: a skipped dinner or a missing ingredient means starting over by hand.
- For specialists: Word, Excel and PDF have no macro calculation, no reuse between plans, and no way to sell the same plan twice.

**What it costs them:**
- Specialists: roughly an hour per plan **[UNVERIFIED — «час в Word» is the product's own estimate, not measured]**, plus evenings spent re-cutting plans on request for free.
- Home users: 5–15% of food wasted, repeat shopping trips, impulse buys on an empty stomach.
- Every quantitative claim on the site is framed as a hypothesis under test. Preserve that framing.

**Emotional tension:** Low-grade daily attrition rather than acute pain — the nightly «что сегодня на ужин?», the guilt of binned greens, the specialist's evening lost redoing a plan. **Deliberate constraint:** the product refuses to frame this as "decision fatigue." Its own copy notes that the reviewed literature does not clearly support decision-fatigue-about-food as a real, measurable phenomenon, so the team measures time, extra trips, waste and cost instead. Do not reintroduce the framing.

## Competitive Landscape

**[GAP] — the largest hole in this document.** The repo describes competitors only functionally and never names one. `PRODUCT.md` refers to "a neighbouring meal-planning product" without identifying it. Name the actual Russian-market competitors before running competitor, positioning, or comparison-page work.

**Direct:** Meal-planning and pantry apps requiring manual inventory logging — falls short because the logging is the thing users quit, so accuracy decays to zero in practice.
**Secondary:** Recipe and menu apps serving standalone dishes — falls short because each dish carries its own ingredient set, so leftovers accumulate instead of being designed away.
**Indirect (b2c):** Deciding ad hoc, day by day, with no tool at all — falls short quietly; it is free, familiar, and the default.
**Indirect (b2b2c):** Word, Excel and PDF — falls short because there is no macro calculation, no reuse, no resale, and no visibility into whether the client ever cooked anything.

## Differentiation

**Key differentiators:**
- **Probabilistic pantry state.** No manual entry at all. Assume what was bought for the plan is still there and tolerate drift.
- **Week-level design for ingredient reuse.** The week is planned as one object, not a bag of recipes — «Один пучок зелени закрывает три блюда».
- **Re-planning against leftovers.** Skipped meals and substitutions trigger a re-plan rather than a manual redo.
- **Behavioural layer.** What is actually cooked, skipped, finished or binned; adherence across the week feeds future recommendations.
- **Resale of a single authored plan**, commission only on sale — this changes the specialist's economics, not just their workflow.

**How we do it differently:** Every competitor buys accuracy with user labour. Bazilik refuses that trade and accepts approximation instead.

**Why that's better:** ~90% useful accuracy at zero manual entry beats 100% accuracy that requires daily upkeep — because the upkeep gets abandoned, and 100% accuracy nobody maintains is worth nothing.

**Why customers choose us:** **[UNVERIFIED]** — no customers exist yet. This is the central bet of the product, tracked in-product as an explicitly unproven hypothesis. Treat it as a position to argue, never as evidence.

## Objections

**[UNVERIFIED]** — constructed from the product's own stated open questions, not heard in sales.

| Objection | Response |
|-----------|----------|
| «Откуда приложение знает, что у меня есть, если я ничего не вносил?» | It assumes what was bought for the plan. When it's wrong, say so and the plan re-assembles. 90% useful with zero input beats 100% you have to maintain. |
| «Ещё одно приложение, которое я заброшу через неделю.» | The thing people abandon is the logging. There is no logging to abandon. |
| «Маркетплейс уведёт моих клиентов.» (specialist) | Plans ship under your name and logo. Commission only on a sale, no entry fee — and access-for-existing-clients is a separate channel from the marketplace. |
| «Мои планы индивидуальны, их нельзя продавать многим.» (specialist) | Both modes exist — bespoke per client, or a packaged plan sold repeatedly. The constructor doesn't force either. |

**Anti-persona:**
- People who want gram-exact tracking and enjoy logging it — the core trade-off is aimed squarely against them.
- People who cook ad hoc by preference and don't want a week decided in advance.
- Clinical or medical nutrition requiring verified therapeutic accuracy — the site shows diet tags (Диабет, Без глютена) but makes no medical claim, and neither should any generated copy. **[UNVERIFIED]**

## Switching Dynamics

**[UNVERIFIED]** — no interviews behind these.

**Push:** The nightly dinner question; wilted greens; a mid-week shopping trip that shouldn't have been necessary; for specialists, an evening lost re-cutting a plan for free.
**Pull:** A week that assembles itself; a shopping list that builds itself; for specialists, minutes instead of an hour and a plan that can sell twice.
**Habit:** Deciding day by day is free and familiar. Word and PDF are known quantities the specialist already controls.
**Anxiety:** "It'll be wrong about my kitchen." "I'll abandon it like the last one." "The marketplace will take my clients." "My family won't eat what it picks."

## Customer Language

**Important caveat:** the lines below are the product's *own marketing copy*, written in a customer voice. They are not verbatim customer speech. Replace them with real quotes as soon as any exist — that is what makes this section worth anything.

**How they describe the problem:**
- «„Что сегодня на ужин?" — и так каждый вечер.»
- «Закупаешься на неделю — а к среде опять чего-то не хватает.»
- «Половина зелени вянет в холодильнике.»
- «Список покупок пишешь на бумажке, дома выясняется, что забыл.»
- (specialist) «Каждому клиенту собираете план заново — хотя блюда во многом повторяются.»
- (specialist) «Отдали план в PDF — клиент теряет его к среде и перестаёт готовить.»
- (specialist) «Новых клиентов ищете сами: сарафан да соцсети, стабильного потока нет.»

**How they describe us:** **[GAP]** — nobody has described this product back to us yet.

**Words to use:** неделя · переиспользование · остатки · измеримо · проверяем · план · список покупок · КБЖУ · пошагово

**Words to avoid:** революция · умное питание · «усталость решений» as established fact · any claim that demo numbers are real calculations · fabricated testimonials, logos or press

**Address form — do not mix:**
- b2c / home (`/`): **ты** — «Готовь то, что уже есть», «Каждый день ты проходишь…»
- b2b2c / specialists (`/specialists`): **вы** — «Составляйте планы, продавайте их и ведите клиентов…»

**Glossary:**
| Term | Meaning |
|------|---------|
| КБЖУ | Calories, protein, fat, carbs. Auto-computed per dish and per plan. |
| План | A week of meals distributed across days and meal slots — the unit that is authored, sold and followed. |
| Переиспользование | Designing the week so one ingredient works across several dishes. The core mechanic. |
| Вероятностное состояние | Probabilistic pantry state — assume what was bought is still there, tolerate drift, never ask the user to log. |
| Остатки | What is actually left; what the plan re-assembles around. |
| Маркетплейс | Where specialists list plans and buyers find them in-app. Commission on sale only. |
| Adherence | Whether the plan was actually cooked, skipped, finished or binned. Feeds recommendations. |
| Приём пищи | Meal slot: завтрак / перекус / обед / перекус / ужин. |

## Brand Voice

**Tone:** Plain, measured, quietly confident. Hedged where the evidence is thin, and openly so — the product would rather say «проверяем» than overclaim.

**Style:** Direct and concrete. Short sentences. Numbers with their caveats attached. Second person, per-audience (see address form above). Russian throughout.

**Personality:** honest · specific · unhurried · practical · self-aware

The governing rule, from the internal brand book (`brand-book-v50`, referenced in code comments but not present in this repo): prefer an honest hedge over a confident marketing claim. A generated line that would be stronger if it were less true is the wrong line.

## Proof Points

**Metrics** — all four are stated on-site as hypotheses under test, never as results. Any copy citing them must carry that framing:
- 5–15% of food typically wasted
- ~90% usefulness without 100% manual input
- 8 steps in the old chain → 2 that remain («приготовь → съешь»)
- «Час в Word на один план → минуты в приложении» **[UNVERIFIED — the product's own estimate]**

**Customers:** None. No logos, no press, no case studies exist. **Do not fabricate any.**

**Testimonials:** None exist. **Do not fabricate any.** This is an explicit constraint in `PRODUCT.md`, not a stylistic preference.

**Value themes:**
| Theme | Proof |
|-------|-------|
| Zero manual entry | Product design — no inventory logging exists anywhere in the flow |
| Less waste through reuse | Week-level planning mechanic; the 5–15% waste figure as framing, not as result |
| One shopping trip | List generated from the whole week at once, accounting for reuse |
| Survives real life | Automatic re-plan on skip, substitution or allergy |
| A plan becomes a product | Marketplace resale, commission on sale only, specialist's own branding |

**Honesty constraints that override normal marketing instinct:**
- The CTA configurator is a labelled demo — «Демо-расчёт по упрощённой модели.» Never present its numbers as product output.
- The goals section carries the same disclaimer. Keep it.
- The central probabilistic-pantry bet is unproven, and is stated as unproven on the site.

## Goals

**Business goal:** Validate the core bet before launch — will people accept an assumed pantry state instead of manual tracking, and what will specialists and households actually pay (as opposed to what they say they would pay). This is a signal-collection stage, not a growth stage.

**Conversion action:** **There is currently none, by design.** The site captures no contacts: «Без сбора контактов — блок заявок появится, когда откроем пилот.» There is no signup, no waitlist, no app-store link. The only engagement actions available are the «Включить Базилик» toggle in the hero and the demo plan configurator in the CTA block. Any skill proposing conversion work should treat "add the pilot capture block" as a live open decision, not as a fix to an oversight.

**Current metrics:** None published. Yandex.Metrika is installed (webvisor, clickmap, trackLinks, ecommerce dataLayer) in `landing/components/YandexMetrika.tsx`, so behavioural data may exist. **[GAP]** No traffic, ranking or engagement figures are in the repo.

## Changelog
*Newest first. One line per revision: what changed and why.*
- v1 (2026-08-27) — Initial context, auto-drafted from the repo (`PRODUCT.md`, `lib/content.ts`, page metadata) for the newly installed SEO/GEO skills. Competitors, b2c pricing and all customer-verbatim language are open gaps.
