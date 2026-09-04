import { BrandMark } from "./BrandMark";

type FooterGroup = {
  title: string;
  links: ReadonlyArray<{ href: string; label: string }>;
};

export function Footer({ groups }: { groups: readonly FooterGroup[] }) {
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

          {groups.map((g) => (
            <div key={g.title}>
              {/* h2, а не h3: на /cookies перед футером только h1, и h3
                  ломает порядок заголовков; на остальных страницах футер
                  идёт после h2-разделов и h2 здесь ровно на своём уровне. */}
              <h2 className="mb-3.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.18em] text-muted">
                {g.title}
              </h2>
              <ul className="grid gap-2.5">
                {g.links.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
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

        <div className="mt-11 border-t border-line pt-5.5 font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted">
          <span>© {new Date().getFullYear()} Базилик · Bazilik</span>
        </div>
      </div>
    </footer>
  );
}
