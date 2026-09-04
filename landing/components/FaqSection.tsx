import { HOME } from "@/lib/content";
import { SectionKicker } from "./SectionKicker";
import { Reveal } from "./ui/Reveal";

/**
 * Вопросы и ответы перед финальным CTA.
 *
 * Не аккордеон: секция существует ради текста, и текст должен быть виден
 * и читателю, и роботу без клика. Свёрнутые ответы для страницы, которой
 * не хватает прозы, — шаг в обратную сторону.
 *
 * Вопрос — h3, как заголовки карточек в соседних секциях: та же ступень
 * иерархии под h2 из SectionKicker. Разметка списком, а не <dl>: внутрь
 * <dt> заголовок ставить нельзя, а заголовок здесь нужен.
 */
export function FaqSection() {
  const { faq } = HOME;

  return (
    <section id="faq" className="py-16 md:py-28">
      <div className="mx-auto max-w-[1180px] px-6">
        <SectionKicker n="07" title={faq.title} lead={faq.lead} />

        <ul className="mt-10 grid gap-x-10 md:grid-cols-2">
          {faq.items.map((item, i) => (
            <Reveal
              key={item.q}
              delay={i * 60}
              as="li"
              /* Пять вопросов на две колонки: последний иначе стоял бы один
                 в ряду с пустотой справа. На всю ширину — но абзац остаётся
                 в своей мере (max-w ниже), а не растягивается на 1180px. */
              className={i === faq.items.length - 1 ? "md:col-span-2" : undefined}
            >
              <div className="border-t border-line py-7">
                <h3 className="max-w-[30ch] text-[19px] font-extrabold leading-snug tracking-tight md:text-[21px]">
                  {item.q}
                </h3>
                <p className="mt-3 max-w-[58ch] text-[15.5px] leading-relaxed text-muted">
                  {item.a}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
