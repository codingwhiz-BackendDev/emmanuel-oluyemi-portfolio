import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { INTRO_TIMING } from "../introTimeline";

const END = INTRO_TIMING.finish / 1000;
const MUTED_STATUS = "Intro sound is muted.";
const READY_STATUS =
  "Intro sound is enabled. If you cannot hear it, check your device volume and tab mute setting.";

type SoundEngine = {
  context: AudioContext;
  master: GainNode;
  sources: Set<AudioScheduledSourceNode>;
  voices: Set<AudioNode>;
  output: Set<AudioNode>;
};

type Voice = {
  at: number;
  duration: number;
  frequency: number;
  endFrequency?: number;
  peak: number;
  type?: OscillatorType | "noise";
  attack?: number;
  release?: number;
  cutoff?: number;
  endCutoff?: number;
};

function stopVoices(engine: SoundEngine) {
  for (const source of engine.sources) {
    source.onended = null;
    try {
      source.stop();
    } catch {
      // stop() can race a source that has already finished.
    }
  }
  for (const node of engine.voices) node.disconnect();
  engine.sources.clear();
  engine.voices.clear();
  engine.master.gain.cancelScheduledValues(engine.context.currentTime);
  engine.master.gain.value = 0;
}

function closeEngine(engine: SoundEngine | null) {
  if (!engine) return;
  engine.context.onstatechange = null;
  stopVoices(engine);
  for (const node of engine.output) node.disconnect();
  engine.output.clear();
  try {
    if (engine.context.state !== "closed") {
      void engine.context.close().catch(() => undefined);
    }
  } catch {
    // Browser teardown must not interrupt React cleanup.
  }
}

function createEngine(context: AudioContext): SoundEngine {
  const output = new Set<AudioNode>();
  try {
    const master = context.createGain();
    output.add(master);
    const highpass = context.createBiquadFilter();
    output.add(highpass);
    const lowpass = context.createBiquadFilter();
    output.add(lowpass);
    const compressor = context.createDynamicsCompressor();
    output.add(compressor);
    // Voices peak at 0.12–0.30, rather than multiplying two near-silent
    // gains. A 0.55 master leaves headroom; filtering removes wasted subbass
    // and brittle highs, and compression controls overlapping chord transients.
    master.gain.value = 0;
    highpass.type = "highpass";
    highpass.frequency.value = 100;
    highpass.Q.value = 0.5;
    lowpass.type = "lowpass";
    lowpass.frequency.value = 6500;
    lowpass.Q.value = 0.5;
    compressor.threshold.value = -14;
    compressor.knee.value = 12;
    compressor.ratio.value = 5;
    compressor.attack.value = 0.004;
    compressor.release.value = 0.18;
    master.connect(highpass);
    highpass.connect(lowpass);
    lowpass.connect(compressor);
    compressor.connect(context.destination);
    return {
      context,
      master,
      sources: new Set(),
      voices: new Set(),
      output,
    };
  } catch (error) {
    for (const node of output) node.disconnect();
    throw error;
  }
}

