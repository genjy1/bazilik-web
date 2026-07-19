import { CTA } from "@/lib/content";
import { PlanConfigurator } from "./PlanConfigurator";
import { Button } from "./ui/Button";
import { Reveal } from "./ui/Reveal";

/**
 * Завершающий блок: сначала дать потрогать логику плана, потом звать в пилот.
 * Порядок принципиален — просить пять минут человека логичнее после того,
 * как он сам увидел, что план реагирует на его настройки.
 */
export function CtaSection() {
  return (
    <section id="cta" className="py-16 md:py-28">
      <div className="mx-auto max-w-[1180px] px-6">
        <Reveal>
          <div className="eyebrow">{CTA.eyebrow}</div>
        </Reveal>

        <Reveal delay={60}>
          <h2 className="mt-3.5 max-w-[22ch] text-[clamp(28px,4.4vw,48px)] tracking-[-0.045em]">
            {CTA.title}
          </h2>
        </Reveal>

        <Reveal delay={120}>
          <p className="mt-4 max-w-[62ch] text-[clamp(16px,2vw,19px)] text-muted">
            {CTA.lead}
          </p>
        </Reveal>

        <Reveal delay={180}>
          <div className="mt-10 rounded-[clamp(20px,3vw,30px)] border border-line bg-surface p-6 md:p-9">
            <PlanConfigurator />
            <p className="mt-6 font-mono text-[10.5px] tracking-wide text-muted">
              {CTA.disclaimer}
            </p>
          </div>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-[46ch] text-[15.5px] text-muted">
              {CTA.formsLead}
            </p>
            <div className="flex flex-wrap gap-3">
              {CTA.actions.map((a) => (
                <Button
                  key={a.href}
                  href={a.href}
                  external
                  withArrow
                  variant={a.primary ? "primary" : "secondary"}
                >
                  {a.label}
                </Button>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
