"use client";

import Script from "next/script";

import { useCookieConsent } from "@/lib/cookieConsent";

const COUNTER_ID = 111509055;

/**
 * Счётчик монтируется только после согласия на cookie. Метрика с webvisor
 * пишет сессию целиком, поэтому до нажатия «Понятно» в баннере не должно
 * уходить ни одного запроса.
 *
 * noscript-пикселя здесь нет намеренно: без JS согласие подтвердить нечем,
 * значит и трекать нечего. Да и сработать он не смог бы — на сервере
 * компонент отдаёт null, а на клиенте React не создаёт детей <noscript>.
 *
 * Инициализация — inline-скрипт с ym(...) внутри, не внешний src, поэтому
 * next/script грузит его через afterInteractive: счётчик не блокирует
 * первую отрисовку. Согласие, данное позже, монтирует <Script> уже после
 * гидратации — afterInteractive выполняет его в эффекте на монтировании,
 * так что ждать перезагрузки не нужно.
 */
export function YandexMetrika() {
  const accepted = useCookieConsent();

  if (!accepted) return null;

  return (
    <Script id="yandex-metrika" strategy="afterInteractive">
      {`
        (function(m,e,t,r,i,k,a){
            m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
        })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=${COUNTER_ID}', 'ym');

        ym(${COUNTER_ID}, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
      `}
    </Script>
  );
}
