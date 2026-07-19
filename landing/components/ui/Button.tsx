import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 " +
  "text-[15px] font-bold tracking-tight whitespace-nowrap " +
  "transition-[transform,box-shadow,background-color,border-color,color] duration-200 " +
  "hover:-translate-y-0.5 active:translate-y-0 group";

const styles: Record<Variant, string> = {
  primary:
    "bg-accent text-on-accent border border-transparent " +
    "shadow-[0_2px_6px_rgba(31,122,77,0.26),0_12px_30px_rgba(31,122,77,0.22)] " +
    "hover:bg-accent-deep",
  secondary:
    "bg-surface text-ink border border-line hover:border-accent hover:text-accent-deep",
};

export function Button({
  href,
  children,
  variant = "primary",
  external = false,
  withArrow = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  external?: boolean;
  withArrow?: boolean;
  className?: string;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`${base} ${styles[variant]} ${className}`}
    >
      {children}
      {withArrow && (
        <ArrowRight
          size={17}
          strokeWidth={2.4}
          className="transition-transform duration-200 group-hover:translate-x-0.5"
        />
      )}
    </a>
  );
}
