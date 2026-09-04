"use client";

import { useEffect } from "react";
import { MOTION_QUERIES, ScrollTrigger } from "@/lib/gsap";

const EXTRA_GAP = 8;

function targetFromHash(hash: string) {
  if (!hash || hash === "#") return null;

  try {
    return document.getElementById(decodeURIComponent(hash.slice(1)));
  } catch {
    return null;
  }
}

function scrollToHash(hash: string, behavior: ScrollBehavior) {
  const target = targetFromHash(hash);
  if (!target) return;

  const reduced = window.matchMedia(MOTION_QUERIES.reduced).matches;
  const effectiveBehavior: ScrollBehavior = reduced ? "auto" : behavior;

  requestAnimationFrame(() => {
    ScrollTrigger.refresh();

    const header = document.querySelector("header");
    const headerHeight = header?.getBoundingClientRect().height ?? 0;
    const top =
      target.getBoundingClientRect().top +
      window.scrollY -
      headerHeight -
      EXTRA_GAP;

    window.scrollTo({ top: Math.max(0, top), behavior: effectiveBehavior });

    // Фокус переезжает на цель: без этого после «К содержимому» и якорей
    // шапки Tab продолжает с прежнего места, а не из открытого раздела.
    // preventScroll — прокрутка уже задана выше с поправкой на шапку.
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  });
}

export function HashScrollManager() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest("a[href^='#']");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target || anchor.hasAttribute("download")) return;

      const url = new URL(anchor.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname !== window.location.pathname) return;

      const target = targetFromHash(url.hash);
      if (!target) return;

      event.preventDefault();
      history.pushState(null, "", url.hash);
      scrollToHash(url.hash, "smooth");
    };

    document.addEventListener("click", onClick);

    if (window.location.hash) {
      window.setTimeout(() => scrollToHash(window.location.hash, "auto"), 0);
      window.setTimeout(() => scrollToHash(window.location.hash, "auto"), 350);
    }

    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
