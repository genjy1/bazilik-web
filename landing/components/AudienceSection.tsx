import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { Parallax } from "./ui/Parallax";
import { Reveal } from "./ui/Reveal";

type CheckItem = { title: string; body: string };

/**
 * Блок «текст + панель интерфейса» — открывает страницу своей аудитории
 * (/specialists или главная /), поэтому заголовок здесь h1. `reversed` меняет
 * местами колонки на десктопе; на мобильном текст всегда идёт первым.
 *
 * Границу снизу рисует SectionDivider на уровне страницы — своего border-t
 * здесь быть не должно, иначе линий окажется две.
 */
export function AudienceSection({
  id,
  eyebrow,
  title,
  lead,
  checks,
  media,
  reversed = false,
}: {
  id: string;
  eyebrow: string;
  title: ReactNode;
  lead: string;
  checks: readonly CheckItem[];
  media: ReactNode;
  reversed?: boolean;
}) {
  return (
    <section id={id} className="py-16 md:py-28">
      <div className="mx-auto grid max-w-[1180px] items-center gap-8 px-6 md:gap-14 lg:grid-cols-2">
        <div className={reversed ? "lg:order-2" : undefined}>
          <Reveal>
            <div className="eyebrow">{eyebrow}</div>
          </Reveal>

          <Reveal delay={60}>
            <h1 className="mt-3.5 text-[clamp(26px,3.6vw,40px)]">{title}</h1>
          </Reveal>

          <Reveal delay={120}>
            <p className="mt-4 max-w-[60ch] text-[clamp(16px,2vw,19px)] text-muted">
              {lead}
            </p>
          </Reveal>

          <ul className="mt-7 grid gap-3">
            {checks.map((c, i) => (
              <Reveal key={c.title} delay={170 + i * 50} as="li">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-5.5 shrink-0 place-items-center rounded-full bg-herb/18 text-herb">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  <span className="text-[15.5px]">
                    <b className="font-bold">{c.title}</b>{" "}
                    <span className="text-muted">{c.body}</span>
                  </span>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>

        {/* Панель отстаёт от текстовой колонки — за счёт этого блок читается
            как два слоя, а не как одна плоская сетка. */}
        <Parallax speed={0.22} className={reversed ? "lg:order-1" : undefined}>
          <Reveal delay={140}>{media}</Reveal>
        </Parallax>
      </div>
    </section>
  );
}
