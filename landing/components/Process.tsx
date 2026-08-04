import type { ReactNode } from "react";
import { PROCESS } from "@/lib/content";
import { SectionKicker } from "./SectionKicker";
import { Reveal } from "./ui/Reveal";

type Step = { n: string; title: string; body: string };

type Props = {
  kickerN?: string;
  title?: ReactNode;
  lead?: string;
  steps?: readonly Step[];
};

/**
 * Пронумерованные шаги «как это работает». По умолчанию — процесс корневой
 * страницы; аудиторные страницы (/specialists) передают свой заголовок и
 * свой набор из 3 шагов через пропсы.
 */
export function Process({
  kickerN = "03",
  title = "Полный цикл — от рецепта до тарелки",
  lead = "Специалист создаёт, пользователь живёт. Между ними нет ни одного PDF.",
  steps = PROCESS,
}: Props) {
  return (
    <section className="py-16 md:py-28">
      <div className="mx-auto max-w-[1180px] px-6">
        <SectionKicker n={kickerN} title={title} lead={lead} />

        <ol className="mt-12">
          {steps.map((step, i) => (
            <Reveal key={step.n} delay={i * 70} as="li">
              <div className="grid grid-cols-[56px_1fr] items-start gap-4 border-t border-line py-7 transition-colors duration-300 hover:bg-accent/5 md:grid-cols-[88px_1fr_1fr] md:gap-6">
                <span className="pt-1.5 font-mono text-[13px] font-bold tracking-[0.14em] text-accent">
                  {step.n}
                </span>
                <h3 className="text-[clamp(20px,2.6vw,27px)]">{step.title}</h3>
                <p className="col-start-2 text-[15.5px] text-muted md:col-start-3">
                  {step.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
        <div className="border-t border-line" />
      </div>
    </section>
  );
}
