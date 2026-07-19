"use client";

import { Contrast, Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

const KEY = "bazilik-theme";
type Theme = "light" | "dark";

/**
 * Тема живёт в DOM (атрибут data-theme) и localStorage, а не в React-состоянии:
 * её выставляет инлайн-скрипт из layout ещё до гидратации.
 *
 * Поэтому читаем её через useSyncExternalStore — серверный снапшот `null`
 * даёт нейтральную иконку и совпадающий первый клиентский рендер, без
 * setState в эффекте и без расхождения гидратации.
 */
const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", onChange);

  return () => {
    listeners.delete(onChange);
    mq.removeEventListener("change", onChange);
  };
}

function readTheme(): Theme {
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "light" || attr === "dark") return attr;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeToggle() {
  const theme = useSyncExternalStore<Theme | null>(
    subscribe,
    readTheme,
    () => null,
  );

  function toggle() {
    const next: Theme = readTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      // приватный режим — тема просто не запомнится
    }
    listeners.forEach((l) => l());
  }

  const Icon = theme === null ? Contrast : theme === "dark" ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Переключить тему"
      className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-ink transition-colors hover:border-accent hover:text-accent-deep"
    >
      <Icon size={13} strokeWidth={2.2} />
      Тема
    </button>
  );
}
