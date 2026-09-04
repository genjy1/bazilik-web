import { Check } from "lucide-react";
import { PROS } from "@/lib/content";
import { SectionKicker } from "./SectionKicker";
import { Reveal } from "./ui/Reveal";

type CheckItem = { title: string; body: string };

function CheckGrid({ heading, items }: { heading: string; items: readonly CheckItem[] }) {
  return (
    <div>
      <Reveal>
        <h3 className="text-[15px] font-bold tracking-tight text-accent-deep">{heading}</h3>
      </Reveal>
      <ul className="mt-4 grid gap-3">
        {items.map((c, i) => (
          <Reveal key={c.title} delay={60 + i * 50} as="li">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 grid size-5.5 shrink-0 place-items-center rounded-full bg-herb/18 text-herb">
                <Check size={12} strokeWidth={3} />
              </span>
              <span className="text-[15px]">
                <b className="font-bold">{c.title}</b> <span className="text-muted">{c.body}</span>
              </span>
            </div>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}

/** Раздел «Win-win» из landing-b2b2c.md §3: выгода специалиста и клиента рядом. */
export function WinWinSection() {
  const { winWin } = PROS;

  return (
    <section id="pros" className="py-16 md:py-28">
      <div className="mx-auto max-w-[1180px] px-6">
        <SectionKicker title={winWin.title} lead={winWin.lead} />

        <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-14">
          <CheckGrid heading={winWin.specialist.heading} items={winWin.specialist.items} />
          <CheckGrid heading={winWin.client.heading} items={winWin.client.items} />
        </div>

        <Reveal delay={120} className="mt-10">
          <p className="rounded-xl border border-line bg-accent-soft/50 px-5 py-4 text-[15.5px] font-bold tracking-tight text-accent-deep">
            {winWin.summary}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
