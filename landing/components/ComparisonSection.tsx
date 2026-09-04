import { Check, X } from "lucide-react";
import { HOME } from "@/lib/content";
import { SectionKicker } from "./SectionKicker";
import { Reveal } from "./ui/Reveal";

type Row = { title: string; left: string; right: string };

/**
 * Один ряд сравнения «обычное приложение / Базилик» (landing-b2c-motion.md §6
 * — формат split, разделитель по центру).
 *
 * Разделитель раньше можно было тащить мышкой (before/after слайдер), но
 * спека называет этот приём опциональным, и работает он только там, где обе
 * половины занимают всю ширину кадра. Здесь в каждой половине — короткий
 * абзац, поэтому при сдвиге разделителя вправо открывалась не сторона
 * «после», а пустая заливка. Обе колонки показаны одновременно: сравнение
 * читается сразу, без единого действия, и одинаково выглядит без JS.
 */
function CompareRow({ row }: { row: Row }) {
  return (
    <div>
      <Reveal>
        <h3 className="text-[15.5px] font-bold tracking-tight">{row.title}</h3>
      </Reveal>

      <Reveal delay={60}>
        {/* Обе ячейки лежат в одной grid-строке, поэтому тянутся до общей
            высоты сами — фиксировать её (как при слайдере) больше не нужно. */}
        <div className="mt-3 grid overflow-hidden rounded-xl border border-line sm:grid-cols-2">
          {/* «Как у всех» — приглушённая половина: тот же кегль, но без цвета. */}
          <div className="bg-ground px-5 py-4 sm:px-6 sm:py-5">
            <span className="flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
              <X aria-hidden="true" className="size-3 shrink-0" />
              обычное приложение
            </span>
            {/* Ширину абзаца не подрезаем: в колонке 1180/2 он и так
                ложится в комфортные ~70 знаков, а обрезка оставляла справа
                ровно ту пустоту, из-за которой сравнение и не читалось. */}
            <p className="mt-2.5 text-[14.5px] text-muted">{row.left}</p>
          </div>

          {/* «Как у нас» — акцентная половина. Её левая граница и есть тот
              самый центральный разделитель из спеки, только неподвижный;
              на узком экране колонки встают друг под друга, и он
              превращается в верхнюю границу. */}
          <div className="border-t border-line bg-accent-soft/60 px-5 py-4 sm:border-t-0 sm:border-l sm:border-line sm:px-6 sm:py-5">
            <span className="flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-accent-deep">
              <Check aria-hidden="true" className="size-3 shrink-0" />
              Базилик
            </span>
            <p className="mt-2.5 text-[14.5px] font-medium text-ink">
              {row.right}
            </p>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

/** landing-b2c.md §5 / landing-b2c-motion.md §6 — «Чем мы не как все». */
export function ComparisonSection() {
  const { comparison } = HOME;

  return (
    <section className="py-16 md:py-28">
      <div className="mx-auto max-w-[1180px] px-6">
        <SectionKicker title={comparison.title} lead={comparison.lead} />

        <div className="mt-10 grid gap-8">
          {comparison.rows.map((row) => (
            <CompareRow key={row.title} row={row} />
          ))}
        </div>

        <Reveal delay={120}>
          <p className="mt-8 rounded-xl border border-line bg-accent-soft/50 px-5 py-4 text-[15.5px] font-bold tracking-tight text-accent-deep">
            {comparison.outro}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
