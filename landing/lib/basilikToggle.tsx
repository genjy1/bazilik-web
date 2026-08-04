"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type BasilikToggleValue = {
  on: boolean;
  toggle: () => void;
};

const BasilikToggleContext = createContext<BasilikToggleValue | null>(null);

/**
 * Общее состояние тумблера «Включить Базилик» на одну страницу: клик в геро
 * и клик в финальном экране должны видеть одно и то же значение (спека
 * landing-b2c.md §7 / landing-b2b2c.md §8 — финал уже «включён», если
 * пользователь нажал тумблер раньше).
 */
export function BasilikToggleProvider({ children }: { children: ReactNode }) {
  const [on, setOn] = useState(false);

  const value = useMemo(
    () => ({ on, toggle: () => setOn((v) => !v) }),
    [on],
  );

  return (
    <BasilikToggleContext.Provider value={value}>
      {children}
    </BasilikToggleContext.Provider>
  );
}

export function useBasilikToggle(): BasilikToggleValue {
  const ctx = useContext(BasilikToggleContext);
  if (!ctx) {
    throw new Error("useBasilikToggle must be used within BasilikToggleProvider");
  }
  return ctx;
}
