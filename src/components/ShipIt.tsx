import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ArrowUpRight, Gamepad2, Rocket } from "lucide-react";
import "./ShipIt.css";

const ShipItArcade = lazy(() => import("./ShipItArcade"));

export function ShipIt({ motionPaused = false }: { motionPaused?: boolean }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef(false);
  const close = useCallback(() => {
    restoreFocusRef.current = true;
    setOpen(false);
  }, []);
  useEffect(() => {
    if (!open && restoreFocusRef.current) {
      restoreFocusRef.current = false;
      launcherRef.current?.focus({ preventScroll: true });
    }
  }, [open]);
  const launch = async () => {
    if (loading || open) return;
    setLoading(true);
    setLoadError(false);
    try {
      await import("./ShipItArcade");
      setOpen(true);
    } catch {
      // Keep the portfolio usable if a stale deployment chunk cannot be loaded.
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section
        id="play"
        className={`ship-invite${motionPaused ? " ship-is-paused" : ""}`}
        aria-labelledby="ship-invite-title"
      >
        <div className="ship-invite-copy">
          <p className="ship-eyebrow">OFF THE CLOCK. STILL SHIPPING.</p>
          <h2 id="ship-invite-title">
            Are you bored?
            <br />
            Let’s{" "}
            <span style={{ color: "hsl(var(--brand))" }}>play a little.</span>
          </h2>
          <p>
            Meet my very unofficial development process: dodge bugs, outrun
            scope creep, collect coffee. One more run? Thought so.
          </p>
          <button
            ref={launcherRef}
            type="button"
            className="ship-open"
            onClick={() => void launch()}
            disabled={loading}
            aria-haspopup="dialog"
          >
            <Gamepad2 size={21} aria-hidden="true" />
            {loading ? "Opening the arcade…" : "Play Ship It!"}
            <ArrowUpRight size={19} aria-hidden="true" />
          </button>
          <p style={{ fontSize: 12 }}>
            No downloads. No sign-up. Just you versus production.
          </p>
          {loadError && (
            <p role="status">
              The arcade couldn’t load. Try again, or refresh for the latest
              version.
            </p>
          )}
        </div>
        <div className="ship-invite-art" aria-hidden="true">
          <div className="ship-orbit" />
          <span className="ship-float-code">git push origin fun</span>
          <span className="ship-float-code">BUGS: DODGED ↗</span>
          <span className="ship-float-code">+75 COMMIT</span>
          <span className="ship-float-code">COFFEE.LOAD()</span>
          <div className="ship-sticker">
            <Rocket size={30} />
            <span>
              SHIP
              <br />
              IT!
            </span>
            <small>THE DEVELOPER RUN ↗</small>
          </div>
        </div>
      </section>
      {open && (
        <Suspense fallback={null}>
          <ShipItArcade onClose={close} />
        </Suspense>
      )}
    </>
  );
}
