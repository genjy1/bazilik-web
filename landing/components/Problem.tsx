"use client";

import { useState } from "react";
import { Leaf } from "lucide-react";
import { CHAIN_BEFORE } from "@/lib/content";
import { SectionKicker } from "./SectionKicker";
import { Reveal } from "./ui/Reveal";

/** Последние два шага («приготовить», «съесть») — всё, что остаётся после схлопывания. */
const KEEP_FROM = CHAIN_BEFORE.length - 2;
const COMPACT_CHAIN = CHAIN_BEFORE.slice(KEEP_FROM);

export function Problem() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <section id="how" className="py-16 md:py-28">
      <div className="mx-auto max-w-[1180px] px-6">
        <SectionKicker
          n="01"
          title={
            <>
              Восемь решений в день{" "}
              <br />
              ради одного ужина
            </>
          }
          lead="Каждый день повторяется одна и та же цепочка. Недельный план сжимает её до двух шагов — и это не про «усталость от решений», а про измеримые вещи: время, лишние походы в магазин, выброшенные продукты."
        />

        <Reveal delay={120} className="mt-10">
          <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_24px_80px_rgba(18,88,58,0.10)]">
            <div className="relative px-5 py-6 md:px-6 md:py-7">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                  сейчас · каждый день
                </div>
                <button
                  type="button"
                  aria-pressed={collapsed}
                  onClick={() => setCollapsed((v) => !v)}
                  className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-transparent bg-accent px-4 py-2 text-sm font-bold tracking-tight text-on-accent shadow-[0_10px_26px_rgba(31,122,77,0.24)] transition-[transform,background-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-accent-deep active:translate-y-0"
                >
                  <Leaf
                    size={16}
                    strokeWidth={2.5}
                    className="transition-transform duration-300 group-hover:-rotate-12"
                    aria-hidden="true"
                  />
                  {collapsed ? "показать всё" : "включить базилик"}
                </button>
              </div>

              <div
                className={`grid transition-[grid-template-rows,opacity,margin] duration-700 ease-out ${
                  collapsed
                    ? "grid-rows-[0fr] opacity-25 md:mb-0"
                    : "grid-rows-[1fr] opacity-100 md:mb-18"
                }`}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="flex flex-wrap items-center gap-2 pb-3">
                    {CHAIN_BEFORE.map((step, i) => (
                      <span key={step} className="inline-flex items-center gap-2">
                        <span className="whitespace-nowrap rounded-full border border-line bg-ground px-3.5 py-2 text-sm font-bold tracking-tight text-muted">
                          {step}
                        </span>
                        {i < CHAIN_BEFORE.length - 1 && (
                          <span
                            aria-hidden="true"
                            className="font-mono text-sm font-bold text-line"
                          >
                            →
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-x-12 top-[128px] hidden h-18 transition-opacity duration-500 md:block ${
                  collapsed ? "opacity-0" : "opacity-100"
                }`}
              >
                <div className="absolute left-[3%] right-[58%] top-0 h-full rounded-b-[72px] border-b border-l border-r border-accent/40" />
                <div className="absolute left-[58%] right-[3%] top-0 h-full rounded-b-[72px] border-b border-l border-r border-accent/40" />
                <div className="absolute left-[32%] top-[62px] h-10 w-px bg-accent/40" />
                <div className="absolute left-[72%] top-[62px] h-10 w-px bg-accent/40" />
              </div>

              <div className="rounded-xl border border-accent/30 bg-accent-soft/70 p-4 transition-[transform,opacity] duration-700 ease-out md:-translate-y-1">
                <div className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-accent-deep">
                  с базиликом · неделя спланирована один раз
                </div>
                <div className="flex flex-nowrap items-center gap-2 overflow-visible">
                  {COMPACT_CHAIN.map((step, i) => (
                    <span key={step} className="inline-flex items-center gap-2">
                      <span className="whitespace-nowrap rounded-full bg-accent px-4 py-2.5 text-[15px] font-extrabold sm:px-5 sm:text-base tracking-tight text-on-accent shadow-[0_12px_28px_rgba(31,122,77,0.24)]">
                        {step}
                      </span>
                      {i < COMPACT_CHAIN.length - 1 && (
                        <span
                          aria-hidden="true"
                          className="font-mono text-sm font-bold text-accent"
                        >
                          →
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}



