import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import {
  ArrowUp,
  ArrowUpRight,
  Coffee,
  GitCommitHorizontal,
  Maximize2,
  Pause,
  Play,
  Rocket,
  RotateCcw,
  Trophy,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import {
  createGame,
  HEIGHT,
  jump,
  startGame,
  stepGame,
  togglePause,
  WIDTH,
  type GameState,
} from "./shipItEngine";
import { drawGame } from "./shipItRenderer";
import { useShipItAudio } from "@/hooks/useShipItAudio";

const BEST_KEY = "eo-ship-it-best-v1";
function readBest() {
  try {
    const value = Number(localStorage.getItem(BEST_KEY));
    return Number.isSafeInteger(value) && value > 0 ? value : 0;
  } catch {
    return 0;
  }
}
function snapshot(game: GameState) {
  return {
    status: game.status,
    score: game.score,
    milestone: game.milestone,
    commits: game.commits,
    coffees: game.coffees,
    reason: game.reason,
    time: Math.floor(game.time),
  };
}

export default function ShipItArcade({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef(createGame());
  const {
    soundEnabled,
    soundStatus,
    start: startAudio,
    pause: pauseAudio,
    resume: resumeAudio,
    playEffect,
    toggleSound,
  } = useShipItAudio();
  const reducedMotion = useRef(
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [hud, setHud] = useState(() => snapshot(gameRef.current));
  const [best, setBest] = useState(readBest);
  const bestRef = useRef(best);
  const [newBest, setNewBest] = useState(false);
  const [canvasUnavailable, setCanvasUnavailable] = useState(false);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    context.setTransform(
      canvas.width / WIDTH,
      0,
      0,
      canvas.height / HEIGHT,
      0,
      0,
    );
    drawGame(context, gameRef.current, reducedMotion.current);
  }, []);

  const pause = useCallback(() => {
    togglePause(gameRef.current);
    if (gameRef.current.status === "paused") pauseAudio();
    else if (gameRef.current.status === "running") resumeAudio();
    setHud(snapshot(gameRef.current));
    canvasRef.current?.focus({ preventScroll: true });
  }, [pauseAudio, resumeAudio]);

  const start = useCallback(() => {
    gameRef.current = startGame();
    startAudio();
    setNewBest(false);
    setHud(snapshot(gameRef.current));
    canvasRef.current?.focus({ preventScroll: true });
  }, [startAudio]);

  const hop = useCallback(() => {
    if (jump(gameRef.current)) {
      playEffect(gameRef.current.jumps === 2 ? "double-jump" : "jump");
      draw();
    }
  }, [draw, playEffect]);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const overflow = document.body.style.overflow;
    const padding = document.body.style.paddingRight;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    const existingPadding =
      parseFloat(getComputedStyle(document.body).paddingRight) || 0;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    if (gap > 0)
      document.body.style.paddingRight = `${existingPadding + gap}px`;
    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = padding;
      if (previousFocus?.isConnected)
        previousFocus.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas?.getContext("2d")) {
      setCanvasUnavailable(true);
      return;
    }
    const resize = () => {
      const width = canvas.getBoundingClientRect().width;
      const density = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(width * density));
      canvas.height = Math.max(
        1,
        Math.round(((width * HEIGHT) / WIDTH) * density),
      );
      draw();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onPreference = () => {
      reducedMotion.current = preference.matches;
      draw();
    };
    preference.addEventListener("change", onPreference);
    const autoPause = () => {
      if (gameRef.current.status === "running") {
        gameRef.current.status = "paused";
        pauseAudio();
        setHud(snapshot(gameRef.current));
      }
    };
    const onVisibility = () => {
      if (document.hidden) autoPause();
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", autoPause);
    return () => {
      observer.disconnect();

      preference.removeEventListener("change", onPreference);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", autoPause);
    };
  }, [draw, pauseAudio]);

  useEffect(() => {
    draw();
    if (hud.status !== "running") return;
    let frame = 0;
    let previous = performance.now();
    let lastUpdate = previous;
    const animate = (now: number) => {
      if (gameRef.current.status !== "running") return;
      const game = gameRef.current;
      const previousCommits = game.commits;
      const previousCoffees = game.coffees;
      // Catch up in collision-safe steps on slower devices without letting a
      // suspended browser tab advance an entire run in one frame.
      let remaining = Math.min(0.25, (now - previous) / 1000);
      while (remaining > 0 && game.status === "running") {
        const step = Math.min(1 / 120, remaining);
        stepGame(game, step);
        remaining -= step;
      }
      previous = now;
      draw();
      if (game.status === "over") {
        pauseAudio();
        playEffect("crash");
        if (game.score > bestRef.current) {
          bestRef.current = game.score;
          setBest(game.score);
          setNewBest(true);
          try {
            localStorage.setItem(BEST_KEY, String(game.score));
          } catch {
            /* Storage can be disabled in private browsers. */
          }
        }
        setHud(snapshot(game));
        return;
      }
      if (game.commits > previousCommits) playEffect("commit");
      if (game.coffees > previousCoffees) playEffect("coffee");
      if (now - lastUpdate >= 100) {
        setHud(snapshot(game));
        lastUpdate = now;
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [hud.status, draw, pauseAudio, playEffect]);

  const onKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.repeat) return;
    const key = event.key.toLowerCase();
    if (key === "m") {
      event.preventDefault();
      toggleSound();
      return;
    }
    if (key === "p") {
      event.preventDefault();
      if (
        gameRef.current.status === "running" ||
        gameRef.current.status === "paused"
      )
        pause();
      return;
    }
    if (event.target instanceof HTMLElement && event.target.closest("button"))
      return;
    if (key === " " || key === "arrowup" || key === "w") {
      event.preventDefault();
      if (gameRef.current.status === "running") hop();
      else if (gameRef.current.status === "paused") pause();
      else start();
    }
  };

  const running = hud.status === "running";
  const paused = hud.status === "paused";
  const over = hud.status === "over";
  const soundActive = soundEnabled || soundStatus.startsWith("Loading");
  return (
    <dialog
      ref={dialogRef}
      className={`ship-dialog ship-is-${hud.status}`}
      aria-labelledby="ship-title"
      aria-describedby="ship-instructions"
      onKeyDown={onKeyDown}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div className="ship-shell">
        <header className="ship-header">
          <div className="ship-logo">
            <Rocket size={25} aria-hidden="true" />
            <div>
              <strong id="ship-title">SHIP IT!</strong>
              <small>THE DEVELOPER RUN</small>
            </div>
          </div>
          <div className="ship-header-actions">
            <button
              type="button"
              className="ship-icon-button"
              onClick={toggleSound}
              aria-label={
                soundActive
                  ? "Mute game music and effects"
                  : "Enable game music and effects"
              }
              aria-pressed={soundActive}
              aria-describedby="ship-audio-status"
              title={
                soundActive ? "Mute music & effects" : "Enable music & effects"
              }
            >
              {soundActive ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
            <button
              type="button"
              className="ship-icon-button"
              onClick={pause}
              disabled={!running && !paused}
              aria-label={paused ? "Resume game" : "Pause game"}
              aria-pressed={paused}
            >
              {paused ? <Play size={18} /> : <Pause size={18} />}
            </button>
            <button
              type="button"
              className="ship-icon-button"
              onClick={onClose}
              aria-label="Close game and return to portfolio"
            >
              <X size={21} />
            </button>
          </div>
        </header>
        <div className="ship-hud">
          <div className="ship-stat">
            <small>RELEASE SCORE</small>
            <strong>{String(hud.score).padStart(5, "0")}</strong>
          </div>
          <div className="ship-level">
            <span>
              <i /> {hud.milestone}
            </span>
            <small>
              {hud.commits} COMMITS · {hud.coffees} COFFEES
            </small>
          </div>
          <div className="ship-best">
            <small>
              <Trophy size={12} aria-hidden="true" /> PERSONAL BEST
            </small>
            <strong>{String(best).padStart(5, "0")}</strong>
          </div>
        </div>
        <div className="ship-screen">
          <canvas
            ref={canvasRef}
            className="ship-canvas"
            width={WIDTH}
            height={HEIGHT}
            tabIndex={0}
            role="img"
            aria-label="Side-scrolling runner. Byte the animated courier robot jumps over bugs, outages, and scope creep while collecting commits and coffee."
            aria-describedby="ship-instructions"
            onPointerDown={(event) => {
              if (running) {
                event.preventDefault();
                canvasRef.current?.focus({ preventScroll: true });
                hop();
              }
            }}
          >
            Your browser needs Canvas support to play Ship It. You can still
            explore the full portfolio.
          </canvas>
          {(!running || canvasUnavailable) && (
            <div className="ship-overlay">
              <div className="ship-overlay-card">
                <p className="ship-eyebrow">
                  {canvasUnavailable
                    ? "ARCADE UNAVAILABLE"
                    : paused
                      ? "A LITTLE BREATHING ROOM"
                      : over
                        ? newBest
                          ? "NEW PERSONAL BEST ✦"
                          : "EVEN GREAT DEVS HIT BUGS"
                        : "ONE DEVELOPER. ZERO BORING MOMENTS."}
                </p>
                <h2>
                  {canvasUnavailable ? (
                    <>
                      Try another <em>browser.</em>
                    </>
                  ) : paused ? (
                    <>
                      Release <em>on hold.</em>
                    </>
                  ) : over ? (
                    <>
                      Deploy <em>interrupted.</em>
                    </>
                  ) : (
                    <>
                      Less scrolling.
                      <br />
                      <em>More shipping.</em>
                    </>
                  )}
                </h2>
                <p>
                  {canvasUnavailable
                    ? "This browser cannot display the game. Your portfolio experience is still ready."
                    : paused
                      ? "Your run is safe. Pick up right where you left off."
                      : over
                        ? hud.reason +
                          " Shake it off. Your next release awaits."
                        : "Meet Byte, your tiny release courier. Jump the bugs, dodge scope creep, and fuel up on coffee. Original music and arcade sounds kick in when you start."}
                </p>
                {over && (
                  <div className="ship-result-stats">
                    <span>
                      <strong>{hud.score}</strong> SCORE
                    </span>
                    <span>
                      <strong>{hud.commits}</strong> COMMITS
                    </span>
                    <span>
                      <strong>{hud.time}s</strong> SURVIVED
                    </span>
                  </div>
                )}
                {!canvasUnavailable && (
                  <button
                    type="button"
                    className="ship-primary"
                    onClick={paused ? pause : start}
                  >
                    {paused ? (
                      <Play size={18} />
                    ) : over ? (
                      <RotateCcw size={18} />
                    ) : (
                      <Rocket size={18} />
                    )}{" "}
                    {paused
                      ? "Resume the run"
                      : over
                        ? "Ship another release"
                        : "Let’s ship it"}
                    <ArrowUpRight size={18} />
                  </button>
                )}
                {(over || canvasUnavailable) && (
                  <button
                    type="button"
                    className="ship-secondary"
                    onClick={onClose}
                  >
                    Back to the real projects <ArrowUpRight size={15} />
                  </button>
                )}
                {!canvasUnavailable && (
                  <p className="ship-overlay-hint">
                    {paused
                      ? "P TO RESUME · ESC TO LEAVE"
                      : "SPACE / ↑ / W TO JUMP · TAP TWICE TO DOUBLE JUMP"}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="ship-mobile-actions">
          <button
            type="button"
            className="ship-jump"
            onPointerDown={(event) => {
              if (running) {
                event.preventDefault();
                hop();
              }
            }}
            onClick={(event) => {
              if (event.detail === 0 && running) hop();
            }}
            disabled={!running}
          >
            <ArrowUp size={20} /> Jump <small>Tap again for double jump</small>
          </button>
        </div>
        <footer className="ship-footer">
          <div className="ship-legend">
            <span>
              <i className="is-bug" /> DODGE BUGS
            </span>
            <span>
              <i className="is-coffee" />
              <Coffee size={13} /> +40
            </span>
            <span>
              <i className="is-commit" />
              <GitCommitHorizontal size={14} /> +75
            </span>
          </div>
          <p id="ship-instructions">
            <kbd>Space</kbd> / <kbd>↑</kbd> jump twice · <kbd>P</kbd> pause ·{" "}
            <kbd>M</kbd> mute · <kbd>Esc</kbd> exit. Touch: tap the game or
            Jump.
          </p>
          <span className="ship-local">
            <Maximize2 size={12} aria-hidden="true" /> Best saved on this device
          </span>
        </footer>
        <p
          id="ship-audio-status"
          className="ship-audio-status"
          role="status"
          aria-live="polite"
        >
          {soundStatus}
        </p>
        <p className="sr-only" role="status" aria-live="polite">
          {hud.status === "over"
            ? `Game over. Score ${hud.score}. ${newBest ? "New personal best." : ""} ${hud.reason}`
            : paused
              ? "Game paused."
              : running
                ? `Game running. ${hud.milestone}.`
                : "Ship It is ready. Start a run when you’re ready."}
        </p>
      </div>
    </dialog>
  );
}
