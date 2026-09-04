import { HOME } from "@/lib/content";
import { SectionKicker } from "./SectionKicker";
import { Reveal } from "./ui/Reveal";

/**
 * Частые вопросы — возражения из product-marketing.md с прямыми ответами.
 *
 * Без аккордеона, все ответы открыты. Аккордеон прячет текст за кликом,
 * а этот раздел существует ради того, чтобы его прочли целиком: человек
 * перед блоком «Попробовать» и поисковик или языковая модель, которые
 * извлекают ответ из страницы. Открытый список одинаково работает без JS
 * и не требует состояния.
 *
 * `<dl>` с `<div>`-обёртками пар: семантика «термин — определение» ровно
 * та, что у вопроса и ответа, а обёртка нужна, чтобы пара была одной
 * ячейкой сетки и одним reveal-блоком.
 */
export function FaqSection() {
  const { faq } = HOME;

  return (
    <section id="faq" className="py-16 md:py-28">
      <div className="mx-auto max-w-[1180px] px-6">
        <SectionKicker title={faq.title} lead={faq.lead} />

        <dl className="mt-10 grid gap-x-10 gap-y-9 md:grid-cols-2">
          {faq.items.map((item, i) => (
            <Reveal
              key={item.q}
              as="div"
              /* Пары идут по рядам слева направо — правая догоняет левую. */
              delay={(i % 2) * 70}
              className="border-t border-line pt-5"
            >
              <dt className="text-[15.5px] font-bold tracking-tight">
                {item.q}
              </dt>
              <dd className="mt-2.5 max-w-[56ch] text-[14.5px] text-ink">
                {item.a}
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
