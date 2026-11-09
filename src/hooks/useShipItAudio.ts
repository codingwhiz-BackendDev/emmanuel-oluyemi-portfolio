import { useCallback, useLayoutEffect, useRef, useState } from "react";

export type ShipItEffect =
  "jump" | "double-jump" | "commit" | "coffee" | "crash";
export interface ShipItAudio {
  soundEnabled: boolean;
  soundStatus: string;
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  playEffect: (effect: ShipItEffect) => void;
  toggleSound: () => void;
}

const EFFECTS: ShipItEffect[] = [
  "jump",
  "double-jump",
  "commit",
  "coffee",
  "crash",
];
const READY = "Sound ready. Press Start to hear the game soundtrack.";
const MUTED = "Sound muted. Use the sound button to enable it.";
const asset = (name: string) =>
  `${import.meta.env.BASE_URL}audio/ship-it-${name}.wav`;

// No media, context, request, or timer is created until an intentional Start.
function createAudio(notify: (enabled: boolean, status: string) => void) {
  let mounted = false;
  let phase: "ready" | "running" | "paused" = "ready";
  let preferred = true;
  let failed = false;
  let confirmed = false;
  let resetOnNextPlay = false;
  let music: HTMLAudioElement | null = null;
  let context: AudioContext | null = null;
  let gain: GainNode | null = null;
  let loading: Promise<void> | null = null;
  let generation = 0;
  let playback = 0;
  let playTimer: ReturnType<typeof setTimeout> | undefined;
  const buffers = new Map<ShipItEffect, AudioBuffer>();
  const sources = new Set<AudioBufferSourceNode>();
  const requests = new Map<AbortController, ReturnType<typeof setTimeout>>();

  const publish = (enabled: boolean, status: string) => {
    if (mounted) notify(enabled, status);
  };
  const wantsMusic = () =>
    mounted && phase === "running" && preferred && !failed;
  const cancelPlay = () => {
    playback += 1;
    clearTimeout(playTimer);
    playTimer = undefined;
  };
  const stopEffects = () => {
    for (const source of sources) {
      source.onended = null;
      try {
        source.stop();
      } catch {
        /* Already ended. */
      }
      source.disconnect();
    }
    sources.clear();
  };
  const release = () => {
    generation += 1;
    cancelPlay();
    stopEffects();
    for (const [request, timer] of requests) {
      clearTimeout(timer);
      request.abort();
    }
    requests.clear();
    if (music) {
      music.onplaying = null;
      music.onerror = null;
      music.pause();
      music.removeAttribute("src");
      music.load();
      music = null;
    }
    if (context) {
      const oldContext = context;
      context = null;
      oldContext.onstatechange = null;
      // close() can reject if the browser has already closed the context.
      try {
        void oldContext.close().catch(() => {});
      } catch {
        /* Already closed. */
      }
    }
    gain?.disconnect();
    gain = null;
    buffers.clear();
    loading = null;
    confirmed = false;
  };
  const fail = (error?: unknown) => {
    failed = true;
    release();
    const blocked = error instanceof Error && error.name === "NotAllowedError";
    publish(
      false,
      blocked
        ? "Browser blocked game audio. Allow sound for this site, then tap the sound button to retry."
        : "Game audio could not load or play. Check your connection, then tap the sound button to retry. You can keep playing silently.",
    );
  };
  const restingStatus = () => {
    if (!preferred) publish(false, MUTED);
    else if (failed)
      publish(
        false,
        "Game audio unavailable. Tap the sound button to retry; the game can continue silently.",
      );
    else
      publish(
        true,
        phase === "ready"
          ? READY
          : "Game audio paused. Resume to continue the soundtrack.",
      );
  };

  const prepare = () => {
    if (music && context && loading) return;
    const epoch = generation;
    music = new Audio(asset("music"));
    music.preload = "auto";
    music.loop = true;
    music.volume = 0.55;
    const element = music;
    element.onplaying = () => {
      // A late native media event must never override pause/mute/unmount.
      if (music !== element || !wantsMusic()) element.pause();
    };
    element.onerror = () => {
      if (mounted && generation === epoch && preferred) fail();
    };
    const AudioContextClass =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextClass) throw new Error("Web Audio unavailable");
    const ctx = new AudioContextClass({ latencyHint: "interactive" });
    context = ctx;
    gain = ctx.createGain();
    gain.gain.value = 0.85;
    gain.connect(ctx.destination);
    ctx.onstatechange = () => {
      if (
        generation === epoch &&
        confirmed &&
        wantsMusic() &&
        ctx.state !== "running"
      )
        fail();
    };
    loading = Promise.all(
      EFFECTS.map(async (effect) => {
        const request = new AbortController();
        const timer = setTimeout(() => request.abort(), 8000);
        requests.set(request, timer);
        try {
          const response = await fetch(asset(effect), {
            signal: request.signal,
          });
          if (!response.ok) throw new Error(`Audio HTTP ${response.status}`);
          const data = await response.arrayBuffer();
          if (generation !== epoch) return;
          const buffer = await ctx.decodeAudioData(data);
          if (generation === epoch) buffers.set(effect, buffer);
        } finally {
          clearTimeout(timer);
          requests.delete(request);
        }
      }),
    ).then(() => {});
    // Observe failures even if a synchronous play()/resume() error interrupts begin().
    void loading.catch((error: unknown) => {
      if (mounted && generation === epoch && preferred && !failed) fail(error);
    });
  };

  const begin = (restart: boolean) => {
    if (!mounted || !preferred || phase !== "running") return;
    cancelPlay();
    const token = playback;
    failed = false;
    confirmed = false;
    publish(false, "Loading game audio… Use the sound button to mute.");
    try {
      prepare();
      const element = music!;
      const ctx = context!;
      if (restart || resetOnNextPlay) element.currentTime = 0;
      resetOnNextPlay = false;
      // Both calls happen in the original click stack, before any await/then.
      const resumed = ctx.resume();
      // Attach a rejection handler before calling another potentially throwing API.
      void resumed.catch((error: unknown) => {
        if (mounted && playback === token && wantsMusic()) fail(error);
      });
      const playing = element.play();
      playTimer = setTimeout(() => {
        if (playback === token && wantsMusic())
          fail(new Error("Audio loading timed out"));
      }, 8000);
      void Promise.all([playing, resumed, loading]).then(
        () => {
          if (playback !== token || !wantsMusic()) {
            if (music !== element || !wantsMusic()) element.pause();
            return;
          }
          clearTimeout(playTimer);
          playTimer = undefined;
          if (element.paused || ctx.state !== "running") {
            fail();
            return;
          }
          confirmed = true;
          publish(
            true,
            "Game soundtrack and effects on. Use the sound button to mute.",
          );
        },
        (error: unknown) => {
          if (mounted && playback === token && wantsMusic()) fail(error);
        },
      );
    } catch (error) {
      fail(error);
    }
  };

  return {
    mount() {
      mounted = true;
    },
    dispose() {
      mounted = false;
      phase = "ready";
      release();
    },
    start() {
      if (!mounted) return;
      phase = "running";
      resetOnNextPlay = true;
      cancelPlay();
      music?.pause();
      stopEffects();
      if (preferred) begin(true);
      else publish(false, MUTED);
    },
    pause() {
      if (!mounted || phase === "ready") return;
      phase = "paused";
      cancelPlay();
      music?.pause();
      stopEffects();
      restingStatus();
    },
    resume() {
      if (!mounted || phase !== "paused") return;
      phase = "running";
      if (preferred) begin(false);
      else publish(false, MUTED);
    },
    stop() {
      if (!mounted) return;
      phase = "ready";
      release();
      restingStatus();
    },
    playEffect(effect: ShipItEffect) {
      if (
        !mounted ||
        !preferred ||
        failed ||
        phase === "ready" ||
        (phase === "paused" && effect !== "crash")
      )
        return;
      const buffer = buffers.get(effect);
      if (!context || context.state !== "running" || !gain || !buffer) return;
      try {
        // Bound polyphony even if a caller accidentally emits effects every frame.
        if (sources.size >= 12) {
          const oldest = sources.values().next().value as AudioBufferSourceNode;
          oldest.onended = null;
          oldest.stop();
          oldest.disconnect();
          sources.delete(oldest);
        }
        const source = context.createBufferSource();
        source.buffer = buffer;
        source.connect(gain);
        source.onended = () => {
          source.disconnect();
          sources.delete(source);
        };
        sources.add(source);
        source.start();
      } catch (error) {
        fail(error);
      }
    },
    toggleSound() {
      if (!mounted) return;
      // A failure presents an Off state; the next click retries rather than muting.
      preferred = failed ? true : !preferred;
      if (!preferred) {
        cancelPlay();
        music?.pause();
        stopEffects();
        publish(false, MUTED);
      } else {
        failed = false;
        if (phase === "running") begin(false);
        else restingStatus();
      }
    },
  };
}

