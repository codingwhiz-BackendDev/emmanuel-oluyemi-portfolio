import { useCallback, useLayoutEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Bot,
  Braces,
  Code2,
  Command,
  Smartphone,
} from "lucide-react";
import { profile } from "@/data";
import "./Entrance.css";

const REVEAL_AT = 3900;
const FINISH_AT = 4800;

interface EntranceProps {
  onReveal: () => void;
  onComplete: () => void;
}

export function Entrance({ onReveal, onComplete }: EntranceProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const finishedRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [revealing, setRevealing] = useState(false);

  const complete = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    if (dialogRef.current?.open) dialogRef.current.close();
    onComplete();
  }, [onComplete]);

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
    const start = () => {
      if (started || finishedRef.current) return;
      started = true;
      setReady(true);
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
    preference.addEventListener("change", handlePreference);

    return () => {
      window.clearTimeout(imageDeadline);
      window.clearTimeout(revealTimer);
      window.clearTimeout(finishTimer);
      image?.removeEventListener("load", start);
      image?.removeEventListener("error", start);
      preference.removeEventListener("change", handlePreference);
      if (dialog.open) dialog.close();
      body.style.overflow = overflow;
      body.style.paddingRight = paddingRight;
    };
  }, [complete, onReveal]);

  return (
    <dialog
      ref={dialogRef}
      className={`entrance${ready ? " entrance-ready" : ""}${revealing ? " entrance-revealing" : ""}`}
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
        <header className="entrance-header">
          <span className="entrance-brand" aria-hidden="true">
            EO<span>.</span>
          </span>
          <span className="entrance-edition" aria-hidden="true">
            NOT A TEMPLATE. A WHOLE MINDSET.
          </span>
          <button type="button" onClick={complete} className="entrance-skip">
            Skip intro <ArrowUpRight size={15} aria-hidden="true" />
          </button>
        </header>

        <p id="entrance-description" className="sr-only">
          Meet {profile.name}. I build backend systems with Python and Django,
          mobile apps with Flutter, AI-powered products, and web experiences
          with React.
        </p>
        <div className="entrance-scene">
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