// An original, finite D-minor/add9 phrase opens into D major at the impact.
// All section boundaries come from the same clock as the visual sequence.
function buildScore(): Voice[] {
  const craft = INTRO_TIMING.craft / 1000;
  const mobile = INTRO_TIMING.mobile / 1000;
  const ai = INTRO_TIMING.ai / 1000;
  const impact = INTRO_TIMING.impact / 1000;
  const reveal = INTRO_TIMING.reveal / 1000;
  const score: Voice[] = [];
  const chords = [
    { at: 0, end: craft, notes: [293.66, 349.23, 440], bass: 146.83 },
    { at: craft, end: mobile, notes: [293.66, 349.23, 523.25], bass: 174.61 },
    { at: mobile, end: ai, notes: [261.63, 349.23, 440], bass: 174.61 },
    { at: ai, end: impact, notes: [293.66, 392, 440], bass: 196 },
    {
      at: impact,
      end: END,
      notes: [293.66, 369.99, 440, 587.33],
      bass: 146.83,
    },
  ];
  for (const chord of chords) {
    const duration = Math.min(END - chord.at, chord.end - chord.at + 0.25);
    for (const frequency of chord.notes) {
      score.push({
        at: chord.at,
        duration,
        frequency,
        peak: 0.12,
        type: "triangle",
        attack: 0.24,
        release: 0.45,
        cutoff: 1800,
      });
    }
    // Sawtooth harmonics at 293 Hz and above keep the bass audible on laptops.
    score.push({
      at: chord.at,
      duration,
      frequency: chord.bass,
      peak: 0.19,
      type: "sawtooth",
      attack: 0.05,
      release: 0.3,
      cutoff: 850,
    });
  }
  for (let step = 0; step * 0.275 < reveal; step += 1) {
    const at = step * 0.275;
    const chord = chords.find((entry) => at < entry.end) ?? chords[4];
    score.push({
      at,
      duration: 0.55,
      frequency: chord.notes[step % chord.notes.length] * 2,
      peak: step % 4 === 0 ? 0.17 : 0.12,
      type: "triangle",
      attack: 0.012,
      release: 0.3,
      cutoff: 3200,
    });
  }
  // Photo: a broad, warm swell, not a subbass-only opening pulse.
  score.push(
    {
      at: 0,
      duration: craft,
      frequency: 587.33,
      peak: 0.2,
      type: "triangle",
      attack: 0.48,
      release: 0.55,
      cutoff: 2000,
    },
    {
      at: 0,
      duration: craft,
      frequency: 740,
      peak: 0.18,
      type: "noise",
      attack: 0.5,
      release: 0.5,
      cutoff: 700,
      endCutoff: 2200,
    },
  );
  for (const offset of [0, 0.275, 0.55, 0.825]) {
    score.push(
      {
        at: craft + offset,
        duration: 0.2,
        frequency: 330,
        endFrequency: 165,
        peak: 0.3,
        type: "triangle",
        cutoff: 1600,
      },
      {
        at: craft + offset,
        duration: 0.12,
        frequency: 1200,
        peak: 0.17,
        type: "noise",
        cutoff: 1600,
      },
    );
  }
  [523.25, 659.25, 783.99, 1046.5].forEach((frequency, index) => {
    score.push({
      at: mobile + index * 0.14,
      duration: 0.68,
      frequency,
      peak: 0.2,
      type: "sine",
      attack: 0.008,
      release: 0.45,
    });
  });
  [587.33, 880, 1174.66, 1760, 1174.66, 880].forEach((frequency, index) => {
    score.push({
      at: ai + index * 0.115,
      duration: 0.65,
      frequency,
      peak: 0.13,
      type: "triangle",
      attack: 0.05,
      release: 0.4,
      cutoff: 3800,
    });
  });
  score.push(
    {
      at: impact,
      duration: 0.55,
      frequency: 293.66,
      endFrequency: 146.83,
      peak: 0.3,
      type: "triangle",
      cutoff: 1800,
    },
    {
      at: impact,
      duration: 0.4,
      frequency: 1000,
      peak: 0.2,
      type: "noise",
      cutoff: 1700,
      endCutoff: 450,
    },
    {
      at: impact,
      duration: 1.5,
      frequency: 1174.66,
      peak: 0.18,
      type: "sine",
      attack: 0.015,
      release: 0.8,
    },
    {
      at: reveal,
      duration: END - reveal,
      frequency: 1000,
      peak: 0.26,
      type: "noise",
      attack: 0.22,
      release: 0.65,
      cutoff: 900,
      endCutoff: 4200,
    },
  );
  return score;
}

const SCORE = buildScore();

