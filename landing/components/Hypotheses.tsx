import { HYPOTHESES } from "@/lib/content";
import { SectionKicker } from "./SectionKicker";
import { Reveal } from "./ui/Reveal";

export function Hypotheses() {
  return (
    <section id="open" className="py-16 md:py-28">
      <div className="mx-auto max-w-[1180px] px-6">
        <SectionKicker
          n="04"
          title="Что мы ещё проверяем"
          lead="Мы на стадии проверки гипотез и не собираемся делать вид, что всё уже доказано. Вот открытые вопросы — именно на них отвечают наши опросы."
        />

        <div className="mt-10 grid gap-3">
          {HYPOTHESES.map((h, i) => (
            <Reveal key={h.question} delay={i * 70}>
              <div className="rounded-r-xl border border-l-[3px] border-line border-l-amber bg-surface px-5 py-5 md:px-6">
                <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-amber">
                  {h.label}
                </div>
                <div className="text-[16.5px] font-bold tracking-tight">
                  {h.question}
                </div>
                <p className="mt-2 text-[14.5px] text-muted">{h.answer}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
