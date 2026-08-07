import { Check } from "lucide-react";
import { PROS } from "@/lib/content";
import { SectionKicker } from "./SectionKicker";
import { Reveal } from "./ui/Reveal";

/** landing-b2b2c.md §6 — доступ для тех, кто уже купил план в PDF/Word. */
export function ExistingClientsSection() {
  const { access } = PROS;

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[1180px] px-6">
        <SectionKicker n="06" title={access.title} lead={access.lead} />

        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {access.items.map((item, i) => (
            <Reveal key={item.title} delay={i * 70} as="li">
              <div className="h-full rounded-2xl border border-line bg-surface p-5">
                <span className="mb-3 grid size-8 place-items-center rounded-full bg-herb/18 text-herb">
                  <Check size={16} strokeWidth={3} />
                </span>
                <h3 className="text-[15.5px] font-bold tracking-tight">{item.title}</h3>
                <p className="mt-1.5 text-[14.5px] text-muted">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
