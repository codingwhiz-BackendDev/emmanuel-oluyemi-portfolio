// Original composition and synthesis. No samples, packages, or network required.
// Run from any directory: node scripts/render-ship-it-audio.mjs
import { writeFileSync } from "node:fs";

const rate = 22050;
const beat = 60 / 128;
const duration = beat * 32; // Eight bars, exactly 15 seconds, no intro/outro gap.
let seed = 0x53484950;
const random = () => {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return seed / 2147483648 - 1;
};
const hz = (midi) => 440 * 2 ** ((midi - 69) / 12);
const make = (seconds) => new Float64Array(Math.round(seconds * rate));

function tone(out, at, seconds, from, to, level, kind = "pluck", wrap = false) {
  const start = Math.round(at * rate);
  const count = Math.round(seconds * rate);
  let phase = 0;
  let filtered = 0;
  for (let i = 0; i < count; i++) {
    const t = i / rate;
    const p = i / (count - 1);
    const frequency = from * (to / from) ** p;
    phase += 2 * Math.PI * frequency / rate;
    const attack = Math.min(1, t / (kind === "pad" ? 0.06 : 0.004));
    const release = Math.min(1, (count - 1 - i) / (rate * (kind === "pad" ? 0.12 : 0.018)));
    let wave;
    let envelope;
    if (kind === "kick") {
      wave = Math.sin(phase);
      envelope = Math.exp(-t * 23);
    } else if (kind === "snare" || kind === "hat" || kind === "crash") {
      filtered += (kind === "hat" ? 0.38 : 0.18) * (random() - filtered);
      wave = filtered * (kind === "hat" ? 1 : 0.75) + Math.sin(phase) * (kind === "hat" ? 0 : 0.35);
      envelope = Math.exp(-t * (kind === "crash" ? 7 : kind === "hat" ? 55 : 24));
    } else if (kind === "pad") {
      wave = Math.sin(phase) + 0.12 * Math.sin(phase * 2) + 0.05 * Math.sin(phase * 3);
      envelope = 0.8 + 0.2 * Math.sin(t * Math.PI * 2 / beat);
    } else if (kind === "bass") {
      wave = Math.sin(phase) + 0.23 * Math.sin(phase * 2) + 0.08 * Math.sin(phase * 3);
      envelope = Math.exp(-t * 5);
    } else {
      // A band-limited chip-like voice: no hard square edges or aliasing buzz.
      wave = Math.sin(phase) + 0.22 * Math.sin(phase * 3) + 0.07 * Math.sin(phase * 5);
      envelope = Math.exp(-t * 8);
    }
    const index = start + i;
    if (wrap || index < out.length) out[index % out.length] += wave * envelope * attack * release * level;
  }
}

function write(name, samples, targetPeak, targetRms) {
  let mean = 0;
  for (const sample of samples) mean += sample / samples.length;
  let peak = 0;
  let energy = 0;
  for (let i = 0; i < samples.length; i++) {
    samples[i] = Math.tanh((samples[i] - mean) * 1.15);
    peak = Math.max(peak, Math.abs(samples[i]));
    energy += samples[i] ** 2;
  }
  const scale = Math.min(targetPeak / peak, targetRms / Math.sqrt(energy / samples.length));
  const wav = Buffer.alloc(44 + samples.length * 2);
  wav.write("RIFF", 0);
  wav.writeUInt32LE(wav.length - 8, 4);
  wav.write("WAVEfmt ", 8);
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20);
  wav.writeUInt16LE(1, 22);
  wav.writeUInt32LE(rate, 24);
  wav.writeUInt32LE(rate * 2, 28);
  wav.writeUInt16LE(2, 32);
  wav.writeUInt16LE(16, 34);
  wav.write("data", 36);
  wav.writeUInt32LE(samples.length * 2, 40);
  let quantizedEnergy = 0;
  let quantizedPeak = 0;
  for (let i = 0; i < samples.length; i++) {
    const pcm = Math.round(samples[i] * scale * 32767);
    wav.writeInt16LE(pcm, 44 + i * 2);
    quantizedEnergy += (pcm / 32767) ** 2;
    quantizedPeak = Math.max(quantizedPeak, Math.abs(pcm / 32767));
  }
  writeFileSync(new URL(`../public/audio/ship-it-${name}.wav`, import.meta.url), wav);
  const db = (value) => (20 * Math.log10(value)).toFixed(2);
  const seam = Math.abs(wav.readInt16LE(44) - wav.readInt16LE(wav.length - 2)) / 32767;
  console.log(`${name}: ${(samples.length / rate).toFixed(3)}s, ${wav.length} bytes, peak ${db(quantizedPeak)} dBFS, RMS ${db(Math.sqrt(quantizedEnergy / samples.length))} dBFS, boundary step ${seam.toFixed(6)}`);
}