function scheduleVoice(
  engine: SoundEngine,
  voice: Voice,
  elapsed: number,
  now: number,
) {
  const duration = Math.min(voice.duration, END - voice.at);
  const offset = Math.max(0, elapsed - voice.at);
  if (duration <= offset) return;
  const { context } = engine;
  const start = now + Math.max(0, voice.at - elapsed);
  const remaining = duration - offset;
  const source =
    voice.type === "noise"
      ? context.createBufferSource()
      : context.createOscillator();
  engine.sources.add(source);
  engine.voices.add(source);
  const filter = context.createBiquadFilter();
  engine.voices.add(filter);
  const envelope = context.createGain();
  engine.voices.add(envelope);
  const nodes = [source, filter, envelope];
  if ("buffer" in source) {
    const buffer = context.createBuffer(
      1,
      Math.ceil(context.sampleRate * remaining),
      context.sampleRate,
    );
    const samples = buffer.getChannelData(0);
    for (let index = 0; index < samples.length; index += 1) {
      samples[index] = Math.random() * 2 - 1;
    }
    source.buffer = buffer;
    filter.type = "bandpass";
  } else {
    source.type =
      voice.type === "noise" ? "triangle" : (voice.type ?? "triangle");
    const endFrequency = voice.endFrequency ?? voice.frequency;
    source.frequency.setValueAtTime(
      voice.frequency * (endFrequency / voice.frequency) ** (offset / duration),
      start,
    );
    source.frequency.exponentialRampToValueAtTime(
      endFrequency,
      start + remaining,
    );
    filter.type = "lowpass";
  }
  const cutoff = voice.cutoff ?? 4500;
  const endCutoff = voice.endCutoff ?? cutoff;
  filter.Q.value = 0.65;
  filter.frequency.setValueAtTime(
    cutoff * (endCutoff / cutoff) ** (offset / duration),
    start,
  );
  filter.frequency.exponentialRampToValueAtTime(endCutoff, start + remaining);
  source.connect(filter);
  filter.connect(envelope);
  envelope.connect(engine.master);

  const attack = Math.min(voice.attack ?? 0.008, duration * 0.25);
  const decay = Math.min(0.12, duration * 0.15);
  const release = Math.min(voice.release ?? duration * 0.55, duration * 0.45);
  const points = [
    { time: 0, value: 0 },
    { time: attack, value: voice.peak },
    { time: attack + decay, value: voice.peak * 0.7 },
    { time: duration - release, value: voice.peak * 0.7 },
    { time: duration, value: 0 },
  ];
  envelope.gain.setValueAtTime(0, start);
  if (offset > 0) {
    // Re-enter sustained notes immediately when enabling midway through a scene,
    // preserving their remaining envelope instead of replaying missed attacks.
    const entry = Math.min(offset + 0.015, duration);
    const next = points.findIndex((point) => point.time >= entry);
    const right = points[Math.max(1, next)];
    const left = points[Math.max(1, next) - 1];
    const value =
      left.value +
      (right.value - left.value) *
        ((entry - left.time) / (right.time - left.time));
    envelope.gain.linearRampToValueAtTime(value, start + entry - offset);
    for (const point of points) {
      if (point.time > entry) {
        envelope.gain.linearRampToValueAtTime(
          point.value,
          start + point.time - offset,
        );
      }
    }
  } else {
    for (const point of points.slice(1)) {
      envelope.gain.linearRampToValueAtTime(point.value, start + point.time);
    }
  }
  source.onended = () => {
    engine.sources.delete(source);
    for (const node of nodes) {
      node.disconnect();
      engine.voices.delete(node);
    }
  };
  source.start(start);
  source.stop(start + remaining);
}

