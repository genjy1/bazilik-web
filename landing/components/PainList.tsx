import { Reveal } from "./ui/Reveal";
import { SectionKicker } from "./SectionKicker";

/**
 * Простой список боли — для /specialists, без специальных сцен (в отличие
 * от PainChaos на /home). Тон ровный, только сам факт стагнации проблем.
 */
export function PainList({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[1180px] px-6">
        <SectionKicker n="02" title={title} />

        <ul className="mt-8 grid gap-3">
          {items.map((text, i) => (
            <Reveal key={text} delay={i * 60} as="li">
              <div className="flex items-start gap-3 rounded-xl border border-line bg-surface px-5 py-4">
                <span
                  aria-hidden="true"
                  className="mt-1.5 size-1.5 shrink-0 rounded-full bg-muted"
                />
                <span className="text-[15.5px] text-ink">{text}</span>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
