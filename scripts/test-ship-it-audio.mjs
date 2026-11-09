// Focused hook/API and PCM tests; no browser, downloads, or extra dependencies.
// Run: node scripts/test-ship-it-audio.mjs
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { transform } from "esbuild";

const source = await readFile(
  new URL("../src/hooks/useShipItAudio.ts", import.meta.url),
  "utf8",
);
const { code } = await transform(
  source
    .replace(
      /import \{[^}]+\} from "react";/,
      "const { useCallback, useLayoutEffect, useRef, useState } = globalThis.__shipItHooks;",
    )
    .replaceAll("import.meta.env.BASE_URL", '"/portfolio/"'),
  { loader: "ts", format: "esm", target: "es2020" },
);
let current;
globalThis.__shipItHooks = {
  useState(initial) {
    const h = current;
    const i = h.cursor++;
    if (!(i in h.slots)) h.slots[i] = initial;
    return [
      h.slots[i],
      (value) => {
        assert.ok(h.mounted, "state update after unmount");
        h.slots[i] = value;
      },
    ];
  },
  useRef(initial) {
    const h = current;
    const i = h.cursor++;
    return (h.slots[i] ??= { current: initial });
  },
  useCallback(callback) {
    const h = current;
    const i = h.cursor++;
    return (h.slots[i] ??= callback);
  },
  useLayoutEffect(effect) {
    const h = current;
    const i = h.cursor++;
    if (!(i in h.slots)) {
      h.slots[i] = true;
      h.effect = effect;
    }
  },
};
const { useShipItAudio } = await import(
  `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`
);
const flush = () => new Promise((resolve) => setImmediate(resolve));
const deferred = () => {
  let resolve, reject;
  const promise = new Promise((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
};

function harness() {
  const saved = Object.fromEntries(
    ["window", "Audio", "fetch", "setTimeout", "clearTimeout"].map((key) => [
      key,
      globalThis[key],
    ]),
  );
  const h = {
    slots: [],
    cursor: 0,
    mounted: true,
    effect: null,
    cleanup: null,
    media: [],
    contexts: [],
    sources: [],
    fetches: [],
    timers: new Map(),
    deferPlay: false,
    deferFetch: false,
    playError: null,
    fetchError: false,
    decodeError: false,
    resumeError: null,
    closeRejects: false,
  };
  let timerId = 0;
  globalThis.setTimeout = (callback) => {
    const id = ++timerId;
    h.timers.set(id, callback);
    return id;
  };
  globalThis.clearTimeout = (id) => h.timers.delete(id);
  class FakeAudio {
    constructor(src) {
      this.src = src;
      this.paused = true;
      this.currentTime = 0;
      this.plays = [];
      h.media.push(this);
    }
    play() {
      const play = deferred();
      this.plays.push(play);
      this.paused = false;
      if (h.playError) play.reject(h.playError);
      else if (!h.deferPlay) play.resolve();
      return play.promise;
    }
    pause() {
      this.paused = true;
    }
    removeAttribute(name) {
      if (name === "src") this.src = "";
    }
    load() {}
    latePlay(index = this.plays.length - 1) {
      this.paused = false;
      this.onplaying?.();
      this.plays[index].resolve();
    }
  }
  class FakeContext {
    constructor(options) {
      this.options = options;
      this.state = "suspended";
      this.resumeCalls = 0;
      this.closeCalls = 0;
      h.contexts.push(this);
    }
    createGain() {
      return { gain: { value: 0 }, connect() {}, disconnect() {} };
    }
    resume() {
      this.resumeCalls++;
      if (h.resumeError) return Promise.reject(h.resumeError);
      this.state = "running";
      return Promise.resolve();
    }
    decodeAudioData() {
      return h.decodeError
        ? Promise.reject(new Error("Bad PCM"))
        : Promise.resolve({ decoded: true });
    }
    close() {
      this.closeCalls++;
      this.state = "closed";
      return h.closeRejects
        ? Promise.reject(new Error("Already closed"))
        : Promise.resolve();
    }
    createBufferSource() {
      const node = {
        starts: 0,
        stops: 0,
        disconnected: false,
        connect() {},
        disconnect() {
          this.disconnected = true;
        },
        start() {
          this.starts++;
        },
        stop() {
          this.stops++;
        },
      };
      h.sources.push(node);
      return node;
    }
  }
  globalThis.Audio = FakeAudio;
  globalThis.window = { AudioContext: FakeContext };
  globalThis.fetch = (url, { signal }) => {
    assert.match(url, /^\/portfolio\/audio\/ship-it-/, "respect Vite base URL");
    const request = deferred();
    h.fetches.push({ url, signal, ...request });
    signal.addEventListener(
      "abort",
      () => request.reject(new Error("Aborted")),
      { once: true },
    );
    if (h.fetchError) request.reject(new Error("Offline"));
    else if (!h.deferFetch)
      request.resolve({
        ok: true,
        arrayBuffer: async () => new ArrayBuffer(8),
      });
    return request.promise;
  };
  h.render = () => {
    current = h;
    h.cursor = 0;
    return (h.api = useShipItAudio());
  };
  h.render();
  h.cleanup = h.effect();
  h.strictRemount = () => {
    h.mounted = false;
    h.cleanup();
    h.mounted = true;
    h.cleanup = h.effect();
    h.render();
  };
  h.unmount = () => {
    h.mounted = false;
    h.cleanup();
  };
  h.restore = () => Object.assign(globalThis, saved);
  return h;
}

async function scenario(name, fn) {
  await test(name, async () => {
    const h = harness();
    try {
      await fn(h);
    } finally {
      h.unmount();
      await flush();
      assert.equal(h.timers.size, 0, "cleanup clears all timers");
      assert.ok(
        h.contexts.every((ctx) => ctx.closeCalls === 1),
        "every context closed exactly once",
      );
      assert.ok(
        h.media.every((audio) => audio.paused && audio.src === ""),
        "every media element released",
      );
      assert.ok(
        h.sources.every((node) => node.disconnected),
        "every source disconnected",
      );
      h.restore();
    }
  });
}

await scenario(
  "mount/StrictMode are silent; start unlocks synchronously and actions stay stable",
  async (h) => {
    const original = h.api;
    h.strictRemount();
    h.api.toggleSound(); // Ready mute/unmute must not create media.
    h.api.toggleSound();
    assert.equal(h.media.length, 0);
    assert.equal(h.contexts.length, 0);
    assert.equal(h.fetches.length, 0);
    h.api.start();
    assert.equal(h.media[0].plays.length, 1, "native play in click stack");
    assert.equal(h.contexts[0].resumeCalls, 1, "context resume in click stack");
    assert.equal(h.media[0].loop, true);
    assert.equal(h.media[0].volume, 0.55);
    assert.equal(h.contexts[0].options.latencyHint, "interactive");
    assert.equal(
      h.render().soundEnabled,
      false,
      "loading is not reported as On",
    );
    await flush();
    assert.equal(h.render().soundEnabled, true);
    for (const key of [
      "start",
      "pause",
      "resume",
      "stop",
      "playEffect",
      "toggleSound",
    ]) {
      assert.equal(h.api[key], original[key], `${key} identity`);
    }
    for (const effect of ["jump", "double-jump", "commit", "coffee", "crash"])
      h.api.playEffect(effect);
    assert.equal(h.sources.length, 5);
    assert.ok(h.sources.every((node) => node.starts === 1));
  },
);

await scenario(
  "pause preserves position, stops active effects, and allows only crash",
  async (h) => {
    h.api.start();
    await flush();
    const music = h.media[0];
    music.currentTime = 4.25;
    h.api.playEffect("jump");
    h.api.pause();
    assert.ok(music.paused);
    assert.equal(h.sources[0].stops, 1);
    h.api.playEffect("jump");
    assert.equal(h.sources.length, 1);
    h.api.playEffect("crash");
    assert.equal(h.sources.length, 2);
    h.api.resume();
    assert.equal(music.currentTime, 4.25);
    await flush();
    assert.equal(h.render().soundEnabled, true);
    h.api.start();
    assert.equal(music.currentTime, 0, "restart begins the loop again");
  },
);

await scenario(
  "mute survives restarts/pause/stop; unmute while ready or paused never autoplays",
  async (h) => {
    h.api.toggleSound();
    h.api.start();
    h.api.start();
    h.api.pause();
    h.api.resume();
    assert.equal(h.media.length, 0);
    h.api.stop();
    assert.equal(h.render().soundEnabled, false);
    h.api.toggleSound();
    assert.equal(h.media.length, 0);
    h.api.start();
    await flush();
    const music = h.media[0];
    music.currentTime = 8;
    h.api.toggleSound();
    h.api.playEffect("crash");
    assert.equal(h.sources.length, 0, "muted crash is silent");
    h.api.start(); // Restart while muted must reset on the eventual unmute.
    h.api.pause();
    const playCount = music.plays.length;
    h.api.toggleSound();
    assert.equal(music.plays.length, playCount);
    assert.equal(
      h.render().soundEnabled,
      true,
      "unmuting while paused arms sound for resume",
    );
    assert.ok(music.paused);
    h.api.resume();
    assert.equal(music.currentTime, 0);
    await flush();
    assert.equal(h.render().soundEnabled, true);
  },
);

await scenario(
  "pause during pending play/fetch prevents late restart; resume can retry without seeking",
  async (h) => {
    h.deferPlay = true;
    h.deferFetch = true;
    h.api.start();
    const music = h.media[0];
    music.currentTime = 1.5;
    h.api.pause();
    music.latePlay();
    for (const request of h.fetches)
      request.resolve({
        ok: true,
        arrayBuffer: async () => new ArrayBuffer(8),
      });
    await flush();
    assert.ok(music.paused);
    assert.equal(
      h.render().soundEnabled,
      true,
      "paused sound preference stays armed without claiming playback",
    );
    assert.match(h.api.soundStatus, /paused/i);
    h.api.resume();
    assert.equal(music.currentTime, 1.5);
    music.latePlay();
    await flush();
    assert.equal(h.render().soundEnabled, true);
  },
);

await scenario(
  "old play success/rejection cannot corrupt a newer resume or restart",
  async (h) => {
    h.deferPlay = true;
    h.api.start();
    const oldMusic = h.media[0];
    h.api.stop();
    h.api.start();
    const newMusic = h.media[1];
    oldMusic.latePlay();
    newMusic.latePlay();
    await flush();
    assert.ok(oldMusic.paused);
    assert.equal(h.render().soundEnabled, true);
    h.api.pause();
    h.api.resume();
    h.api.pause();
    h.api.resume();
    newMusic.plays[1].reject(new Error("Stale AbortError"));
    newMusic.latePlay(2);
    await flush();
    assert.equal(h.render().soundEnabled, true);
    assert.equal(newMusic.paused, false);
  },
);

for (const kind of ["play", "fetch", "decode", "resume", "http", "native"]) {
  await scenario(
    `${kind} failure is caught, releases audio, and can be retried`,
    async (h) => {
      if (kind === "play")
        h.playError = Object.assign(new Error("Gesture required"), {
          name: "NotAllowedError",
        });
      if (kind === "fetch") h.fetchError = true;
      if (kind === "decode") h.decodeError = true;
      if (kind === "resume") h.resumeError = new Error("Context denied");
      if (kind === "http") h.deferFetch = true;
      h.api.start();
      if (kind === "http")
        for (const request of h.fetches)
          request.resolve({ ok: false, status: 404 });
      if (kind === "native") h.media[0].onerror();
      await flush();
      assert.equal(h.render().soundEnabled, false);
      assert.match(h.api.soundStatus, /retry/i);
      if (kind === "play") assert.match(h.api.soundStatus, /Allow sound/);
      assert.ok(h.media[0].paused);
      h.playError = h.resumeError = null;
      h.fetchError = h.decodeError = h.deferFetch = false;
      h.api.toggleSound();
      await flush();
      assert.equal(h.render().soundEnabled, true);
    },
  );
}

await scenario(
  "loading deadline stops playback; muted pending promises cannot restart it",
  async (h) => {
    h.deferPlay = true;
    h.api.start();
    await flush();
    assert.equal(h.timers.size, 1);
    for (const expire of [...h.timers.values()]) expire();
    await flush();
    assert.equal(h.render().soundEnabled, false);
    assert.match(h.api.soundStatus, /retry/i);
    h.deferPlay = false;
    h.api.toggleSound();
    await flush();
    h.deferPlay = true;
    h.api.start();
    const music = h.media.at(-1);
    h.api.toggleSound();
    music.latePlay();
    await flush();
    assert.ok(music.paused);
    assert.equal(h.render().soundEnabled, false);
  },
);

await scenario(
  "stop/StrictMode/unmount abort pending work and close resources even if close rejects",
  async (h) => {
    h.deferPlay = h.deferFetch = h.closeRejects = true;
    h.api.start();
    const music = h.media[0];
    const pending = [...h.fetches];
    h.strictRemount();
    assert.ok(pending.every((request) => request.signal.aborted));
    music.latePlay();
    await flush();
    assert.ok(music.paused);
    h.api.start();
    h.unmount();
    h.media[1].latePlay();
    // Retained callbacks after unmount must also be inert.
    h.api.start();
    h.api.resume();
    h.api.toggleSound();
    h.api.playEffect("crash");
    await flush();
    assert.equal(h.media.length, 2);
  },
);

await scenario(
  "polyphony is bounded and natural ends disconnect their source",
  async (h) => {
    h.api.start();
    await flush();
    for (let i = 0; i < 20; i++) h.api.playEffect("jump");
    assert.equal(h.sources.filter((node) => !node.disconnected).length, 12);
    const latest = h.sources.at(-1);
    latest.onended();
    assert.ok(latest.disconnected);
    h.api.stop();
    h.api.playEffect("crash");
    assert.ok(h.sources.every((node) => node.disconnected));
  },
);

await test("local WAV assets: valid PCM, headroom, non-silence, distinct effects, and loop seam", async () => {
  let musicRms;
  const fingerprints = new Set();
  for (const name of [
    "music",
    "jump",
    "double-jump",
    "commit",
    "coffee",
    "crash",
  ]) {
    const wav = await readFile(
      new URL(`../public/audio/ship-it-${name}.wav`, import.meta.url),
    );
    assert.equal(wav.toString("ascii", 0, 4), "RIFF");
    assert.equal(wav.toString("ascii", 8, 16), "WAVEfmt ");
    assert.equal(wav.readUInt32LE(4), wav.length - 8);
    assert.equal(wav.readUInt16LE(20), 1);
    assert.equal(wav.readUInt16LE(22), 1);
    assert.equal(wav.readUInt32LE(24), 22050);
    assert.equal(wav.readUInt16LE(34), 16);
    assert.equal(wav.readUInt32LE(40), wav.length - 44);
    const count = (wav.length - 44) / 2;
    let peak = 0,
      energy = 0,
      dc = 0,
      largestStep = 0,
      previous = wav.readInt16LE(44) / 32767;
    for (let i = 0; i < count; i++) {
      const sample = wav.readInt16LE(44 + i * 2) / 32767;
      peak = Math.max(peak, Math.abs(sample));
      energy += sample * sample;
      dc += sample / count;
      largestStep = Math.max(largestStep, Math.abs(sample - previous));
      previous = sample;
    }
    const rms = Math.sqrt(energy / count);
    assert.ok(peak <= 0.801 && peak > 0.3, `${name} peak/headroom`);
    assert.ok(rms > 0.1 && rms <= 0.301, `${name} audible RMS`);
    assert.ok(Math.abs(dc) < 0.003, `${name} DC offset`);
    if (name === "music") {
      musicRms = rms * 0.55;
      assert.equal(count / 22050, 15);
      const seam = Math.abs(wav.readInt16LE(44) / 32767 - previous);
      assert.ok(
        seam < 0.01 && seam < largestStep,
        "loop seam is smaller than ordinary waveform steps",
      );
      for (let start = 0; start < count; start += 2205) {
        let energy = 0;
        for (let i = start; i < Math.min(start + 2205, count); i++)
          energy += (wav.readInt16LE(44 + i * 2) / 32767) ** 2;
        assert.ok(
          Math.sqrt(energy / Math.min(2205, count - start)) > 0.025,
          "no silent music gaps",
        );
      }
    } else {
      assert.ok(
        rms * 0.85 > musicRms * 1.8,
        "effects sit above music at runtime gains",
      );
      fingerprints.add(wav.toString("base64"));
    }
  }
  assert.equal(fingerprints.size, 5);
});

delete globalThis.__shipItHooks;
