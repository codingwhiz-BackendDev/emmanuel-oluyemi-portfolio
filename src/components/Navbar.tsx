import { useEffect, useLayoutEffect, useRef, useState } from 'react';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const desktopNavRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<{ left: number; width: number; show: boolean }>({
    left: 0,
    width: 0,
    show: false,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = ['hero', 'about', 'projects', 'experience', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Animate the active indicator pill behind desktop nav links
  useLayoutEffect(() => {
    const activeId = activeSection;
    const link = linkRefs.current[activeId];
    const nav = desktopNavRef.current;
    if (link && nav) {
      const navRect = nav.getBoundingClientRect();
      const linkRect = link.getBoundingClientRect();
      setIndicator({
        left: linkRect.left - navRect.left,
        width: linkRect.width,
        show: true,
      });
    } else {
      setIndicator((prev) => ({ ...prev, show: false }));
    }
  }, [activeSection]);

  const navItems = [
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Work', href: '#projects', id: 'projects' },
    { label: 'Experience', href: '#experience', id: 'experience' },
  ];

  return (
    <header className="fixed top-5 md:top-10 left-1/2 -translate-x-1/2 z-50">
      <nav
        className="rounded-full border border-border bg-background/80 backdrop-blur-xl px-1.5 md:px-2 py-1.5 md:py-2 flex items-center gap-0.5 md:gap-1 transition-all duration-300"
        style={{
          boxShadow: scrolled
            ? '0 8px 32px -8px hsl(var(--brand) / 0.15), 0 2px 8px rgba(0,0,0,0.06)'
            : '0 1px 3px rgba(0,0,0,0.03)',
        }}
      >
        {/* Logo */}
        <a
          href="#hero"
          className="size-8 md:size-9 rounded-full flex items-center justify-center font-display font-extrabold text-foreground hover:bg-muted hover:scale-110 transition-all duration-200"
          style={{ letterSpacing: '-0.09em' }}
          aria-label="Home"
        >
          EO
        </a>

        <div className="h-5 w-px bg-border mx-0.5" />

        {/* Nav links - desktop */}
        <div ref={desktopNavRef} className="hidden md:flex items-center gap-0.5 relative">
          {indicator.show && (
            <span
              className="nav-indicator h-8 top-1/2 -translate-y-1/2"
              style={{ left: indicator.left, width: indicator.width, opacity: 1 }}
            />
          )}
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.label}
                ref={(el) => {
                  linkRefs.current[item.id] = el;
                }}
                href={item.href}
                className={`nav-nudge relative z-10 rounded-full px-3 h-8 flex items-center text-sm font-medium transition-colors duration-200 ${
                  isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </div>

        <div className="h-5 w-px bg-border mx-0.5 hidden md:block" />

        {/* Nav links - mobile */}
        <div className="flex md:hidden items-center gap-0.5">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.label}
                href={item.href}
                className={`nav-nudge rounded-full px-2 h-8 flex items-center text-xs font-medium transition-colors ${
                  isActive ? 'text-foreground bg-muted' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </div>

        {/* Contact button */}
        <a
          href="#contact"
          className={`btn-primary rounded-full px-3 md:px-4 h-8 md:h-9 flex items-center text-[13px] md:text-sm font-medium active:scale-[0.97] transition-all duration-200 ${
            activeSection === 'contact' ? 'ring-2 ring-brand/30' : ''
          }`}
          style={{ transitionTimingFunction: 'var(--ease-out)' }}
        >
          <span className="relative z-10">Contact</span>
        </a>
      </nav>
    </header>
  );
}
