import { useCallback, useLayoutEffect, useRef, useState } from "react";

const INTRO_DURATION = 5.6;
const MUTED_STATUS = "Intro sound is muted.";

type SoundEngine = {
  context: AudioContext;
  master: GainNode;
  sources: Set<AudioScheduledSourceNode>;
  nodes: Set<AudioNode>;
};

function closeEngine(engine: SoundEngine | null) {
  if (!engine) return;
  for (const source of engine.sources) {
    source.onended = null;
    try {
      source.stop();
    } catch {
      // A source may already have ended while cleanup was requested.
    }
  }
  for (const node of engine.nodes) node.disconnect();
  engine.sources.clear();
  engine.nodes.clear();
  try {
    if (engine.context.state !== "closed") {
      void engine.context.close().catch(() => undefined);
    }
  } catch {
    // Cleanup must also be safe when the browser has already torn audio down.
  }
}

function connectVoice(
  engine: SoundEngine,
  source: AudioScheduledSourceNode,
  filter: BiquadFilterNode,
  envelope: GainNode,
  start: number,
  duration: number,
  peak: number,
  attack: number,
) {
  source.connect(filter);
  filter.connect(envelope);
  envelope.connect(engine.master);
  envelope.gain.setValueAtTime(0, start);
  envelope.gain.linearRampToValueAtTime(peak, start + attack);
  envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration - 0.01);
  envelope.gain.linearRampToValueAtTime(0, start + duration);

  engine.sources.add(source);
  const nodes = [source, filter, envelope];
  for (const node of nodes) engine.nodes.add(node);
  source.onended = () => {
    engine.sources.delete(source);
    for (const node of nodes) {
      node.disconnect();
      engine.nodes.delete(node);
    }
  };
  source.start(start);
  source.stop(start + duration);
}

function tone(
  engine: SoundEngine,
  start: number,
  frequency: number,
  duration: number,
  peak = 0.12,
  type: "sine" | "triangle" = "sine",
  endFrequency = frequency,
) {
  const { context } = engine;
  const oscillator = context.createOscillator();
  const filter = context.createBiquadFilter();
  const envelope = context.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  oscillator.frequency.exponentialRampToValueAtTime(
    endFrequency,
    start + duration,
  );
  filter.type = "lowpass";
  filter.frequency.value = Math.min(2400, frequency * 3);
  filter.Q.value = 0.45;
  connectVoice(
    engine,
    oscillator,
    filter,
    envelope,
    start,
    duration,
    peak,
    Math.min(0.035, duration * 0.2),
  );
}

function sweep(engine: SoundEngine, start: number) {
  const { context } = engine;
  const duration = 0.7;
  const buffer = context.createBuffer(
    1,
    Math.ceil(context.sampleRate * duration),
    context.sampleRate,
  );
  const samples = buffer.getChannelData(0);
  for (let index = 0; index < samples.length; index += 1) {
    samples[index] = Math.random() * 2 - 1;
  }
  const source = context.createBufferSource();
  source.buffer = buffer;
  const filter = context.createBiquadFilter();
  filter.type = "lowpass";
  filter.Q.value = 0.4;
  filter.frequency.setValueAtTime(260, start);
  filter.frequency.exponentialRampToValueAtTime(1500, start + 0.3);
  filter.frequency.exponentialRampToValueAtTime(180, start + duration);
  connectVoice(
    engine,
    source,
    filter,
    context.createGain(),
    start,
    duration,
    0.13,
    0.2,
  );
}

const CUES: ReadonlyArray<{
  at: number;
  play: (engine: SoundEngine, start: number) => void;
}> = [
  {
    at: 0.05,
    play: (engine, start) => tone(engine, start, 95, 0.55, 0.2, "sine", 48),
  },
  {
    at: 0.7,
    play: (engine, start) =>
      tone(engine, start, 720, 0.09, 0.08, "triangle", 540),
  },
  {
    at: 0.9,
    play: (engine, start) =>
      tone(engine, start, 330, 0.1, 0.09, "triangle", 220),
  },
  {
    at: 1.3,
    play: (engine, start) => {
      tone(engine, start, 660, 0.38, 0.09);
      tone(engine, start + 0.045, 990, 0.3, 0.04);
    },
  },
  {
    at: 1.7,
    play: (engine, start) =>
      tone(engine, start, 440, 0.12, 0.07, "triangle", 300),
  },
  {
    at: 2.05,
    play: (engine, start) => {
      [880, 1100, 1320].forEach((frequency, index) => {
        tone(engine, start + index * 0.055, frequency, 0.48, 0.035);
      });
    },
  },
  {
    at: 3.1,
    play: (engine, start) => {
      [130.81, 196, 261.63, 329.63].forEach((frequency) => {
        tone(engine, start, frequency, 1.05, 0.055, "triangle");
      });
    },
  },
  { at: 4.55, play: sweep },
];

