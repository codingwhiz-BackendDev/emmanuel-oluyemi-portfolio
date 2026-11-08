// Original, locally rendered soundtrack. Run: node scripts/render-intro-audio.mjs
import { readFileSync, writeFileSync } from "node:fs";

const timeline = readFileSync(new URL("../src/introTimeline.ts", import.meta.url), "utf8");
const timing = Object.fromEntries([...timeline.matchAll(/(\w+):\s*(\d+)/g)].map(([, name, value]) => [name, Number(value) / 1000]));
const rate = 44100;
const samples = new Float64Array(Math.ceil(rate * timing.finish));
let seed = 17;
const noise = () => {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return seed / 2147483648 - 1;
};

function voice(at, duration, frequency, gain, kind = "bell", endFrequency = frequency) {
  const start = Math.round(at * rate);
  const length = Math.min(Math.round(duration * rate), samples.length - start);
  let phase = 0;
  let filteredNoise = 0;
  for (let i = 0; i < length; i++) {
    const t = i / rate;
    const progress = i / length;
    phase += 2 * Math.PI * frequency * (endFrequency / frequency) ** progress / rate;
    let value;
    let envelope;
    if (kind === "pad") {
      value = Math.sin(phase) + 0.22 * Math.sin(phase * 2) + 0.08 * Math.sin(phase * 3);
      envelope = Math.min(1, t / 0.12) * Math.min(1, (duration - t) / 0.28);
    } else if (kind === "sweep") {
      filteredNoise += 0.15 * (noise() - filteredNoise);
      value = filteredNoise;
      envelope = Math.sin(Math.PI * progress) ** 1.4;
    } else if (kind === "hit") {
      value = Math.sin(phase) + noise() * 0.12;
      envelope = Math.min(1, t / 0.004) * Math.exp(-t * 12);
    } else {
      value = Math.sin(phase) + 0.3 * Math.sin(phase * 2) * Math.exp(-t * 7);
      envelope = Math.min(1, t / 0.006) * Math.exp(-t * 4.8) * Math.min(1, (duration - t) / 0.08);
    }
    samples[start + i] += value * envelope * gain;
  }
}

const chords = [
  [0, timing.craft, [293.66, 349.23, 440], 146.83],
  [timing.craft, timing.mobile, [293.66, 349.23, 523.25], 174.61],
  [timing.mobile, timing.ai, [261.63, 349.23, 440], 174.61],
  [timing.ai, timing.impact, [293.66, 392, 440], 196],
  [timing.impact, timing.finish, [293.66, 369.99, 440, 587.33], 146.83],
];
for (const [at, end, notes, bass] of chords) {
  for (const frequency of notes) voice(at, end - at + 0.2, frequency, 0.12, "pad");
  voice(at, end - at + 0.15, bass, 0.21, "pad");
}
for (let step = 0; step * 0.275 < timing.reveal; step++) {
  const at = step * 0.275;
  const chord = chords.find(([, end]) => at < end);
  voice(at, 0.65, chord[2][step % chord[2].length] * 2, step % 4 === 0 ? 0.25 : 0.16);
}
voice(0, 1.5, 700, 0.25, "sweep");
for (const offset of [0, 0.275, 0.55, 0.825]) voice(timing.craft + offset, 0.25, 330, 0.4, "hit", 110);
[523.25, 659.25, 783.99, 1046.5].forEach((f, i) => voice(timing.mobile + i * 0.14, 0.8, f, 0.25));
[587.33, 880, 1174.66, 1760, 1174.66, 880].forEach((f, i) => voice(timing.ai + i * 0.115, 0.7, f, 0.18));
voice(timing.impact, 0.6, 293.66, 0.65, "hit", 100);
voice(timing.impact, 1.6, 1174.66, 0.28);
voice(timing.reveal, timing.finish - timing.reveal, 1000, 0.55, "sweep");

// Feed-forward echoes add space without allowing the tail beyond the film.
const dry = samples.slice();
for (const [delay, gain] of [[0.105, 0.16], [0.19, 0.1]]) {
  const offset = Math.round(delay * rate);
  for (let i = offset; i < samples.length; i++) samples[i] += dry[i - offset] * gain;
}
let peak = 0;
for (let i = 0; i < samples.length; i++) {
  const fade = Math.min(1, i / (rate * 0.008), (samples.length - i) / (rate * 0.18));
  samples[i] = Math.tanh(samples[i] * 1.5) * fade;
  peak = Math.max(peak, Math.abs(samples[i]));
}
const dataSize = samples.length * 2;
const wav = Buffer.alloc(44 + dataSize);
wav.write("RIFF", 0);
wav.writeUInt32LE(36 + dataSize, 4);
wav.write("WAVEfmt ", 8);
wav.writeUInt32LE(16, 16);
wav.writeUInt16LE(1, 20);
wav.writeUInt16LE(1, 22);
wav.writeUInt32LE(rate, 24);
wav.writeUInt32LE(rate * 2, 28);
wav.writeUInt16LE(2, 32);
wav.writeUInt16LE(16, 34);
wav.write("data", 36);
wav.writeUInt32LE(dataSize, 40);
let energy = 0;
for (let i = 0; i < samples.length; i++) {
  const value = samples[i] / peak * 0.92;
  energy += value * value;
  wav.writeInt16LE(Math.round(value * 32767), 44 + i * 2);
}
writeFileSync(new URL("../public/audio/intro.wav", import.meta.url), wav);
console.log(`Rendered intro.wav: ${timing.finish}s, ${wav.length} bytes, peak 0.92, RMS ${Math.sqrt(energy / samples.length).toFixed(3)}`);
