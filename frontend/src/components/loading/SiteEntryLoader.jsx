"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const SiteEntryContext = createContext(null);

export function SiteEntryLoader({ children, brandLabel }) {
  const [uiReady, setUiReady] = useState(false);
  const [pageReady, setPageReady] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const [forceHeroFallback, setForceHeroFallback] = useState(false);
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  const startedAt = useRef(0);
  const markHeroSettled = useCallback(() => setHeroReady(true), []);
  const loadingMessage = !pageReady
    ? "Loading portfolio content"
    : !heroReady
      ? "Preparing visual assets"
      : !uiReady
        ? "Setting the interface"
        : "Ready to explore";

  useEffect(() => {
    let active = true;
    startedAt.current = Date.now();

    const fontsReady = document.fonts?.ready || Promise.resolve();

    fontsReady.finally(() => {
      if (active) setUiReady(true);
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const markPageReady = () => setPageReady(true);

    if (document.readyState === "complete") {
      markPageReady();
      return undefined;
    }

    window.addEventListener("load", markPageReady, { once: true });

    return () => window.removeEventListener("load", markPageReady);
  }, []);

  useEffect(() => {
    if (heroReady) return;

    const timeout = window.setTimeout(() => {
      setForceHeroFallback(true);
      setHeroReady(true);
    }, 7000);

    return () => window.clearTimeout(timeout);
  }, [heroReady]);

  useEffect(() => {
    if (!uiReady || !pageReady || !heroReady) return;

    const minimumLoaderTime = 900;
    const remainingTime = Math.max(0, minimumLoaderTime - (Date.now() - startedAt.current));

    const fadeTimer = window.setTimeout(() => setLeaving(true), remainingTime);
    const removeTimer = window.setTimeout(() => setVisible(false), remainingTime + 520);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(removeTimer);
    };
  }, [heroReady, pageReady, uiReady]);

  useEffect(() => {
    document.documentElement.classList.toggle("site-loading", visible);

    return () => {
      document.documentElement.classList.remove("site-loading");
    };
  }, [visible]);

  return (
    <SiteEntryContext.Provider value={{ forceHeroFallback, markHeroSettled }}>
      <div
        inert={visible ? true : undefined}
        aria-hidden={visible ? true : undefined}
        className={visible ? "invisible min-h-svh" : "min-h-svh"}
      >
        {children}
      </div>

      {visible && (
        <div
          role="status"
          aria-live="polite"
          aria-label="Loading portfolio"
          className={`fixed inset-0 z-[9999] flex min-h-[100svh] w-screen overflow-hidden bg-[#0d0b0d] px-5 py-5 text-white transition-[opacity,visibility] duration-500 motion-reduce:duration-0 sm:px-8 sm:py-8 ${
            leaving ? "pointer-events-none invisible opacity-0" : "visible opacity-100"
          }`}
        >
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,rgba(197,31,50,.13),transparent_24rem)]" />

          <div
            className={`relative mx-auto flex min-h-[calc(100svh-2.5rem)] w-full max-w-5xl flex-col justify-between py-2 transition-[opacity,transform] duration-500 motion-reduce:duration-0 sm:min-h-[calc(100svh-4rem)] sm:py-4 ${
              leaving ? "scale-[0.98] opacity-0" : "animate-[loader-content-in_.45s_ease-out_both] opacity-100"
            }`}
          >
            <header className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.16em] text-white/55 sm:text-xs">
              <span>{brandLabel}</span>
              <span>Portfolio</span>
            </header>

            <main className="flex flex-col items-center py-10 text-center sm:py-14">
              <div className="grid h-16 w-16 place-items-center rounded-full border border-white/15 bg-white/[.03] text-2xl font-bold tracking-[-0.08em] text-white shadow-[0_0_38px_rgba(197,31,50,.2)] sm:h-20 sm:w-20 sm:text-3xl">
                {brandLabel.slice(0, 1).toUpperCase()}
              </div>

              <h1 className="mt-7 text-[clamp(2.5rem,9vw,6rem)] font-bold leading-[.9] tracking-[-0.075em] text-white">
                {brandLabel}
              </h1>

              <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--accent)] sm:text-xs">
                Full stack developer
              </p>

              <p className="mt-7 max-w-xs text-sm leading-6 text-white/55 sm:max-w-sm sm:text-[15px]">
                Building simple, useful and thoughtful digital experiences.
              </p>
            </main>

            <footer className="mx-auto w-full max-w-sm border-t border-white/10 pt-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] [animation:loader-pulse_1.4s_ease-in-out_infinite]" />
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/45">
                  {loadingMessage}
                </p>
              </div>
              <span className="relative mx-auto mt-3 block h-px w-full overflow-hidden bg-white/15 after:absolute after:inset-y-0 after:left-0 after:w-[42%] after:bg-[var(--primary)] after:shadow-[0_0_16px_var(--primary)] after:content-[''] after:[animation:entry-progress_1.2s_cubic-bezier(0.4,0,0.2,1)_infinite] motion-reduce:after:left-[18%] motion-reduce:after:animate-none" />
            </footer>
          </div>
        </div>
      )}
    </SiteEntryContext.Provider>
  );
}

export function useSiteEntry() {
  const context = useContext(SiteEntryContext);

  if (!context) {
    throw new Error("useSiteEntry must be used inside SiteEntryLoader.");
  }

  return context;
}
