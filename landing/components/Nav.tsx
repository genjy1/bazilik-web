"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { BrandMark } from "./BrandMark";
import { ThemeToggle } from "./ui/ThemeToggle";
import {
  MOTION_QUERIES,
  REDUCED_MOTION,
  ScrollTrigger,
  gsap,
  useIsomorphicLayoutEffect,
} from "@/lib/gsap";

type NavLink = { href: string; label: string };

/** Зазор между нижней кромкой букв ссылки и маркером активного раздела, px. */
const MARKER_GAP = 7;

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

  // Escape закрывает мобильное меню — ожидаемый выход с клавиатуры.
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

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

  /**
   * Маркер переезжает под активную ссылку.
   *
   * Не gsap.matchMedia: его revert() в cleanup откатывал маркер к исходному
   * состоянию (x 0, y 0, ширина 0, opacity 0) при каждой смене раздела, и
   * подчёркивание не переезжало от ссылки к ссылке, а каждый раз выезжало
   * из левого верхнего угла шапки. Твин с overwrite сам продолжает движение
   * с текущего места; reduced-motion читаем напрямую при каждом сдвиге.
   *
   * Активный индекс лежит в ref, чтобы одна и та же функция обслуживала и
   * смену раздела, и ResizeObserver, не пересоздавая наблюдатель на каждую
   * активацию.
   */
  const activeRef = useRef<number | null>(null);

  const moveMarker = useCallback(() => {
    const marker = markerRef.current;
    const nav = navRef.current;
    if (!marker || !nav) return;

    const index = activeRef.current;
    const target = index === null ? null : linkRefs.current[index];
    if (!target) {
      gsap.set(marker, { opacity: 0, overwrite: true });
      return;
    }

    // Подчёркивание привязано к тексту, а не к коробке ссылки: коробка
    // растянута до 44px ради зоны нажатия, и отсчёт от её края уводил
    // маркер на 16px под буквы. Меряем сам текст и ставим маркер на
    // фиксированный зазор под ним.
    //
    // Считаем от offsetTop и высот, а не от getBoundingClientRect: тот
    // учитывает transform, и пока ссылки ещё въезжают в шапку (gsap.from
    // с y: -8 в эффекте появления), маркер вставал на 8px выше и там
    // оставался до следующей смены раздела.
    const range = document.createRange();
    range.selectNodeContents(target);
    const textHeight = range.getBoundingClientRect().height;
    const x = target.offsetLeft;
    const y = target.offsetTop + (target.offsetHeight + textHeight) / 2 + MARKER_GAP;
    const width = target.offsetWidth;

    // Пока маркер спрятан (первый активный раздел на странице), ставим его
    // на место без движения и только проявляем: иначе он выезжал из угла
    // шапки, вырастая из нулевой ширины.
    if (Number(gsap.getProperty(marker, "opacity")) === 0) {
      gsap.set(marker, { x, y, width });
    }

    gsap.to(marker, {
      x,
      y,
      width,
      opacity: 1,
      duration: window.matchMedia(REDUCED_MOTION).matches ? 0 : 0.4,
      ease: "power3.out",
      overwrite: true,
    });
  }, []);

  useIsomorphicLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    // Ширина ссылок меняется вместе с раскладкой, поэтому позицию
    // пересчитываем, а не запоминаем один раз.
    const ro = new ResizeObserver(moveMarker);
    ro.observe(nav);

    return () => {
      ro.disconnect();
      if (markerRef.current) gsap.killTweensOf(markerRef.current);
    };
  }, [moveMarker]);

  useIsomorphicLayoutEffect(() => {
    activeRef.current = active;
    moveMarker();
  }, [active, moveMarker]);

  /**
   * Разворачивание мобильного меню по фактической высоте содержимого.
   *
   * Тоже без gsap.matchMedia: его revert() в cleanup снимал inline-высоту
   * ещё до твина закрытия, полотно схлопывалось в один кадр, а сам твин
   * закрытия анимировал 0 → 0. Твин с overwrite подхватывает движение с
   * текущей высоты и при быстром переключении.
   */
  useIsomorphicLayoutEffect(() => {
    const el = menuRef.current;
    if (!el) return;

    const reduced = window.matchMedia(REDUCED_MOTION).matches;
    const q = gsap.utils.selector(el);

    gsap.to(el, {
      height: open ? "auto" : 0,
      opacity: open ? 1 : 0,
      duration: reduced ? 0 : 0.32,
      ease: "power2.out",
      overwrite: true,
    });

    // Пункты выезжают следом за самим полотном, но только при открытии:
    // на закрытии это выглядело бы как задержка перед схлопыванием.
    if (open && !reduced) {
      gsap.fromTo(
        q("[data-menu-item]"),
        { opacity: 0, x: -12 },
        {
          opacity: 1,
          x: 0,
          duration: 0.35,
          ease: "power2.out",
          stagger: 0.05,
          delay: 0.06,
          overwrite: true,
        },
      );
    }
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
          className="flex min-h-11 items-center gap-2.5 text-[18px] font-extrabold tracking-tight text-ink"
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
            const linkClassName = `inline-flex min-h-11 items-center font-mono text-[11px] uppercase tracking-[0.1em] transition-colors ${
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
            className="pointer-events-none absolute top-0 left-0 h-0.5 rounded-full bg-accent opacity-0"
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
                "flex min-h-11 items-center rounded-xl px-3 py-2.5 font-mono text-[11px] uppercase tracking-[0.1em] text-muted transition-colors hover:bg-surface hover:text-accent-deep";

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
