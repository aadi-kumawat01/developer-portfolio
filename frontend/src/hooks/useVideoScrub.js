"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const clamp01 = (value) => Math.min(1, Math.max(0, value));

function clampMediaTime(time, duration) {
  const end = Math.max(0, duration - 0.001);
  return Math.min(end, Math.max(0, time));
}

export function useVideoScrub(heroRef, videoRef, enabled) {
  const [mediaReady, setMediaReady] = useState(false);
  const [mediaFailed, setMediaFailed] = useState(false);

  const reducedMotion = useRef(false);
  const enabledRef = useRef(enabled);
  const mediaReadyRef = useRef(false);
  const targetTime = useRef(0);
  const animationFrame = useRef(null);

  const stopAnimationFrame = useCallback(() => {
    if (animationFrame.current !== null) {
      cancelAnimationFrame(animationFrame.current);
    }

    animationFrame.current = null;
  }, []);

  const moveTowardTarget = useCallback(() => {
    if (animationFrame.current !== null) return;

    animationFrame.current = requestAnimationFrame(() => {
      animationFrame.current = null;

      const video = videoRef.current;

      if (
        !video ||
        !enabledRef.current ||
        !mediaReadyRef.current ||
        reducedMotion.current ||
        !Number.isFinite(video.duration) ||
        video.duration <= 0
      ) {
        return;
      }

      const difference = targetTime.current - video.currentTime;

      if (Math.abs(difference) < 0.018 || video.seeking) return;

      const nextTime = clampMediaTime(
        video.currentTime + difference * 0.24,
        video.duration,
      );

      try {
        video.currentTime = nextTime;
      } catch {
        // Ignore transient seek failures while media is changing state.
      }
    });
  }, [videoRef]);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncMotionPreference = () => {
      reducedMotion.current = motionQuery.matches;

      if (motionQuery.matches) {
        stopAnimationFrame();
      }
    };

    syncMotionPreference();
    motionQuery.addEventListener("change", syncMotionPreference);

    return () => {
      motionQuery.removeEventListener("change", syncMotionPreference);
      stopAnimationFrame();
    };
  }, [stopAnimationFrame]);

  useEffect(() => {
    enabledRef.current = enabled;

    if (!enabled) {
      stopAnimationFrame();
      mediaReadyRef.current = false;
      const resetTimer = window.setTimeout(() => {
        setMediaReady(false);
        setMediaFailed(false);
      }, 0);

      return () => window.clearTimeout(resetTimer);
    }
  }, [enabled, stopAnimationFrame]);

  useEffect(() => {
    if (!enabled) return;

    const video = videoRef.current;
    if (!video) return;

    let disposed = false;
    let initialized = false;
    let firstPaintFrame = null;
    let secondPaintFrame = null;

    const cancelPaintFrames = () => {
      if (firstPaintFrame !== null) cancelAnimationFrame(firstPaintFrame);
      if (secondPaintFrame !== null) cancelAnimationFrame(secondPaintFrame);

      firstPaintFrame = null;
      secondPaintFrame = null;
    };

    const markReadyAfterPaint = () => {
      if (disposed || mediaReadyRef.current || video.seeking) return;
      if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;

      cancelPaintFrames();

      firstPaintFrame = requestAnimationFrame(() => {
        secondPaintFrame = requestAnimationFrame(() => {
          if (
            disposed ||
            video.seeking ||
            video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA
          ) {
            return;
          }

          mediaReadyRef.current = true;
          setMediaFailed(false);
          setMediaReady(true);
        });
      });
    };

    const initializeVideo = () => {
      if (
        initialized ||
        disposed ||
        !Number.isFinite(video.duration) ||
        video.duration <= 0
      ) {
        return;
      }

      initialized = true;
      mediaReadyRef.current = false;
      setMediaReady(false);
      setMediaFailed(false);

      targetTime.current = clampMediaTime(video.duration / 2, video.duration);

      try {
        const alreadyAtTarget =
          Math.abs(video.currentTime - targetTime.current) < 0.012;

        if (alreadyAtTarget) {
          markReadyAfterPaint();
        } else {
          video.currentTime = targetTime.current;
        }
      } catch {
        initialized = false;
      }
    };

    const handleLoadStart = () => {
      initialized = false;
      mediaReadyRef.current = false;
      setMediaReady(false);
      setMediaFailed(false);
    };

    const handleLoadedMetadata = () => {
      setMediaFailed(false);
      initializeVideo();
    };

    const handleLoadedData = () => {
      if (!initialized) initializeVideo();
      if (initialized && !video.seeking) markReadyAfterPaint();
    };

    const handleSeeked = () => {
      if (!mediaReadyRef.current) {
        markReadyAfterPaint();
      } else {
        moveTowardTarget();
      }
    };

    const handleError = () => {
      if (video.error?.code === MediaError.MEDIA_ERR_ABORTED) return;

      stopAnimationFrame();
      cancelPaintFrames();
      mediaReadyRef.current = false;
      setMediaReady(false);
      setMediaFailed(true);

      if (process.env.NODE_ENV !== "production") {
        console.warn("Hero video fallback", {
          src: video.currentSrc || video.src,
          readyState: video.readyState,
          duration: video.duration,
          code: video.error?.code,
        });
      }
    };

    video.addEventListener("loadstart", handleLoadStart);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("seeked", handleSeeked);
    video.addEventListener("error", handleError);

    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
      initializeVideo();
    }

    if (
      video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
      !video.seeking
    ) {
      markReadyAfterPaint();
    }

    return () => {
      disposed = true;
      cancelPaintFrames();
      stopAnimationFrame();

      video.removeEventListener("loadstart", handleLoadStart);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("seeked", handleSeeked);
      video.removeEventListener("error", handleError);
    };
  }, [enabled, moveTowardTarget, stopAnimationFrame, videoRef]);

  const updateProgress = useCallback(
    (clientX) => {
      const hero = heroRef.current;
      const video = videoRef.current;

      if (
        !hero ||
        !video ||
        !enabledRef.current ||
        !mediaReadyRef.current ||
        reducedMotion.current ||
        !Number.isFinite(video.duration) ||
        video.duration <= 0
      ) {
        return;
      }

      const bounds = hero.getBoundingClientRect();
      if (bounds.width <= 0) return;

      const progress = clamp01((clientX - bounds.left) / bounds.width);
      targetTime.current = clampMediaTime(progress * video.duration, video.duration);
      moveTowardTarget();
    },
    [heroRef, moveTowardTarget, videoRef],
  );

  const onPointerMove = useCallback(
    (event) => {
      if (event.pointerType === "touch") return;
      updateProgress(event.clientX);
    },
    [updateProgress],
  );

  return { mediaReady, mediaFailed, onPointerMove };
}
