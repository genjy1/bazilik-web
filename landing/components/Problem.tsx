import { CHAIN_AFTER, CHAIN_BEFORE } from "@/lib/content";
import { ChainFunnel } from "./ChainFunnel";
import { SectionKicker } from "./SectionKicker";
import { Reveal } from "./ui/Reveal";

function Chain({
  label,
  steps,
  after = false,
}: {
  label: string;
  steps: readonly string[];
  after?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 md:px-6 ${
        after ? "border-accent/30 bg-accent/8" : "border-line bg-surface"
      }`}
    >
      <div
        className={`mb-3 font-mono text-[10px] uppercase tracking-[0.16em] ${
          after ? "text-accent-deep" : "text-muted"
        }`}
      >
        {label}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {steps.map((s, i) => (
          <span key={s} className="flex items-center gap-2">
            <span
              className={`rounded-full border font-bold tracking-tight ${
                after
                  ? "border-transparent bg-accent px-5 py-2.5 text-base text-on-accent"
                  : "border-line bg-ground px-3.5 py-2 text-sm text-muted"
              }`}
            >
              {s}
            </span>
            {i < steps.length - 1 && (
              <span
                aria-hidden="true"
                className={`font-extrabold ${after ? "text-accent" : "text-line"}`}
              >
                →
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Problem() {
  return (
    <section id="how" className="py-16 md:py-28">
      <div className="mx-auto max-w-[1180px] px-6">
        <SectionKicker
          n="01"
          title={
            <>
              Восемь решений в день
              <br />
              ради одного ужина
            </>
          }
          lead="Каждый день повторяется одна и та же цепочка. Недельный план сжимает её до двух шагов — и это не про «усталость от решений», а про измеримые вещи: время, лишние походы в магазин, выброшенные продукты."
        />

        <div className="mt-10">
          <Reveal delay={120}>
            <Chain label="Сейчас · каждый день" steps={CHAIN_BEFORE} />
          </Reveal>

          {/* Восемь линий сходятся к двум — схлопывание цепочки показано
              графически, а не только текстом. */}
          <ChainFunnel />

          <Reveal delay={80}>
            <Chain
              label="С Базиликом · неделя спланирована один раз"
              steps={CHAIN_AFTER}
              after
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