export function useIntroSound(): {
  soundEnabled: boolean;
  soundStatus: string;
  enableSound: () => Promise<boolean>;
  muteSound: () => void;
  startSoundtrack: (elapsedSeconds?: number) => void;
  stopSoundtrack: () => void;
} {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [soundStatus, setSoundStatus] = useState(MUTED_STATUS);
  const mountedRef = useRef(false);
  const engineRef = useRef<SoundEngine | null>(null);
  const generationRef = useRef(0);
  const pendingRef = useRef<Promise<boolean> | null>(null);
  const cancelResumeRef = useRef<(() => void) | null>(null);

  const releaseAudio = useCallback(() => {
    generationRef.current += 1;
    const cancelResume = cancelResumeRef.current;
    cancelResumeRef.current = null;
    cancelResume?.();
    pendingRef.current = null;
    const engine = engineRef.current;
    engineRef.current = null;
    closeEngine(engine);
  }, []);

  const stopSoundtrack = useCallback(() => {
    releaseAudio();
    if (mountedRef.current) {
      setSoundEnabled(false);
      setSoundStatus(MUTED_STATUS);
    }
  }, [releaseAudio]);

  const enableSound = useCallback((): Promise<boolean> => {
    if (!mountedRef.current) return Promise.resolve(false);
    if (pendingRef.current) return pendingRef.current;
    const generation = ++generationRef.current;
    let context: AudioContext | undefined;
    try {
      const audioWindow = window as Window & {
        AudioContext?: typeof AudioContext;
        webkitAudioContext?: typeof AudioContext;
      };
      const Context =
        audioWindow.AudioContext ?? audioWindow.webkitAudioContext;
      if (!Context) {
        setSoundEnabled(false);
        setSoundStatus(
          "Web Audio is unavailable. Try Enter with sound in a current Chrome, Edge, Firefox, or Safari browser.",
        );
        return Promise.resolve(false);
      }
      if (engineRef.current?.context.state === "closed") {
        closeEngine(engineRef.current);
        engineRef.current = null;
      }
      const activeContext: AudioContext =
        engineRef.current?.context ?? new Context();
      context = activeContext;
      // Both creation and resume execute on the original click stack, before
      // any await/then. Enabling never schedules a source or starts the score.
      const resumed = activeContext.resume();
      // Attach rejection handling immediately, even if graph construction fails.
      const running = resumed.then(
        () => activeContext.state === "running",
        () => false,
      );
      const engine = engineRef.current ?? createEngine(activeContext);
      engineRef.current = engine;
      activeContext.onstatechange = () => {
        if (!mountedRef.current || engineRef.current !== engine) return;
        if (engine.context.state !== "running") {
          stopVoices(engine);
          setSoundEnabled(false);
          setSoundStatus(
            "Audio was interrupted. Click Enter with sound or the sound button again; check your device audio output.",
          );
        }
      };
      setSoundEnabled(activeContext.state === "running");
      setSoundStatus("Enabling intro sound…");
      // A blocked browser may leave resume() pending indefinitely. Bound the
      // parent's gate wait, and also settle it immediately on mute/unmount.
      const boundedResume = new Promise<boolean | "timeout">((resolve) => {
        let settled = false;
        const finish = (result: boolean | "timeout") => {
          if (settled) return;
          settled = true;
          window.clearTimeout(timeout);
          if (cancelResumeRef.current === cancel) {
            cancelResumeRef.current = null;
          }
          resolve(result);
        };
        const cancel = () => finish(false);
        const timeout = window.setTimeout(() => finish("timeout"), 2500);
        cancelResumeRef.current = cancel;
        void running.then(finish);
      });
      const pending = boundedResume.then((result) => {
        if (
          !mountedRef.current ||
          generation !== generationRef.current ||
          engineRef.current !== engine
        ) {
          return false;
        }
        pendingRef.current = null;
        if (result !== true || engine.context.state !== "running") {
          releaseAudio();
          setSoundEnabled(false);
          setSoundStatus(
            result === "timeout"
              ? "Audio did not start in time. Retry Enter with sound, allow sound in this site's browser settings, or start without sound."
              : "Your browser blocked audio. Retry Enter with sound and allow sound in this site's browser settings, or start without sound.",
          );
          return false;
        }
        setSoundEnabled(true);
        setSoundStatus(READY_STATUS);
        return true;
      });
      pendingRef.current = pending;
      return pending;
    } catch {
      // Also close a context whose graph could not be constructed.
      if (context && engineRef.current?.context !== context) {
        try {
          void context.close().catch(() => undefined);
        } catch {
          // Some browsers throw if creation itself was interrupted.
        }
      }
      releaseAudio();
      setSoundEnabled(false);
      setSoundStatus(
        "Audio could not be enabled. Click Enter with sound again, allow site audio, or try another browser.",
      );
      return Promise.resolve(false);
    }
  }, [releaseAudio]);

  const startSoundtrack = useCallback(
    (elapsedSeconds = 0) => {
      if (!mountedRef.current) return;
      const engine = engineRef.current;
      if (!engine || engine.context.state !== "running") {
        setSoundEnabled(false);
        setSoundStatus(
          "Click Enter with sound or the sound button to enable audio before starting the soundtrack.",
        );
        return;
      }
      // Restart only the finite score, retaining the context unlocked by the click.
      stopVoices(engine);
      const elapsed = Number.isFinite(elapsedSeconds)
        ? Math.max(0, elapsedSeconds)
        : END;
      if (elapsed >= END) return;
      try {
        const now = engine.context.currentTime;
        const remaining = END - elapsed;
        engine.master.gain.setValueAtTime(0, now);
        engine.master.gain.linearRampToValueAtTime(
          0.55,
          now + Math.min(0.015, remaining / 4),
        );
        engine.master.gain.setValueAtTime(
          0.55,
          now + Math.max(remaining / 2, remaining - 0.2),
        );
        engine.master.gain.linearRampToValueAtTime(0, now + remaining);
        for (const voice of SCORE) scheduleVoice(engine, voice, elapsed, now);
        setSoundEnabled(true);
        setSoundStatus(READY_STATUS);
      } catch {
        releaseAudio();
        setSoundEnabled(false);
        setSoundStatus(
          "The soundtrack could not start. Click the sound button to retry, or continue muted.",
        );
      }
    },
    [releaseAudio],
  );

  useLayoutEffect(() => {
    // Registered inside the hook before the parent's layout effect, including
    // Strict Mode's setup/cleanup/setup cycle. No audio is created on mount.
    mountedRef.current = true;
    setSoundEnabled(false);
    setSoundStatus(MUTED_STATUS);
    return () => {
      mountedRef.current = false;
      releaseAudio();
    };
  }, [releaseAudio]);

  return {
    soundEnabled,
    soundStatus,
    enableSound,
    muteSound: stopSoundtrack,
    startSoundtrack,
    stopSoundtrack,
  };
}