const music = make(duration);
const chords = [[57, 60, 64], [53, 57, 60], [48, 55, 60], [55, 59, 62]];
const melody = [
  [76, 0, 79, 81, 0, 79, 76, 72],
  [77, 0, 76, 72, 0, 69, 72, 76],
  [76, 0, 79, 84, 0, 79, 76, 72],
  [74, 0, 71, 74, 0, 79, 74, 71],
  [76, 0, 79, 81, 84, 0, 81, 79],
  [77, 0, 81, 79, 77, 0, 76, 72],
  [76, 0, 79, 84, 83, 0, 79, 76],
  [74, 0, 79, 74, 71, 0, 74, 76],
];
for (let bar = 0; bar < 8; bar++) {
  const at = bar * 4 * beat;
  const chord = chords[bar % 4];
  for (const note of chord) tone(music, at, 4 * beat + 0.14, hz(note), hz(note), 0.075, "pad", true);
  for (let eighth = 0; eighth < 8; eighth++) {
    const t = at + eighth * beat / 2;
    const bass = hz(chord[0] - 12 + (eighth === 6 ? 12 : 0));
    tone(music, t, beat * 0.43, bass, bass, eighth % 2 === 0 ? 0.3 : 0.19, "bass", true);
    const arp = hz(chord[eighth % 3] + 12);
    tone(music, t + beat / 4, beat * 0.45, arp, arp, 0.045, "pluck", true);
    const note = melody[bar][eighth];
    if (note) tone(music, t, beat * 0.72, hz(note), hz(note), 0.135, "pluck", true);
    tone(music, t, 0.065, 4300, 3400, eighth % 2 ? 0.11 : 0.065, "hat", true);
  }
  for (let quarter = 0; quarter < 4; quarter++) {
    const t = at + quarter * beat;
    tone(music, t, 0.19, 130, 46, 0.52, "kick", true);
    if (quarter % 2) tone(music, t, 0.14, 190, 135, 0.33, "snare", true);
  }
}
// Circular echoes and wrapped note tails make the final bar join the first,
// rather than fading to silence at the loop boundary.
const dry = music.slice();
for (const [beats, level] of [[0.75, 0.12], [1.5, 0.06]]) {
  const offset = Math.round(beats * beat * rate);
  for (let i = 0; i < music.length; i++) music[i] += dry[(i - offset + music.length) % music.length] * level;
}
write("music", music, 0.62, 0.18);

const jump = make(0.18);
tone(jump, 0, 0.18, 320, 820, 0.8);
write("jump", jump, 0.8, 0.3);
const doubleJump = make(0.25);
tone(doubleJump, 0, 0.13, 580, 1080, 0.7);
tone(doubleJump, 0.085, 0.165, 880, 1480, 0.65);
write("double-jump", doubleJump, 0.8, 0.3);
const commit = make(0.36);
[72, 76, 79, 84].forEach((note, i) => tone(commit, i * 0.05, 0.21, hz(note), hz(note), 0.6));
write("commit", commit, 0.8, 0.3);
const coffee = make(0.46);
[64, 71, 68, 76, 80].forEach((note, i) => tone(coffee, i * 0.065, 0.2, hz(note) * 0.7, hz(note), 0.65, "bass"));
write("coffee", coffee, 0.8, 0.3);
const crash = make(0.6);
tone(crash, 0, 0.6, 240, 52, 0.85, "crash");
tone(crash, 0, 0.5, 130, 35, 0.65, "bass");
write("crash", crash, 0.8, 0.3);
