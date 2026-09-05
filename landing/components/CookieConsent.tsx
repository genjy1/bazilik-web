"use client";

import { useEffect, useRef } from "react";
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
  const visible = accepted === false;
  const ref = useRef<HTMLDivElement>(null);

  /**
   * Баннер зафиксирован снизу и места в потоке не занимает, поэтому на
   * коротких экранах закрывал бы последние строки футера. Раньше `body`
   * получал фиксированные 96 px через `:has(...)`, но на 375 px баннер
   * складывался в две строки и вырастал до 136 px — отступа не хватало.
   * Теперь фактическая высота уходит в `--cookie-banner-h` на `<body>`
   * (globals.css читает её в `padding-bottom`), а ResizeObserver
   * пересчитывает её при перевёрстке. После «Понятно» переменная снимается.
   */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const { style } = document.body;
    const apply = () => style.setProperty("--cookie-banner-h", `${el.offsetHeight}px`);
    apply();

    const ro = new ResizeObserver(apply);
    ro.observe(el);

    return () => {
      ro.disconnect();
      style.removeProperty("--cookie-banner-h");
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      ref={ref}
      role="region"
      aria-label="Уведомление об использовании cookie"
      /* env(safe-area-inset-bottom): на iPhone без кнопки «Домой» нижние
         ~34 px экрана заняты индикатором, и кнопка «Понятно» без этого
         отступа ложилась бы под него. */
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl"
    >
      {/* Текст и кнопка всегда в один ряд: с `flex-wrap` на узком экране
          кнопка падала под текст, и баннер занимал шестую часть экрана. */}
      <div className="mx-auto flex max-w-[1180px] items-center gap-4 px-6 py-4">
        <p className="min-w-0 flex-1 text-[13.5px] text-muted">
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
