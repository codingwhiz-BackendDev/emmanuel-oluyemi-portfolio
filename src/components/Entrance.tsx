import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { profile } from "@/data";
import "./Entrance.css";

const REVEAL_AT = 2700;
const FINISH_AT = 3700;

interface EntranceProps {
  onReveal: () => void;
  onComplete: () => void;
}

export function Entrance({ onReveal, onComplete }: EntranceProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const finishedRef = useRef(false);
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

    // A timed introduction, not a simulated asset-loading progress indicator.
    const revealTimer = window.setTimeout(() => {
      setRevealing(true);
      onReveal();
    }, REVEAL_AT);
    const finishTimer = window.setTimeout(complete, FINISH_AT);
    const handlePreference = () => {
      if (preference.matches) complete();
    };
    preference.addEventListener("change", handlePreference);

    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(finishTimer);
      preference.removeEventListener("change", handlePreference);
      if (dialog.open) dialog.close();
      body.style.overflow = overflow;
      body.style.paddingRight = paddingRight;
    };
  }, [complete, onReveal]);

  return (
    <dialog
      ref={dialogRef}
      className={`entrance ${revealing ? "entrance-revealing" : ""}`}
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
        <div className="entrance-orbit entrance-orbit-one" aria-hidden="true" />
        <div className="entrance-orbit entrance-orbit-two" aria-hidden="true" />
        <header className="entrance-header">
          <span className="entrance-brand" aria-hidden="true">
            EO<span>.</span>
          </span>
          <span className="entrance-edition" aria-hidden="true">
            A MIND IN MOTION / {new Date().getFullYear()}
          </span>
          <button type="button" onClick={complete} className="entrance-skip">
            Skip intro <ArrowUpRight size={15} aria-hidden="true" />
          </button>
        </header>

        <div className="entrance-center">
          <div className="entrance-greeting" aria-hidden="true">
            <span /> A LITTLE INTRODUCTION <span />
          </div>
          <div className="entrance-name-wrap">
            <span className="entrance-handwritten" aria-hidden="true">
              Hello, I’m
            </span>
            <h2
              id="entrance-title"
              className="entrance-name"
              aria-label={`Hello, I’m ${profile.name}`}
            >
              {[profile.firstName, profile.lastName].map((name, row) => (
                <span
                  className={`entrance-name-line entrance-name-line-${row}`}
                  key={name}
                  aria-hidden="true"
                >
                  {Array.from(name).map((letter, index) => (
                    <span
                      className="entrance-letter"
                      key={index}
                      style={{
                        animationDelay: `${240 + row * 230 + index * 38}ms`,
                      }}
                    >
                      {letter}
                    </span>
                  ))}
                  {row === 1 && <span className="entrance-name-dot" />}
                </span>
              ))}
            </h2>
            <span className="entrance-star" aria-hidden="true">
              ✳
            </span>
          </div>
          <p id="entrance-description" className="entrance-role">
            Software engineer.
            <span />
            Mobile developer.
            <span />
            Idea chaser.
          </p>
          <div className="entrance-message" aria-hidden="true">
            <span className="entrance-prompt">&gt;_</span>
            <span>Turning “what if” into what’s next.</span>
          </div>
        </div>

        <div className="entrance-side-note" aria-hidden="true">
          THOUGHTFULLY ENGINEERED. UNAPOLOGETICALLY CURIOUS.
        </div>
        <footer className="entrance-footer" aria-hidden="true">
          <div className="entrance-footer-copy">
            <span>
              <i /> FROM NIGERIA. TO THE WEB.
            </span>
            <span>
              YOU’RE ABOUT TO MEET THE WORK <ArrowUpRight size={14} />
            </span>
          </div>
          <div className="entrance-timeline">
            <span />
          </div>
          <div className="entrance-timeline-label">
            <span>OPENING SEQUENCE</span>
            <span>IDEA → CODE → IMPACT</span>
          </div>
        </footer>
      </div>
    </dialog>
  );
}
