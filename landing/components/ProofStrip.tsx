import { STATS } from "@/lib/content";
import { Counter } from "./ui/Counter";
import { Reveal } from "./ui/Reveal";

export function ProofStrip() {
  return (
    <section className="border-y border-line bg-surface py-9">
      <div className="mx-auto grid max-w-[1180px] grid-cols-2 gap-6 px-6 md:grid-cols-4">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 80}>
            <div className="text-[clamp(28px,4vw,42px)] leading-none font-extrabold tracking-[-0.045em] text-accent-deep">
              <Counter
                value={s.value}
                prefix={"prefix" in s ? s.prefix : ""}
                suffix={"suffix" in s ? s.suffix : ""}
              />
            </div>
            <div className="mt-2.5 font-mono text-[10.5px] uppercase tracking-[0.13em] text-muted">
              {s.label}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
