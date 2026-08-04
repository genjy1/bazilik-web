import { AUDIENCE_ROUTES, BASILIK_TOGGLE, CHAIN_BEFORE, CTA } from "@/lib/content";
import { BasilikChain } from "./BasilikChain";
import { PlanConfigurator } from "./PlanConfigurator";
import { Button } from "./ui/Button";
import { Reveal } from "./ui/Reveal";

type FinalCopy = {
  h2: string;
  lead?: string;
  note?: string;
};

/**
 * Завершающий блок: сначала дать потрогать логику плана, потом звать в пилот.
 * Порядок принципиален — просить пять минут человека логичнее после того,
 * как он сам увидел, что план реагирует на его настройки.
 *
 * На аудиторных страницах (/specialists, /home) финальный экран повторяет
 * тумблер «Включить Базилик» из геро (общее состояние через
 * `BasilikToggleProvider`) — передаётся через `final`/`showChain`, чтобы
 * корневая страница осталась на прежней копии без изменений.
 */
export function CtaSection({
  final,
  showChain = false,
  hideRoute,
}: {
  final?: FinalCopy;
  showChain?: boolean;
  /** Убирает из «в свой сценарий» ссылку на текущую страницу (аудиторные страницы не должны линковать сами на себя). */
  hideRoute?: string;
} = {}) {
  const routes = AUDIENCE_ROUTES.filter((route) => route.href !== hideRoute);
  return (
    <section id="cta" className="py-16 md:py-28">
      <div className="mx-auto max-w-[1180px] px-6">
        <Reveal>
          <div className="eyebrow">{final ? "Попробовать" : CTA.eyebrow}</div>
        </Reveal>

        <Reveal delay={60}>
          <h2 className="mt-3.5 max-w-[22ch] text-[clamp(28px,4.4vw,48px)] tracking-[-0.045em]">
            {final ? final.h2 : CTA.title}
          </h2>
        </Reveal>

        {(final?.lead || !final) && (
          <Reveal delay={120}>
            <p className="mt-4 max-w-[62ch] text-[clamp(16px,2vw,19px)] text-muted">
              {final ? final.lead : CTA.lead}
            </p>
          </Reveal>
        )}

        {showChain && (
          <Reveal delay={160}>
            <div className="mt-8 rounded-2xl border border-line bg-surface p-5 shadow-[0_24px_80px_rgba(18,88,58,0.10)] md:p-6">
              <BasilikChain
                chain={CHAIN_BEFORE}
                keepLabel={BASILIK_TOGGLE.keepLabel}
                statusOff={BASILIK_TOGGLE.statusOff}
                statusOn={BASILIK_TOGGLE.statusOn}
                buttonOff={BASILIK_TOGGLE.buttonOff}
                buttonOn={BASILIK_TOGGLE.buttonOn}
                compact
              />
            </div>
          </Reveal>
        )}

        {final?.note && (
          <Reveal delay={200}>
            <p className="mt-4 max-w-[62ch] font-mono text-[10.5px] tracking-wide text-muted">
              {final.note}
            </p>
          </Reveal>
        )}

        <Reveal delay={180}>
          <div className="mt-10 rounded-[clamp(20px,3vw,30px)] border border-line bg-surface p-6 md:p-9">
            <PlanConfigurator />
            <p className="mt-6 max-w-[62ch] font-mono text-[10.5px] tracking-wide text-muted">
              {CTA.disclaimer}
            </p>

            {routes.length > 0 && (
              <>
                <p className="mt-7 text-[15px] font-bold tracking-tight text-ink">
                  {CTA.pathLead}
                </p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  {routes.map((route) => (
                    <Button key={route.href} href={route.href} withArrow>
                      {route.title}
                    </Button>
                  ))}
                </div>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
