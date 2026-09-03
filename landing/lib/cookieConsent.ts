"use client";

import { useSyncExternalStore } from "react";

const KEY = "bazilik-cookie-consent";
const ACCEPTED = "accepted";

/**
 * `null` — согласие ещё не прочитано: так на сервере и при гидратации, когда
 * localStorage недоступен. Потребители не показывают ни баннер, ни счётчик,
 * пока значение не станет булевым, и первая клиентская отрисовка совпадает
 * с серверной без setState в эффекте — тот же приём, что в ThemeToggle.
 */
export type Consent = boolean | null;

type Listener = () => void;

const listeners = new Set<Listener>();

/**
 * Приватный режим и заблокированные cookie: localStorage бросает исключение
 * на записи. Тогда согласие живёт только в памяти вкладки — баннер скроется
 * и счётчик стартует, но после перезагрузки всё повторится.
 *
 * Флаг ставится только когда запись не удалась. Если бы он выставлялся
 * всегда, вкладка, нажавшая «Понятно», больше никогда не читала бы
 * localStorage и не узнала бы об отзыве согласия из соседней вкладки.
 */
let memoryConsent = false;

function subscribe(listener: Listener): () => void {
  listeners.add(listener);

  // Согласие, принятое или отозванное в соседней вкладке, должно отразиться
  // и здесь. Ключ не фильтруем: у события от localStorage.clear() он null,
  // а лишний вызов безвреден — React сам сверит снапшот и не перерисует.
  window.addEventListener("storage", listener);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function getSnapshot(): Consent {
  try {
    if (localStorage.getItem(KEY) === ACCEPTED) return true;
  } catch {
    // см. memoryConsent
  }
  return memoryConsent;
}

function getServerSnapshot(): Consent {
  return null;
}

/**
 * `true` — пользователь принял баннер, `false` — ещё нет,
 * `null` — неизвестно (сервер и гидратация).
 */
export function useCookieConsent(): Consent {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function acceptCookies(): void {
  try {
    localStorage.setItem(KEY, ACCEPTED);
  } catch {
    memoryConsent = true;
  }
  for (const listener of listeners) listener();
}
