"use client";

import { useEffect, useRef, useState } from "react";
import { useVideoScrub } from "@/hooks/useVideoScrub";
import { useSiteEntry } from "@/components/loading/SiteEntryLoader";

const DESKTOP_QUERY = "(min-width: 1152px) and (hover: hover) and (pointer: fine)";
const POSTER_SRC = "/images/hero-character-poster.jpg";
const VIDEO_SRC = "/videos/character-scrub.mp4";

export function HeroBackground() {
  const heroRef = useRef(null);
  const videoRef = useRef(null);

  const [interactionReady, setInteractionReady] = useState(false);
  const [desktopInteractive, setDesktopInteractive] = useState(false);
  const [posterReady, setPosterReady] = useState(false);

  const { forceHeroFallback, markHeroSettled } = useSiteEntry();

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_QUERY);

    const updateInteractionMode = () => {
      setDesktopInteractive(mediaQuery.matches);
      setInteractionReady(true);
    };

    updateInteractionMode();
    mediaQuery.addEventListener("change", updateInteractionMode);

    return () => mediaQuery.removeEventListener("change", updateInteractionMode);
  }, []);

  const shouldLoadVideo = interactionReady && desktopInteractive && !forceHeroFallback;
  const scrub = useVideoScrub(heroRef, videoRef, shouldLoadVideo);

  useEffect(() => {
    if (!interactionReady) return;

    const heroIsReady =
      forceHeroFallback ||
      (desktopInteractive ? scrub.mediaReady || scrub.mediaFailed : posterReady);

    if (heroIsReady) markHeroSettled();
  }, [
    desktopInteractive,
    forceHeroFallback,
    interactionReady,
    markHeroSettled,
    posterReady,
    scrub.mediaFailed,
    scrub.mediaReady,
  ]);

  const showVideo = shouldLoadVideo && scrub.mediaReady && !scrub.mediaFailed;

  return (
    <div
      ref={heroRef}
      aria-hidden="true"
      onPointerMove={shouldLoadVideo ? scrub.onPointerMove : undefined}
      className={`hero-media absolute inset-0 z-0 overflow-hidden bg-[radial-gradient(circle_at_72%_32%,color-mix(in_srgb,var(--primary)_14%,transparent),transparent_44%)] ${
        desktopInteractive ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <img
        src={POSTER_SRC}
        alt=""
        draggable={false}
        fetchPriority="high"
        onLoad={() => setPosterReady(true)}
        onError={() => setPosterReady(true)}
        className="absolute inset-0 h-full w-full select-none object-cover object-[72%_center] [-webkit-user-drag:none] md:object-[75%_center] min-[1152px]:object-[70%_center]"
      />

      {shouldLoadVideo && (
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          poster={POSTER_SRC}
          muted
          playsInline
          preload="auto"
          tabIndex={-1}
          className={`pointer-events-none absolute inset-0 z-[1] h-full w-full select-none object-cover object-[72%_center] transition-opacity duration-200 [-webkit-user-drag:none] motion-reduce:transition-none md:object-[75%_center] min-[1152px]:object-[70%_center] ${
            showVideo ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}
