"use client";

import { useEffect, useId, useSyncExternalStore } from "react";

const STORAGE_KEY = "portfolio-theme";
const THEME_EVENT = "portfolio-theme-change";

function subscribe(callback) {
  window.addEventListener(THEME_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(THEME_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getThemeChoice() {
  return document.documentElement.dataset.themeChoice || "default";
}

function applyThemeChoice(value, defaultTheme) {
  document.documentElement.dataset.theme = value === "default" ? defaultTheme : value;
  document.documentElement.dataset.themeChoice = value;
  window.dispatchEvent(new Event(THEME_EVENT));
}

export function ThemeMenu({ defaultTheme }) {
  const groupName = useId();
  const choice = useSyncExternalStore(subscribe, getThemeChoice, () => "default");

  useEffect(() => {
    const syncFromStorage = (event) => {
      if (event.key !== STORAGE_KEY && event.key !== null) return;

      const savedTheme =
        event.newValue === "light" || event.newValue === "dark"
          ? event.newValue
          : "default";

      applyThemeChoice(savedTheme, defaultTheme);
    };

    window.addEventListener("storage", syncFromStorage);
    return () => window.removeEventListener("storage", syncFromStorage);
  }, [defaultTheme]);

  const selectTheme = (value) => {
    try {
      if (value === "default") {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, value);
      }
    } catch {
      // Theme switching still works even if browser storage is unavailable.
    }

    applyThemeChoice(value, defaultTheme);
  };

  const options = [
    ["light", "Light"],
    ["dark", "Dark"],
    ["default", "Use site default"],
  ];

  return (
    <fieldset className="min-w-0 border-0 p-0.5">
      <legend className="px-2 pb-1 text-sm font-medium text-[var(--muted)]">
        Appearance
      </legend>

      {options.map(([value, label]) => (
        <label
          key={value}
          className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm text-[var(--foreground)] transition hover:bg-[var(--surface)]"
        >
          <input
            type="radio"
            name={groupName}
            value={value}
            checked={choice === value}
            onChange={() => selectTheme(value)}
            className="h-4 w-4 accent-[var(--primary)]"
          />
          {label}
        </label>
      ))}
    </fieldset>
  );
}
