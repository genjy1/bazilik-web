"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { BrandMark } from "./BrandMark";
import { ThemeToggle } from "./ui/ThemeToggle";
import {
  MOTION_QUERIES,
  ScrollTrigger,
  gsap,
  useIsomorphicLayoutEffect,
} from "@/lib/gsap";

type NavLink = { href: string; label: string };

/**
 * Ссылки навигации — свои на каждой странице (главная и обе аудитории),
 * поэтому список приходит пропом, а не общей константой.
 */
export function Nav({ links }: { links: readonly NavLink[] }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  const barRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // Подложка и граница шапки появляются, как только страницу прокрутили.
  useIsomorphicLayoutEffect(() => {
    const el = barRef.current;
    if (!el) return;

    const st = ScrollTrigger.create({
      start: "12px top",
      onToggle: (self) => el.classList.toggle("is-stuck", self.isActive),
    });

    return () => st.kill();
  }, []);

  // Появление самой шапки. Отдельно от остальной страницы: она видна сразу,
  // ждать прокрутки нечего.
  useIsomorphicLayoutEffect(() => {
    const el = barRef.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add(MOTION_QUERIES, (ctx) => {
      const { reduced } = ctx.conditions as { reduced: boolean };
      if (reduced) return;

      const q = gsap.utils.selector(el);
      gsap.from(q("[data-nav-item]"), {
        opacity: 0,
        y: -8,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.05,
        delay: 0.1,
      });
    });

    return () => mm.revert();
  }, []);

  /**
   * Активный раздел определяется тем, что занимает середину экрана.
   * Именно поэтому границы триггера — 45% сверху и снизу: раздел считается
   * текущим, когда пересекает середину, а не когда только показался краем.
   */
  useIsomorphicLayoutEffect(() => {
    const triggers = links.map((link, i) => {
      // Ссылки на соседнюю страницу (например «Дома» со страницы
      // специалистов) не якоря — для них нет секции на этой странице,
      // и document.querySelector упал бы на невалидном для CSS селекторе "/…".
      if (!link.href.startsWith("#")) return null;

      const section = document.querySelector(link.href);
      if (!section) return null;

      return ScrollTrigger.create({
        trigger: section,
        start: "top 45%",
        end: "bottom 45%",
        onToggle: (self) => {
          if (self.isActive) setActive(i);
        },
      });
    });

    return () => triggers.forEach((t) => t?.kill());
  }, [links]);

  // Маркер переезжает под активную ссылку.
  useIsomorphicLayoutEffect(() => {
    const marker = markerRef.current;
    const nav = navRef.current;
    if (!marker || !nav) return;

    if (active === null) {
      gsap.set(marker, { opacity: 0 });
      return;
    }

    const mm = gsap.matchMedia();

    mm.add(MOTION_QUERIES, (ctx) => {
      const { reduced } = ctx.conditions as { reduced: boolean };

      const move = () => {
        const target = linkRefs.current[active];
        if (!target) return;

        gsap.to(marker, {
          x: target.offsetLeft,
          width: target.offsetWidth,
          opacity: 1,
          duration: reduced ? 0 : 0.4,
          ease: "power3.out",
          overwrite: true,
        });
      };

      move();

      // Ширина ссылок меняется вместе с раскладкой, поэтому позицию
      // пересчитываем, а не запоминаем один раз.
      const ro = new ResizeObserver(move);
      ro.observe(nav);

      return () => ro.disconnect();
    });

    return () => mm.revert();
  }, [active]);

  // Разворачивание мобильного меню по фактической высоте содержимого.
  useIsomorphicLayoutEffect(() => {
    const el = menuRef.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add(MOTION_QUERIES, (ctx) => {
      const { reduced } = ctx.conditions as { reduced: boolean };
      const q = gsap.utils.selector(el);

      gsap.to(el, {
        height: open ? "auto" : 0,
        opacity: open ? 1 : 0,
        duration: reduced ? 0 : 0.32,
        ease: "power2.out",
      });

      // Пункты выезжают следом за самим полотном, но только при открытии:
      // на закрытии это выглядело бы как задержка перед схлопыванием.
      if (open && !reduced) {
        gsap.fromTo(
          q("[data-menu-item]"),
          { opacity: 0, x: -12 },
          { opacity: 1, x: 0, duration: 0.35, ease: "power2.out", stagger: 0.05, delay: 0.06 },
        );
      }
    });

    return () => mm.revert();
  }, [open]);

  return (
    <header
      ref={barRef}
      className="sticky top-0 z-50 border-b border-transparent bg-ground/75 backdrop-blur-xl transition-colors duration-300 [&.is-stuck]:border-line [&.is-stuck]:bg-ground/90"
    >
      <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between gap-4 px-6">
        <Link
          href="/"
          data-nav-item
          className="flex items-center gap-2.5 text-[18px] font-extrabold tracking-tight text-ink"
        >
          <BrandMark className="size-6.5 shrink-0" />
          <span>Базилик</span>
        </Link>

        <nav
          ref={navRef}
          aria-label="Разделы"
          className="relative hidden gap-6 lg:flex"
        >
          {links.map((l, i) => {
            const linkClassName = `font-mono text-[11px] uppercase tracking-[0.1em] transition-colors ${
              active === i ? "text-accent-deep" : "text-muted hover:text-accent-deep"
            }`;
            const ref = (node: HTMLAnchorElement | null) => {
              linkRefs.current[i] = node;
            };

            // Якоря — внутри текущей страницы, ссылки на соседнюю аудиторию —
            // полноценный переход между страницами через next/link.
            return l.href.startsWith("#") ? (
              <a
                key={l.href}
                href={l.href}
                data-nav-item
                ref={ref}
                aria-current={active === i ? "true" : undefined}
                className={linkClassName}
              >
                {l.label}
              </a>
            ) : (
              <Link
                key={l.href}
                href={l.href}
                data-nav-item
                ref={ref}
                className={linkClassName}
              >
                {l.label}
              </Link>
            );
          })}

          {/* Маркер активного раздела. aria-hidden — состояние уже передано
              через aria-current на самой ссылке. */}
          <span
            ref={markerRef}
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-2 left-0 h-0.5 rounded-full bg-accent opacity-0"
          />
        </nav>

        <div className="flex items-center gap-2.5" data-nav-item>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={open}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-line bg-surface p-2.5 text-ink lg:hidden"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* inert убирает свёрнутое меню из таб-порядка: высота 0 прячет его
          визуально, но фокус без этого продолжает по нему ходить. */}
      <div
        ref={menuRef}
        inert={!open}
        className="h-0 overflow-hidden border-t border-line bg-ground opacity-0 lg:hidden"
      >
        <nav aria-label="Разделы (мобильное меню)">
          <ul className="mx-auto flex max-w-[1180px] flex-col gap-1 px-6 py-4">
            {links.map((l) => {
              const itemClassName =
                "block rounded-xl px-3 py-2.5 font-mono text-[11px] uppercase tracking-[0.1em] text-muted transition-colors hover:bg-surface hover:text-accent-deep";

              return (
                <li key={l.href} data-menu-item>
                  {l.href.startsWith("#") ? (
                    <a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className={itemClassName}
                    >
                      {l.label}
                    </a>
                  ) : (
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className={itemClassName}
                    >
                      {l.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
