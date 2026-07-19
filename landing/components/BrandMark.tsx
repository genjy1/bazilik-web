/**
 * Знак «Базилик» — три листа + стебель.
 * Геометрия скопирована из бренд-бука без изменений: менять пути,
 * добавлять засечки или перекрашивать изумруд запрещено гардрейлами.
 */
export function BrandMark({
  className,
  mono = false,
}: {
  className?: string;
  mono?: boolean;
}) {
  const leaf = "M50 72 C 37 62 36 36 50 20 C 64 36 63 62 50 72 Z";

  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path
        d="M50 90 L50 72"
        fill="none"
        stroke={mono ? "currentColor" : "var(--ink)"}
        strokeWidth={6}
        strokeLinecap="round"
      />
      <path
        d={leaf}
        transform="rotate(-42 50 72)"
        fill={mono ? "currentColor" : "var(--accent)"}
      />
      <path
        d={leaf}
        transform="rotate(42 50 72)"
        fill={mono ? "currentColor" : "var(--accent)"}
      />
      <path d={leaf} fill={mono ? "currentColor" : "var(--accent-deep)"} />
    </svg>
  );
}
