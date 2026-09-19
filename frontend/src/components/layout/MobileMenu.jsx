"use client";

import { useEffect, useId, useRef, useState } from "react";

export function MobileMenu({ children, desktop = false }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;

    const closeOnOutsideClick = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    const closeOnResize = () => setOpen(false);

    document.addEventListener("pointerdown", closeOnOutsideClick);
    window.addEventListener("resize", closeOnResize);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      window.removeEventListener("resize", closeOnResize);
    };
  }, [open]);

  const closeMenu = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div
      ref={menuRef}
      className={desktop ? "relative hidden min-[1152px]:block" : "relative min-[1152px]:hidden"}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setOpen(false);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.preventDefault();
          closeMenu();
        }
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-label={desktop ? "Theme options" : "Navigation menu"}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)]/55 text-sm font-bold text-[var(--foreground)] shadow-[0_6px_22px_rgba(0,0,0,0.06)] backdrop-blur-xl transition hover:border-[var(--foreground)]/40"
      >
        <span aria-hidden="true">{desktop ? "•••" : open ? "✕" : "☰"}</span>
      </button>

      {open && (
        <div
          id={panelId}
          onClick={(event) => {
            if (event.target.closest("a")) closeMenu();
          }}
          className={`absolute top-[calc(100%+0.65rem)] z-50 max-h-[calc(100dvh-5.5rem)] overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)]/95 p-3 shadow-[0_18px_44px_rgba(0,0,0,0.16)] backdrop-blur-xl ${
            desktop
              ? "right-0 w-56"
              : "right-0 w-[min(22rem,calc(100vw-1rem))]"
          }`}
        >
          {children}
        </div>
      )}
    </div>
  );
}
