import { FOOTER_GROUPS } from "@/lib/content";
import { BrandMark } from "./BrandMark";

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface py-14">
      <div className="mx-auto max-w-[1180px] px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.6fr_repeat(2,1fr)]">
          <div>
            <div className="flex items-center gap-2.5 text-[18px] font-extrabold tracking-tight">
              <BrandMark className="size-6.5" />
              Базилик
            </div>
            <p className="mt-3.5 max-w-[34ch] text-[14.5px] text-muted">
              Операционный слой планирования питания. Готовь то, что уже есть.
            </p>
          </div>

          {FOOTER_GROUPS.map((g) => (
            <div key={g.title}>
              <h4 className="mb-3.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.18em] text-muted">
                {g.title}
              </h4>
              <ul className="grid gap-2.5">
                {g.links.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      {...("external" in l && l.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="text-[14.5px] text-ink transition-colors hover:text-accent-deep"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-11 flex flex-wrap justify-between gap-4 border-t border-line pt-5.5 font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted">
          <span>© 2026 Базилик · Bazilik</span>
          <span>Изумруд · #1F7A4D</span>
        </div>
      </div>
    </footer>
  );
}
