import { useCallback, useLayoutEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Braces,
  Code2,
  Database,
  Layers,
  Play,
  Smartphone,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";
import { profile } from "@/data";
import { INTRO_TIMING } from "@/introTimeline";
import { useIntroSound } from "@/hooks/useIntroSound";
import "./Entrance.css";

type Phase = "portrait" | "craft" | "mobile" | "ai" | "impact" | "reveal";
interface EntranceProps {
  onReveal: () => void;
  onComplete: () => void;
}

function phaseAt(elapsed: number): Phase {
  if (elapsed >= INTRO_TIMING.reveal) return "reveal";
  if (elapsed >= INTRO_TIMING.impact) return "impact";
  if (elapsed >= INTRO_TIMING.ai) return "ai";
  if (elapsed >= INTRO_TIMING.mobile) return "mobile";
  if (elapsed >= INTRO_TIMING.craft) return "craft";
  return "portrait";
}

export function Entrance({ onReveal, onComplete }: EntranceProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const aliveRef = useRef(false);
  const finishedRef = useRef(false);
  const startingRef = useRef(false);
  const startedAtRef = useRef<number | null>(null);
  const phaseRef = useRef<Phase>("portrait");
  const revealSentRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [busy, setBusy] = useState(false);
  const [phase, setPhase] = useState<Phase>("portrait");
  const [imageFailed, setImageFailed] = useState(false);
  const {
    soundEnabled,
    soundStatus,
    enableSound,
    muteSound,
    startSoundtrack,
    stopSoundtrack,
  } = useIntroSound();

  const complete = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    stopSoundtrack();
    if (dialogRef.current?.open) dialogRef.current.close();
    onComplete();
  }, [onComplete, stopSoundtrack]);

  useLayoutEffect(() => {
    aliveRef.current = true;
    if (finishedRef.current)
      return () => {
        aliveRef.current = false;
      };
    const dialog = dialogRef.current;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (
      !dialog ||
      typeof dialog.showModal !== "function" ||
      preference.matches
    ) {
      complete();
      return () => {
        aliveRef.current = false;
      };
    }
    const body = document.body;
    const overflow = body.style.overflow;
    const paddingRight = body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    const bodyPadding =
      parseFloat(window.getComputedStyle(body).paddingRight) || 0;
    dialog.showModal();
    body.style.overflow = "hidden";
    if (scrollbarWidth > 0)
      body.style.paddingRight = `${bodyPadding + scrollbarWidth}px`;
    const onPreference = () => {
      if (preference.matches) complete();
    };
    const onVisibility = () => {
      if (document.hidden) complete();
    };
    preference.addEventListener("change", onPreference);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      aliveRef.current = false;
      stopSoundtrack();
      preference.removeEventListener("change", onPreference);
      document.removeEventListener("visibilitychange", onVisibility);
      if (dialog.open) dialog.close();
      body.style.overflow = overflow;
      body.style.paddingRight = paddingRight;
    };
  }, [complete, stopSoundtrack]);

  useLayoutEffect(() => {
    if (!playing || startedAtRef.current === null) return;
    skipRef.current?.focus({ preventScroll: true });
    let frame = 0;
    const update = () => {
      if (finishedRef.current || startedAtRef.current === null) return;
      const elapsed = performance.now() - startedAtRef.current;
      const next = phaseAt(elapsed);
      if (next !== phaseRef.current) {
        phaseRef.current = next;
        setPhase(next);
      }
      if (progressRef.current)
        progressRef.current.style.transform = `scaleX(${Math.min(1, elapsed / INTRO_TIMING.finish)})`;
      if (timeRef.current)
        timeRef.current.textContent = `00:${(elapsed / 1000).toFixed(1).padStart(4, "0")}`;
      if (elapsed >= INTRO_TIMING.reveal && !revealSentRef.current) {
        revealSentRef.current = true;
        onReveal();
      }
      if (elapsed >= INTRO_TIMING.finish) {
        complete();
        return;
      }
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [playing, complete, onReveal]);

  const begin = async (withSound: boolean) => {
    if (
      startingRef.current ||
      startedAtRef.current !== null ||
      finishedRef.current
    )
      return;
    startingRef.current = true;
    setBusy(true);
    if (withSound) {
      const unlocked = await enableSound();
      if (!aliveRef.current || finishedRef.current) return;
      if (!unlocked) {
        startingRef.current = false;
        setBusy(false);
        return;
      }
    } else {
      muteSound();
    }
    if (!aliveRef.current || finishedRef.current) return;
    startedAtRef.current = performance.now();
    if (withSound) startSoundtrack();
    setPlaying(true);
    setBusy(false);
  };

  const changeSound = async () => {
    if (busy || finishedRef.current) return;
    if (soundEnabled) {
      muteSound();
      return;
    }
    setBusy(true);
    const unlocked = await enableSound();
    if (!aliveRef.current || finishedRef.current) return;
    if (unlocked && startedAtRef.current !== null)
      startSoundtrack((performance.now() - startedAtRef.current) / 1000);
    setBusy(false);
  };

  const craftIndex = phase === "mobile" ? 1 : phase === "ai" ? 2 : 0;
  const craftVisible = playing && ["craft", "mobile", "ai"].includes(phase);
  const impactVisible = phase === "impact" || phase === "reveal";

  return (
    <dialog
      ref={dialogRef}
      className={`entrance-film ${playing ? "is-playing" : "is-gate"} phase-${phase}${soundEnabled ? " has-sound" : ""}`}
      aria-labelledby="entrance-title"
      aria-describedby="entrance-description"
      onCancel={(event) => {
        event.preventDefault();
        complete();
      }}
    >
      <div className="film-curtain film-curtain-lime" aria-hidden="true" />
      <div className="film-curtain film-curtain-violet" aria-hidden="true" />
      <header className="film-header">
        <span className="film-brand" aria-hidden="true">
          EO<span>✳</span>
        </span>
        <span className="film-edition" aria-hidden="true">
          THE BUILDER’S CUT <i /> VOL. 01 / {new Date().getFullYear()}
        </span>
        <div className="film-controls">
          {playing && (
            <button
              type="button"
              className="film-sound"
              aria-label="Intro sound"
              aria-pressed={soundEnabled}
              aria-describedby="film-audio-status"
              disabled={busy}
              onClick={() => void changeSound()}
            >
              {soundEnabled ? (
                <Volume2 size={16} aria-hidden="true" />
              ) : (
                <VolumeX size={16} aria-hidden="true" />
              )}
              <span>
                {busy ? "Connecting…" : soundEnabled ? "Sound on" : "Sound off"}
              </span>
              <span className="film-equalizer" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </span>
            </button>
          )}
          <button
            ref={skipRef}
            type="button"
            className="film-skip"
            onClick={complete}
          >
            Skip intro <ArrowUpRight size={15} aria-hidden="true" />
          </button>
        </div>
      </header>
      <div className="film-stage">
        <div className="film-atmosphere" aria-hidden="true" />
        <div className="film-grain" aria-hidden="true" />
        <p id="entrance-description" className="sr-only">
          Meet {profile.name}. A 6.8-second portrait-led introduction to backend
          engineering, web development, Flutter mobile apps, and AI products.
          Choose sound or silent playback, or skip to the portfolio.
        </p>
        <div className="film-canvas">
          {!playing && (
            <section
              className="film-welcome"
              aria-label="Choose how to watch the introduction"
            >
              <p className="film-kicker">
                <span /> A SHORT FILM ABOUT A CURIOUS MIND
              </p>
              <h3>
                Meet the mind.
                <br />
                <span>Feel the craft.</span>
              </h3>
              <p className="film-welcome-copy">
                A face. A few wild ideas.
                <br />
                And the things I bring to life.
              </p>
              <button
                type="button"
                className="film-enter"
                disabled={busy}
                onClick={() => void begin(true)}
                aria-describedby="film-audio-status"
              >
                <span className="film-play-icon">
                  <Play size={17} fill="currentColor" aria-hidden="true" />
                </span>
                <span>
                  {busy ? "Preparing sound…" : "Enter with sound"}
                  <small>THE FULL EXPERIENCE</small>
                </span>
                <ArrowUpRight size={20} aria-hidden="true" />
              </button>
              <button
                type="button"
                className="film-enter-silent"
                disabled={busy}
                onClick={() => void begin(false)}
              >
                <VolumeX size={13} aria-hidden="true" /> Enter silently{" "}
                <ArrowRight size={13} aria-hidden="true" />
              </button>
              <p className="film-duration">
                00:06.8 <span /> ORIGINAL AUDIO <span /> SKIP ANYTIME
              </p>
            </section>
          )}

          <div className="film-name-wall" aria-hidden="true">
            <span>{profile.firstName}</span>
            <span>{profile.lastName}</span>
          </div>
          <div className="film-orbit film-orbit-outer" aria-hidden="true" />
          <div className="film-orbit film-orbit-inner" aria-hidden="true" />
          <div className="film-photo-position">
            <div
              className="film-photo-echo film-photo-echo-one"
              aria-hidden="true"
            />
            <div
              className="film-photo-echo film-photo-echo-two"
              aria-hidden="true"
            />
            <div
              className={`film-photo${imageFailed ? " photo-unavailable" : ""}`}
            >
              <span className="film-photo-fallback" aria-hidden="true">
                EO.
              </span>
              <img
                src="/images/hero.jpg"
                alt={profile.name}
                width={960}
                height={1280}
                fetchPriority="high"
                onError={() => setImageFailed(true)}
              />
              <span className="film-photo-index" aria-hidden="true">
                FRAME 001 / THE HUMAN
              </span>
              <div className="film-photo-caption">
                <span>NOT AN AVATAR. A BUILDER.</span>
                <h2 id="entrance-title">
                  {profile.firstName}
                  <br />
                  {profile.lastName}
                  <b>.</b>
                </h2>
                <ArrowUpRight size={26} aria-hidden="true" />
              </div>
            </div>
            <span className="film-photo-note" aria-hidden="true">
              the face behind the ideas ↙
            </span>
            <span className="film-photo-stamp" aria-hidden="true">
              ✳
            </span>
          </div>

          {playing && (
            <div className="film-shot-label" aria-hidden="true">
              <span className="film-record-dot" />{" "}
              {impactVisible
                ? "03 / THE IMPACT"
                : craftVisible
                  ? "02 / THE CRAFT"
                  : "01 / THE HUMAN"}
              <span>EMMANUEL OLUYEMI</span>
            </div>
          )}
          <div
            className={`film-craft-deck${craftVisible ? " is-visible" : ""}`}
            aria-hidden="true"
          >
            <article
              className={`film-craft-shot ${craftIndex === 0 ? "is-active" : ""}`}
            >
              <p className="film-kicker">01 / LOGIC WITH PURPOSE</p>
              <h3>
                I engineer
                <br />
                <span>the backbone.</span>
              </h3>
              <p>
                Backend systems. APIs. Web experiences.
                <br />
                The invisible work that makes everything work.
              </p>
              <div className="film-system">
                <span>
                  <Code2 size={22} />
                  IDEA
                </span>
                <i />
                <span>
                  <Database size={22} />
                  ENGINE
                </span>
                <i />
                <span>
                  <Layers size={22} />
                  PRODUCT
                </span>
              </div>
              <div className="film-code-line">
                <Braces size={16} />
                <code>Python + Django + React</code>
                <span>→ BUILT TO SCALE</span>
              </div>
            </article>
            <article
              className={`film-craft-shot film-craft-mobile ${craftIndex === 1 ? "is-active" : ""}`}
            >
              <p className="film-kicker">
                02 / SMALL SCREEN. BIG POSSIBILITIES.
              </p>
              <h3>
                I make
                <br />
                <span>ideas move.</span>
              </h3>
              <p>
                Cross-platform mobile experiences.
                <br />
                Built with Flutter. Made for actual people.
              </p>
              <div className="film-mobile-demo">
                <div className="film-mini-phone">
                  <i />
                  <Smartphone size={24} />
                  <div>
                    <b />
                    <b />
                    <b />
                    <b />
                  </div>
                  <small />
                </div>
                <div className="film-mobile-label">
                  <span>DART × FLUTTER</span>
                  <strong>
                    One idea.
                    <br />
                    Every screen.
                  </strong>
                  <ArrowUpRight size={22} />
                </div>
              </div>
            </article>
            <article
              className={`film-craft-shot film-craft-ai ${craftIndex === 2 ? "is-active" : ""}`}
            >
              <p className="film-kicker">03 / INTELLIGENCE, APPLIED.</p>
              <h3>
                I turn AI into
                <br />
                <span>actual impact.</span>
              </h3>
              <p>
                Useful intelligence. Thoughtful automation.
                <br />
                Real products that solve real problems.
              </p>
              <div className="film-ai-demo">
                <span>
                  <Bot size={30} />
                </span>
                <i />
                <span>
                  <Sparkles size={35} />
                </span>
                <i />
                <span>
                  <Layers size={28} />
                </span>
              </div>
              <div className="film-code-line">
                <span>CLASSMILLIA</span>
                <span>DJANGOPILOT</span>
                <span>SELLARIS AI</span>
              </div>
            </article>
          </div>

          <div
            className={`film-impact${impactVisible ? " is-visible" : ""}`}
            aria-hidden="true"
          >
            <div className="film-project film-project-one">
              <img
                src="/images/portfolio/classmillia.jpg"
                alt=""
                width={320}
                height={200}
              />
              <span>
                CLASSMILLIA <ArrowUpRight size={12} />
              </span>
            </div>
            <div className="film-project film-project-two">
              <img
                src="/images/portfolio/campally.jpg"
                alt=""
                width={320}
                height={200}
              />
              <span>
                CAMPYALLY <ArrowUpRight size={12} />
              </span>
            </div>
            <div className="film-impact-title">
              <span>LESS TALK. MORE BUILD.</span>
              <h3>
                Let’s build
                <br />
                <em>what’s next.</em>
                <b>↗</b>
              </h3>
            </div>
          </div>
        </div>

        <footer className="film-footer">
          <p
            id="film-audio-status"
            className={`film-audio-status${!playing ? " on-gate" : ""}`}
            role="status"
            aria-live="polite"
          >
            {soundStatus}
          </p>
          <div className="film-footer-meta" aria-hidden="true">
            <span>MADE OF CURIOSITY. DRIVEN BY CRAFT.</span>
            {playing ? (
              <>
                <div className="film-chapters">
                  <span className={phase === "portrait" ? "active" : ""}>
                    THE HUMAN
                  </span>
                  <i />
                  <span className={craftVisible ? "active" : ""}>
                    THE CRAFT
                  </span>
                  <i />
                  <span className={impactVisible ? "active" : ""}>
                    THE IMPACT
                  </span>
                </div>
                <span ref={timeRef}>00:00.0</span>
              </>
            ) : (
              <span>BASED IN NIGERIA. BUILDING EVERYWHERE.</span>
            )}
          </div>
          {playing && (
            <div className="film-progress" aria-hidden="true">
              <span ref={progressRef} />
            </div>
          )}
        </footer>
      </div>
    </dialog>
  );
}
