"use client";

import { useEffect, useState } from "react";

const KEY = "bazilik-cookie-consent";

/**
 * Баннер рендерится пустым и на сервере, и при первой клиентской отрисовке
 * (localStorage недоступен на сервере) — расхождения гидратации нет,
 * появление откладывается на эффект после монтирования.
 */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(KEY) !== "accepted") setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem(KEY, "accepted");
    } catch {
      // приватный режим — баннер просто будет появляться заново
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Уведомление об использовании cookie"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-surface/95 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-4 px-6 py-4">
        <p className="min-w-[240px] flex-1 text-[13.5px] text-muted">
          Мы используем cookie для аналитики и улучшения работы сайта.{" "}
          <a
            href="/cookies"
            className="text-ink underline underline-offset-2 hover:text-accent-deep"
          >
            Подробнее
          </a>
        </p>
        <button
          type="button"
          onClick={accept}
          className="inline-flex min-h-10 shrink-0 items-center rounded-full bg-accent px-5 py-2.5 text-[13.5px] font-bold text-on-accent transition-colors hover:bg-accent-deep"
        >
          Понятно
        </button>
      </div>
    </div>
  );
}
