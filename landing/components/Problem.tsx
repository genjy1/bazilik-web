import { Clock, ShoppingCart, Trash2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionKicker } from "./SectionKicker";
import { Reveal } from "./ui/Reveal";

const PROBLEM_ITEMS: ReadonlyArray<{ icon: LucideIcon; title: string; body: string }> = [
  {
    icon: Clock,
    title: "Время растворяется в мелочах",
    body: "Восемь мелких решений в день ради одного ужина — часы за неделю, которых никто не считает.",
  },
  {
    icon: ShoppingCart,
    title: "Закупка — не по расписанию",
    body: "Забыл один ингредиент — и это ещё один поход, ещё один потерянный вечер.",
  },
  {
    icon: Trash2,
    title: "Часть покупок портится раньше тарелки",
    body: "Пучок зелени, недоеденный фарш, забытый в холодильнике огурец — обычная неделя без плана превращает лишнее в мусор.",
  },
];

export function Problem() {
  return (
    <section id="how" className="py-16 md:py-28">
      <div className="mx-auto max-w-[1180px] px-6">
        <SectionKicker
          n="01"
          title={
            <>
              Восемь решений в день{" "}
              <br />
              ради одного ужина
            </>
          }
          lead="Вы не одни. Каждую неделю до 15% купленных продуктов уходит в отход — портятся раньше, чем их успевают съесть."
        />

        <ul className="mt-10 grid gap-4 sm:grid-cols-3">
          {PROBLEM_ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} as="li" delay={i * 90}>
                <div className="h-full rounded-2xl border border-line bg-surface p-6">
                  <div className="mb-4 grid size-10 place-items-center rounded-xl bg-accent/13 text-accent-deep">
                    <Icon size={21} strokeWidth={2} />
                  </div>
                  <h3 className="mb-2.5 text-lg tracking-tight">{item.title}</h3>
                  <p className="text-[15px] text-muted">{item.body}</p>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
