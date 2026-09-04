"use client";

import { acceptCookies, useCookieConsent } from "@/lib/cookieConsent";

/**
 * Баннер не попадает ни в серверную разметку, ни в первую клиентскую
 * отрисовку: пока согласие не прочитано из localStorage, хук отдаёт `null`
 * и компонент рендерится пустым — расхождения гидратации нет, а появление
 * откладывается до первого клиентского снапшота.
 *
 * Само согласие живёт в lib/cookieConsent: его читает ещё и YandexMetrika,
 * чтобы не стартовать до нажатия «Понятно».
 */
export function CookieConsent() {
  const accepted = useCookieConsent();

  if (accepted !== false) return null;

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
            className="inline-block py-3 -my-3 text-ink underline underline-offset-2 hover:text-accent-deep"
          >
            Подробнее
          </a>
        </p>
        <button
          type="button"
          onClick={acceptCookies}
          className="inline-flex min-h-11 shrink-0 items-center rounded-full bg-accent px-5 py-2.5 text-[13.5px] font-bold text-on-accent transition-colors hover:bg-accent-deep"
        >
          Понятно
        </button>
      </div>
    </div>
  );
}
