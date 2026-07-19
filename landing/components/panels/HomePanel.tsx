import Image from "next/image";
import { DISH, photoUrl } from "@/lib/images";
import { Chip } from "../ui/Chip";

/** Дни недели с числом приёмов пищи; понедельник — день закупки. */
const week = [
  { d: "Пн", meals: 3, shop: true },
  { d: "Вт", meals: 3, shop: false },
  { d: "Ср", meals: 3, shop: false },
  { d: "Чт", meals: 2, shop: false },
  { d: "Пт", meals: 3, shop: false },
  { d: "Сб", meals: 2, shop: false },
  { d: "Вс", meals: 2, shop: false },
];

export function HomePanel() {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden rounded-3xl border border-line bg-surface p-5 shadow-[0_2px_6px_rgba(22,35,28,0.05),0_18px_44px_rgba(22,35,28,0.1)]"
    >
      <div className="mb-4 flex items-center justify-between gap-3 border-b border-line pb-3.5">
        <div className="text-[15px] font-extrabold tracking-tight">Неделя 04</div>
        <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
          Магазин · Пн
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {week.map((day) => (
          <div
            key={day.d}
            className={`flex aspect-2/3 flex-col items-center gap-1 rounded-xl border px-1 py-2 ${
              day.shop ? "border-amber/45 bg-amber/10" : "border-line bg-ground"
            }`}
          >
            <span className="font-mono text-[9px] uppercase tracking-wide text-muted">
              {day.d}
            </span>
            {Array.from({ length: day.meals }).map((_, i) => (
              <span
                key={i}
                className={`size-1.5 rounded-[2px] ${day.shop ? "bg-amber" : "bg-accent/45"}`}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-line bg-ground px-3.5 py-3">
        <div>
          <div className="text-[14.5px] font-bold tracking-tight">Список покупок</div>
          <div className="mt-0.5 font-mono text-[10px] tracking-wide text-muted">
            24 позиции · 1 поход
          </div>
        </div>
        <Chip tone="herb">готов</Chip>
      </div>

      <div className="mt-2.5 flex items-center gap-3 rounded-2xl border border-line bg-ground p-2.5">
        <Image
          src={photoUrl(DISH.pastaBasil, 44)}
          alt={DISH.pastaBasil.alt}
          width={44}
          height={44}
          className="size-11 shrink-0 rounded-xl bg-panel object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[14.5px] font-bold tracking-tight">
            Ср · обед · шаг 3 из 7
          </div>
          <div className="mt-0.5 font-mono text-[10px] tracking-wide text-muted">
            Паста с базиликом
          </div>
        </div>
        <Chip className="shrink-0">готовим</Chip>
      </div>
    </div>
  );
}
