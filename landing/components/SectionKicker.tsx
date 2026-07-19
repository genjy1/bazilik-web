import type { ReactNode } from "react";
import { Reveal } from "./ui/Reveal";

/** Нумерованный заголовок секции: моно-номер + дисплейный H2. */
export function SectionKicker({
  n,
  title,
  lead,
}: {
  n: string;
  title: ReactNode;
  lead?: string;
}) {
  return (
    <>
      <Reveal>
        <div className="mb-4.5 flex flex-wrap items-baseline gap-3.5">
          <span className="font-mono text-[13px] font-bold tracking-[0.14em] text-accent">
            {n}
          </span>
          <h2 className="text-[clamp(30px,4.6vw,52px)]">{title}</h2>
        </div>
      </Reveal>
      {lead && (
        <Reveal delay={80}>
          <p className="max-w-[66ch] text-[clamp(16px,2vw,19px)] text-muted">
            {lead}
          </p>
        </Reveal>
      )}
    </>
  );
}
