import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { INTRO_TIMING } from "../introTimeline";

const MUTED_STATUS = "Choose Enter with sound to hear the original soundtrack.";
const READY_STATUS = "Soundtrack playing. Use the sound button to mute.";

function playbackError(error: unknown, audio: HTMLAudioElement): string {
  if (error instanceof DOMException && error.name === "NotAllowedError") {
    return "Your browser blocked playback. Allow sound for this site, then tap Enter with sound again.";
  }
  if (audio.error?.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
    return "The soundtrack is unavailable. Refresh the page to load the latest audio file, or enter silently.";
  }
  return "The soundtrack could not load or play. Check your connection and retry, or enter silently.";
}

export function useIntroSound() {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [soundStatus, setSoundStatus] = useState(MUTED_STATUS);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mountedRef = useRef(false);
  const generationRef = useRef(0);
  const cancelPlayRef = useRef<(() => void) | null>(null);

  const stopSoundtrack = useCallback(() => {
    generationRef.current += 1;
    cancelPlayRef.current?.();
    cancelPlayRef.current = null;
    audioRef.current?.pause();
    if (mountedRef.current) {
      setSoundEnabled(false);
      setSoundStatus("Intro sound is muted.");
    }
  }, []);

  // This function deliberately calls play() before any await: the native media
  // element receives the original button gesture, including on mobile Safari.
  const enableSound = useCallback((elapsedSeconds = 0): Promise<boolean> => {
    const audio = audioRef.current;
    if (!mountedRef.current || !audio) return Promise.resolve(false);
    cancelPlayRef.current?.();
    const generation = ++generationRef.current;
    setSoundEnabled(false);
    setSoundStatus("Loading soundtrack…");

    try {
      if (audio.error) audio.load();
      audio.muted = false;
      audio.volume = 0.9;
      audio.currentTime = Math.max(
        0,
        Math.min(elapsedSeconds, INTRO_TIMING.finish / 1000 - 0.05),
      );
      const playback = audio.play();
      return new Promise<boolean>((resolve) => {
        let settled = false;
        const finish = (success: boolean, error?: unknown) => {
          if (settled) return;
          settled = true;
          window.clearTimeout(timeout);
          if (cancelPlayRef.current === cancel) cancelPlayRef.current = null;
          if (!mountedRef.current || generation !== generationRef.current) {
            resolve(false);
            return;
          }
          const playing = success && !audio.paused && !audio.ended;
          if (!playing) audio.pause();
          setSoundEnabled(playing);
          setSoundStatus(playing ? READY_STATUS : playbackError(error, audio));
          resolve(playing);
        };
        const cancel = () => finish(false);
        const timeout = window.setTimeout(() => finish(false), 8000);
        cancelPlayRef.current = cancel;
        void playback.then(
          () => finish(true),
          (error: unknown) => finish(false, error),
        );
      });
    } catch (error) {
      audio.pause();
      setSoundEnabled(false);
      setSoundStatus(playbackError(error, audio));
      return Promise.resolve(false);
    }
  }, []);

  useLayoutEffect(() => {
    mountedRef.current = true;
    // Preload the real audio asset without autoplaying. A native media element
    // avoids relying on a running AudioContext as evidence of audible playback.
    const audio = new Audio(`${import.meta.env.BASE_URL}audio/intro.wav`);
    audio.preload = "auto";
    audio.loop = false;
    audioRef.current = audio;
    const onPause = () => {
      if (!mountedRef.current || audioRef.current !== audio) return;
      setSoundEnabled(false);
    };
    const onError = () => {
      if (!mountedRef.current || audioRef.current !== audio) return;
      setSoundEnabled(false);
      setSoundStatus(playbackError(null, audio));
    };
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onPause);
    audio.addEventListener("error", onError);
    audio.load();
    return () => {
      mountedRef.current = false;
      generationRef.current += 1;
      cancelPlayRef.current?.();
      cancelPlayRef.current = null;
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onPause);
      audio.removeEventListener("error", onError);
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      if (audioRef.current === audio) audioRef.current = null;
    };
  }, []);

  return {
    soundEnabled,
    soundStatus,
    enableSound,
    muteSound: stopSoundtrack,
    stopSoundtrack,
  };
}
