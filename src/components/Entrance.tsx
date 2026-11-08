import { useCallback, useLayoutEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Bot,
  Braces,
  Code2,
  Command,
  Smartphone,
  Volume2,
  VolumeX,
} from "lucide-react";
import { profile } from "@/data";
import { useIntroSound } from "@/hooks/useIntroSound";
import "./Entrance.css";

const REVEAL_AT = 4550;
const FINISH_AT = 5600;
const CHAPTERS = ["THE HUMAN", "THE CRAFT", "THE POSSIBILITIES"];

interface EntranceProps {
  onReveal: () => void;
  onComplete: () => void;
}

export function Entrance({ onReveal, onComplete }: EntranceProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const finishedRef = useRef(false);
  const timelineStartRef = useRef<number | null>(null);
  const {
    soundEnabled,
    soundStatus,
    toggleSound,
    startSoundtrack,
    stopSoundtrack,
  } = useIntroSound();
  const [chapter, setChapter] = useState(0);
  const [ready, setReady] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [revealing, setRevealing] = useState(false);

  const complete = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    stopSoundtrack();
    if (dialogRef.current?.open) dialogRef.current.close();
    onComplete();
  }, [onComplete, stopSoundtrack]);

  useLayoutEffect(() => {
    finishedRef.current = false;
    const dialog = dialogRef.current;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (
      !dialog ||
      typeof dialog.showModal !== "function" ||
      preference.matches
    ) {
      complete();
      return;
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

    let started = false;
    let revealTimer: number | undefined;
    let finishTimer: number | undefined;
    const chapterTimers: number[] = [];
    const start = () => {
      if (started || finishedRef.current) return;
      started = true;
      timelineStartRef.current = performance.now();
      startSoundtrack();
      setReady(true);
      chapterTimers.push(window.setTimeout(() => setChapter(1), 900));
      chapterTimers.push(window.setTimeout(() => setChapter(2), 3000));
      revealTimer = window.setTimeout(() => {
        setRevealing(true);
        onReveal();
      }, REVEAL_AT);
      finishTimer = window.setTimeout(complete, FINISH_AT);
    };
    const image = imageRef.current;
    image?.addEventListener("load", start);
    image?.addEventListener("error", start);
    if (image?.complete) start();
    // Let the portrait arrive first, but never trap visitors on a slow connection.
    const imageDeadline = window.setTimeout(start, 1500);
    const handlePreference = () => {
      if (preference.matches) complete();
    };
    const handleVisibility = () => {
      if (document.hidden) complete();
    };
    preference.addEventListener("change", handlePreference);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.clearTimeout(imageDeadline);
      window.clearTimeout(revealTimer);
      window.clearTimeout(finishTimer);
      chapterTimers.forEach(window.clearTimeout);
      timelineStartRef.current = null;
      stopSoundtrack();
      image?.removeEventListener("load", start);
      image?.removeEventListener("error", start);
      preference.removeEventListener("change", handlePreference);
      document.removeEventListener("visibilitychange", handleVisibility);
      if (dialog.open) dialog.close();
      body.style.overflow = overflow;
      body.style.paddingRight = paddingRight;
    };
  }, [complete, onReveal, startSoundtrack, stopSoundtrack]);

  return (
    <dialog
      ref={dialogRef}
      className={`entrance entrance-phase-${chapter}${ready ? " entrance-ready" : ""}${revealing ? " entrance-revealing" : ""}${soundEnabled ? " entrance-sound-on" : ""}`}
      aria-labelledby="entrance-title"
      aria-describedby="entrance-description"
      onCancel={(event) => {
        event.preventDefault();
        complete();
      }}
    >
      <div
        className="entrance-curtain entrance-curtain-lime"
        aria-hidden="true"
      />
      <div
        className="entrance-curtain entrance-curtain-violet"
        aria-hidden="true"
      />
      <div className="entrance-stage">
        <div className="entrance-grid" aria-hidden="true" />
        <div className="entrance-vignette" aria-hidden="true" />
        <div className="entrance-film-grain" aria-hidden="true" />
        <header className="entrance-header">
          <span className="entrance-brand" aria-hidden="true">
            EO<span>.</span>
          </span>
          <span className="entrance-edition" aria-hidden="true">
            AN EMMANUEL OLUYEMI ORIGINAL / VOL. 01
          </span>
          <div className="entrance-controls">
            <button
              type="button"
              className="entrance-sound"
              aria-pressed={soundEnabled}
              aria-label="Enable intro sound"
              aria-describedby="entrance-audio-status"
              onClick={() => {
                const elapsed =
                  timelineStartRef.current === null
                    ? 0
                    : (performance.now() - timelineStartRef.current) / 1000;
                void toggleSound(elapsed);
              }}
            >
              {soundEnabled ? (
                <Volume2 size={15} aria-hidden="true" />
              ) : (
                <VolumeX size={15} aria-hidden="true" />
              )}
              <span>{soundEnabled ? "Sound on" : "Tap for sound"}</span>
              <span className="entrance-sound-bars" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </span>
            </button>
            <button type="button" onClick={complete} className="entrance-skip">
              Skip intro{" "}
              <span className="entrance-escape-key" aria-hidden="true">
                ESC
              </span>
            </button>
          </div>
        </header>

        <p id="entrance-audio-status" className="sr-only" role="status">
          {soundStatus}
        </p>
        <p id="entrance-description" className="sr-only">
          Meet {profile.name}. I build backend systems with Python and Django,
          mobile apps with Flutter, AI-powered products, and web experiences
          with React.
        </p>
        <div className="entrance-scene">
          <div className="entrance-frame" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </div>
          <div className="entrance-scene-label" aria-hidden="true">
            <span className="entrance-record-dot" /> PERSONAL SHOWREEL{" "}
            <span>01:EO</span>
          </div>
          <div className="entrance-backtype" aria-hidden="true">
            <span>THE MIND.</span>
            <span>THE MAKER.</span>
          </div>
          <div className="entrance-halo" aria-hidden="true" />
          <svg
            className="entrance-connections"
            viewBox="0 0 1000 560"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M220 150 C340 150 320 240 470 260 M780 155 C650 155 690 250 530 270 M260 430 C370 430 350 320 470 300 M760 420 C650 420 660 330 530 300" />
          </svg>

          <div className="entrance-portrait-anchor">
            <div
              className={`entrance-portrait${imageFailed ? " entrance-image-failed" : ""}`}
            >
              <div className="entrance-photo">
                <span className="entrance-photo-fallback" aria-hidden="true">
                  EO.
                </span>
                <img
                  ref={imageRef}
                  src="/images/hero.jpg"
                  alt={profile.name}
                  width={960}
                  height={1280}
                  fetchPriority="high"
                  onError={() => setImageFailed(true)}
                />
                <span className="entrance-photo-corner" aria-hidden="true">
                  <Command size={17} /> BUILT DIFFERENT.
                </span>
              </div>
              <div className="entrance-photo-caption">
                <span>THE HUMAN BEHIND IT ALL</span>
                <h2 id="entrance-title">
                  {profile.firstName}
                  <br />
                  {profile.lastName}
                  <span>.</span>
                </h2>
                <ArrowUpRight size={28} aria-hidden="true" />
              </div>
            </div>
            <span className="entrance-photo-note" aria-hidden="true">
              yep, that’s me ↗
            </span>
            <span className="entrance-maker-stamp" aria-hidden="true">
              ✳
            </span>
          </div>

          <div className="entrance-skill entrance-backend" aria-hidden="true">
            <div className="entrance-card-top">
              <span className="entrance-window-dots">
                <i />
                <i />
                <i />
              </span>
              <span>01 / UNDER THE HOOD</span>
              <Braces size={15} />
            </div>
            <div className="entrance-card-title">
              <Code2 size={20} />
              <strong>Backend systems.</strong>
            </div>
            <div className="entrance-code">
              <span>
                def <b>build_something_great</b>():
              </span>
              <span>
                {" "}
                return <em>idea</em> + <em>execution</em>
              </span>
            </div>
            <div className="entrance-card-tags">
              <span>PYTHON</span>
              <span>DJANGO</span>
              <span>APIs</span>
            </div>
          </div>

          <div className="entrance-skill entrance-mobile" aria-hidden="true">
            <div className="entrance-phone">
              <span className="entrance-phone-notch" />
              <Smartphone size={23} />
              <div className="entrance-phone-tiles">
                <i />
                <i />
                <i />
                <i />
              </div>
              <span className="entrance-phone-home" />
            </div>
            <div>
              <span className="entrance-card-index">02 / IN YOUR POCKET</span>
              <strong>
                Mobile
                <br />
                magic.
              </strong>
              <span className="entrance-mobile-stack">DART + FLUTTER</span>
            </div>
          </div>

          <div className="entrance-skill entrance-web" aria-hidden="true">
            <div className="entrance-card-top">
              <span className="entrance-window-dots">
                <i />
                <i />
                <i />
              </span>
              <span>03 / ON THE WEB</span>
              <ArrowUpRight size={14} />
            </div>
            <div className="entrance-web-body">
              <img
                src="/images/portfolio/classmillia.jpg"
                alt=""
                width={160}
                height={100}
                decoding="async"
              />
              <div>
                <strong>
                  Ideas you
                  <br />
                  can click.
                </strong>
                <span>REACT · FULL STACK</span>
              </div>
            </div>
          </div>

          <div className="entrance-skill entrance-ai" aria-hidden="true">
            <span className="entrance-ai-icon">
              <Bot size={27} />
            </span>
            <div>
              <span className="entrance-card-index">
                04 / A LITTLE INTELLIGENCE
              </span>
              <strong>AI. Actual impact.</strong>
              <span className="entrance-ai-detail">
                SMARTER PRODUCTS. REAL PROBLEMS.
              </span>
            </div>
            <span className="entrance-ai-spark">✳</span>
          </div>
        </div>

        <footer className="entrance-footer">
          <div className="entrance-chapters" aria-hidden="true">
            {CHAPTERS.map((label, index) => (
              <span
                key={label}
                className={chapter === index ? "is-active" : ""}
              >
                <b>0{index + 1}</b>
                {label}
                <i />
              </span>
            ))}
          </div>
          <div className="entrance-build-line" aria-hidden="true">
            <span>I turn ideas into</span>
            <div className="entrance-word-window">
              <div className="entrance-word-reel">
                <span>powerful backends.</span>
                <span>mobile experiences.</span>
                <span>intelligent products.</span>
                <span>things that matter.</span>
              </div>
            </div>
          </div>
          <div className="entrance-footer-meta" aria-hidden="true">
            <span>ONE CURIOUS MIND. MANY POSSIBILITIES.</span>
            <span>
              MEET THE WORK <ArrowUpRight size={13} />
            </span>
          </div>
          <div className="entrance-timeline" aria-hidden="true">
            <span />
          </div>
        </footer>
      </div>
    </dialog>
  );
}
