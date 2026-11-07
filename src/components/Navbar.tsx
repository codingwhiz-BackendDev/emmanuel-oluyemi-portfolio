import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { profile } from "@/data";

const navItems = [
  { label: "About", id: "about" },
  { label: "Work", id: "projects" },
  { label: "Experience", id: "experience" },
];
const sectionIds = ["hero", ...navItems.map(({ id }) => id), "contact"];
const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7446ed] focus-visible:ring-offset-4 focus-visible:ring-offset-[#f7f7f2]";

export function Navbar() {
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    const update = () => {
      frame = 0;
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        scrollable > 0
          ? Math.min(1, Math.max(0, window.scrollY / scrollable))
          : 0;
      if (progressRef.current)
        progressRef.current.style.transform = `scaleX(${progress})`;

      const marker = Math.min(window.innerHeight * 0.3, 220);
      let current = sections[0]?.id ?? "hero";
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= marker) current = section.id;
      }
      if (scrollable > 0 && window.scrollY >= scrollable - 2)
        current = "contact";
      setActiveSection((previous) =>
        previous === current ? previous : current,
      );
    };
    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(document.body);
    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !headerRef.current?.contains(event.target)
      ) {
        setMobileOpen(false);
      }
    };
    const desktop = window.matchMedia("(min-width: 768px)");
    const onBreakpoint = () => {
      if (desktop.matches) setMobileOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    desktop.addEventListener("change", onBreakpoint);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [mobileOpen]);

  return (
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-50 border-b border-[#18191c]/10 bg-[#f7f7f2]/95 text-[#18191c] backdrop-blur-xl"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setMobileOpen(false);
      }}
    >
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-20 max-w-[1280px] items-center justify-between gap-3 px-5 sm:px-8 lg:px-12"
      >
        <a
          href="#hero"
          aria-label={`${profile.name} — home`}
          onClick={() => setMobileOpen(false)}
          className={`group flex shrink-0 items-center gap-3 rounded-lg ${focusRing}`}
        >
          <span className="flex size-11 items-center justify-center rounded-[14px] bg-[#18191c] font-display text-xl font-extrabold tracking-[-0.12em] text-[#d7fa77] transition-colors group-hover:bg-[#7446ed] group-hover:text-white">
            EO<span className="text-[#d7fa77]">.</span>
          </span>
          <span className="hidden font-display text-[17px] font-bold leading-[1.05] tracking-tight min-[380px]:block">
            {profile.firstName}
            <br />
            {profile.lastName}
            <span className="text-[#7446ed]">.</span>
          </span>
        </a>

        <div className="ml-auto hidden items-center gap-1 md:flex lg:gap-3">
          {navItems.map(({ label, id }) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={activeSection === id ? "location" : undefined}
              className={`rounded-full px-4 py-3 text-sm font-medium transition-colors ${focusRing} ${activeSection === id ? "bg-[#18191c] text-[#f7f7f2]" : "text-[#18191c]/70 hover:bg-[#18191c]/5 hover:text-[#18191c]"}`}
            >
              {label}
            </a>
          ))}
        </div>

        <a
          href="#contact"
          aria-current={activeSection === "contact" ? "location" : undefined}
          onClick={() => setMobileOpen(false)}
          className={`ml-auto inline-flex min-h-11 items-center gap-2 rounded-full bg-[#7446ed] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#5e32cf] md:ml-4 sm:px-5 ${focusRing}`}
        >
          Let’s talk <ArrowUpRight aria-hidden="true" className="size-4" />
        </a>
        <button
          ref={toggleRef}
          type="button"
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMobileOpen((open) => !open)}
          className={`flex size-11 shrink-0 items-center justify-center rounded-full border border-[#18191c]/20 md:hidden ${focusRing}`}
        >
          {mobileOpen ? (
            <X aria-hidden="true" className="size-5" />
          ) : (
            <Menu aria-hidden="true" className="size-5" />
          )}
        </button>
      </nav>

      <nav
        id="mobile-navigation"
        aria-label="Mobile navigation"
        hidden={!mobileOpen}
        className="border-t border-[#18191c]/10 px-5 pb-6 pt-3 md:hidden"
      >
        {navItems.map(({ label, id }, index) => (
          <a
            key={id}
            href={`#${id}`}
            aria-current={activeSection === id ? "location" : undefined}
            onClick={() => setMobileOpen(false)}
            className={`my-1 flex min-h-14 items-center justify-between rounded-xl px-4 font-display text-2xl font-semibold ${focusRing} ${activeSection === id ? "bg-[#d7fa77]" : "hover:bg-[#18191c]/5"}`}
          >
            <span>
              <span
                aria-hidden="true"
                className="mr-4 align-middle font-sans text-xs text-[#18191c]/60"
              >
                0{index + 1}
              </span>
              {label}
            </span>
            <ArrowUpRight aria-hidden="true" className="size-5" />
          </a>
        ))}
      </nav>
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[2px]">
        <div
          ref={progressRef}
          className="h-full origin-left bg-[#7446ed]"
          style={{ transform: "scaleX(0)" }}
        />
      </div>
    </header>
  );
}
