import type { ReactNode } from "react";
import { Reveal } from "./ui/Reveal";

/**
 * Заголовок секции: дисплейный H2 и необязательный лид.
 *
 * Моно-номера «02…06» убраны: секции лендинга — не последовательность,
 * а единственный настоящий порядок на странице (три шага в PhoneStepsScene)
 * нумерует себя сам. Два счётчика рядом читались как один сломанный.
 */
export function SectionKicker({ title, lead }: { title: ReactNode; lead?: string }) {
  return (
    <>
      <Reveal>
        <h2 className="mb-4.5 text-[clamp(30px,4.6vw,52px)]">{title}</h2>
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