function scheduleRemaining(engine: SoundEngine, elapsedSeconds: number) {
  if (elapsedSeconds >= INTRO_DURATION) return;
  const now = engine.context.currentTime;
  for (const cue of CUES) {
    // Never replay a cue whose onset has passed, even if its tail would remain.
    if (cue.at >= elapsedSeconds) {
      cue.play(engine, now + cue.at - elapsedSeconds);
    }
  }
}

export function useIntroSound(): {
  soundEnabled: boolean;
  soundStatus: string;
  toggleSound: (elapsedSeconds: number) => Promise<void>;
  startSoundtrack: () => void;
  stopSoundtrack: () => void;
} {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [soundStatus, setSoundStatus] = useState(MUTED_STATUS);
  const mountedRef = useRef(false);
  const engineRef = useRef<SoundEngine | null>(null);
  const enabledRef = useRef(false);
  const pendingRef = useRef(false);
  const generationRef = useRef(0);
  const timelineStartRef = useRef<number | null>(null);

  const releaseAudio = useCallback(() => {
    generationRef.current += 1;
    pendingRef.current = false;
    enabledRef.current = false;
    const engine = engineRef.current;
    engineRef.current = null;
    closeEngine(engine);
  }, []);

  const stopSoundtrack = useCallback(() => {
    timelineStartRef.current = null;
    releaseAudio();
    if (mountedRef.current) {
      setSoundEnabled(false);
      setSoundStatus(MUTED_STATUS);
    }
  }, [releaseAudio]);

  const startSoundtrack = useCallback(() => {
    if (!mountedRef.current || timelineStartRef.current !== null) return;
    timelineStartRef.current = performance.now();
    const engine = engineRef.current;
    if (!enabledRef.current || !engine) return;
    try {
      scheduleRemaining(engine, 0);
    } catch {
      releaseAudio();
      setSoundEnabled(false);
      setSoundStatus(
        "Intro sound could not be played. You can try enabling it again.",
      );
    }
  }, [releaseAudio]);

  const toggleSound = useCallback(
    async (elapsedSeconds: number): Promise<void> => {
      if (!mountedRef.current) return;
      if (enabledRef.current || pendingRef.current) {
        releaseAudio();
        setSoundEnabled(false);
        setSoundStatus(MUTED_STATUS);
        return;
      }

      const audioWindow = window as Window & {
        AudioContext?: typeof AudioContext;
        webkitAudioContext?: typeof AudioContext;
      };
      const Context =
        audioWindow.AudioContext ?? audioWindow.webkitAudioContext;
      if (!Context) {
        setSoundStatus("Intro sound is not supported by this browser.");
        return;
      }

      const elapsed = Number.isFinite(elapsedSeconds)
        ? Math.max(0, elapsedSeconds)
        : INTRO_DURATION;
      const clickedAt = performance.now();
      if (timelineStartRef.current !== null) {
        timelineStartRef.current = clickedAt - elapsed * 1000;
      }
      const generation = ++generationRef.current;
      pendingRef.current = true;
      setSoundStatus("Enabling intro sound.");

      try {
        // Only this explicit click handler may create or resume an AudioContext.
        const context = new Context();
        const master = context.createGain();
        master.gain.value = 0.12;
        master.connect(context.destination);
        const engine: SoundEngine = {
          context,
          master,
          sources: new Set(),
          nodes: new Set([master]),
        };
        engineRef.current = engine;
        await context.resume();
        if (!mountedRef.current || generation !== generationRef.current) return;
        if (context.state !== "running")
          throw new Error("Audio context did not resume");

        pendingRef.current = false;
        enabledRef.current = true;
        tone(engine, context.currentTime, 523.25, 0.16, 0.045);
        if (timelineStartRef.current !== null) {
          scheduleRemaining(
            engine,
            Math.max(0, (performance.now() - timelineStartRef.current) / 1000),
          );
        }
        setSoundEnabled(true);
        setSoundStatus("Intro sound is enabled.");
      } catch {
        if (!mountedRef.current || generation !== generationRef.current) return;
        releaseAudio();
        setSoundEnabled(false);
        setSoundStatus(
          "Intro sound could not be enabled. Try the sound button again.",
        );
      }
    },
    [releaseAudio],
  );

  useLayoutEffect(() => {
    // Initialize before the parent's layout effect; reset on Strict Mode setup too.
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      timelineStartRef.current = null;
      releaseAudio();
    };
  }, [releaseAudio]);

  return {
    soundEnabled,
    soundStatus,
    toggleSound,
    startSoundtrack,
    stopSoundtrack,
  };
}