/**
 * Call start/resume/toggleSound directly from user gestures (not a delayed effect).
 * soundEnabled is the sound preference while ready, confirmed availability while
 * active, and false during loading/failure/mute. soundStatus explains each state.
 * Mounting is silent; pause preserves position and permits only the crash SFX.
 * All actions retain their identity across renders, including mute/status changes.
 */
export function useShipItAudio(): ShipItAudio {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundStatus, setSoundStatus] = useState(READY);
  const runtime = useRef<ReturnType<typeof createAudio> | null>(null);
  if (!runtime.current) {
    runtime.current = createAudio((enabled, status) => {
      setSoundEnabled(enabled);
      setSoundStatus(status);
    });
  }
  useLayoutEffect(() => {
    const audio = runtime.current!;
    audio.mount();
    return () => audio.dispose();
  }, []);
  const start = useCallback(() => runtime.current!.start(), []);
  const pause = useCallback(() => runtime.current!.pause(), []);
  const resume = useCallback(() => runtime.current!.resume(), []);
  const stop = useCallback(() => runtime.current!.stop(), []);
  const playEffect = useCallback(
    (effect: ShipItEffect) => runtime.current!.playEffect(effect),
    [],
  );
  const toggleSound = useCallback(() => runtime.current!.toggleSound(), []);
  return {
    soundEnabled,
    soundStatus,
    start,
    pause,
    resume,
    stop,
    playEffect,
    toggleSound,
  };
}
