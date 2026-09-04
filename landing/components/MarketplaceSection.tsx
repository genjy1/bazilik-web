import { PROS } from "@/lib/content";
import { SectionKicker } from "./SectionKicker";
import { Chip } from "./ui/Chip";
import { Reveal } from "./ui/Reveal";

/** Вынесенные факты из marketplace.body — та же формулировка, но как читаемые плашки. */
const HIGHLIGHTS = ["Собрал один раз — продал многим", "Лиды находят вас сами", "Комиссия только с продажи"];

/** landing-b2b2c.md §5 — маркетплейс планов. */
export function MarketplaceSection() {
  const { marketplace } = PROS;

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[1180px] px-6">
        <SectionKicker title={marketplace.title} />
        <Reveal delay={80}>
          <p className="mt-2 max-w-[66ch] text-[clamp(16px,2vw,19px)] text-muted">
            {marketplace.body}
          </p>
        </Reveal>

        <Reveal delay={140}>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {HIGHLIGHTS.map((text) => (
              <Chip key={text} tone="herb" className="px-3.5 py-1.5 text-[10.5px] normal-case">
                {text}
              </Chip>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
