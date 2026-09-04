import type { ReactNode } from "react";

type Tone = "accent" | "herb" | "amber" | "neutral";

const tones: Record<Tone, string> = {
  accent: "bg-accent/12 text-accent-deep border-accent/30",
  herb: "bg-herb/15 text-herb-ink border-herb/35",
  amber: "bg-amber/15 text-amber border-amber/35",
  neutral: "bg-surface text-ink border-line",
};

/** Моно-капс плашка: статусы, теги, метрики. */
export function Chip({
  children,
  tone = "accent",
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full border px-2.5 py-1 font-mono text-[10.5px] tracking-wide ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

