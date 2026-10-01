import { useEffect, useState } from 'react';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

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

  const navItems = [
    { label: 'About', href: '#about' },
    { label: 'Work', href: '#projects' },
    { label: 'Experience', href: '#experience' },
  ];

  return (
    <header className="fixed top-5 md:top-10 left-1/2 -translate-x-1/2 z-50">
      <nav
        className="rounded-full border border-border bg-background/85 backdrop-blur-md px-1.5 md:px-2 py-1.5 md:py-2 flex items-center gap-0.5 md:gap-1 transition-all duration-200"
        style={{ boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.06)' : '0 1px 3px rgba(0,0,0,0.03)' }}
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
        <div className="hidden md:flex items-center gap-0.5">
          {navItems.map((item) => {
            const isActive = activeSection === item.href.slice(1);
            return (
              <a
                key={item.label}
                href={item.href}
                className={`nav-nudge rounded-full px-3 h-8 flex items-center text-[13px] md:text-sm font-medium transition-colors ${
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
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="nav-nudge rounded-full px-2 h-8 flex items-center text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Contact button */}
        <a
          href="#contact"
          className={`bg-foreground text-background rounded-full px-3 md:px-4 h-8 md:h-9 flex items-center text-[13px] md:text-sm font-medium hover:bg-foreground/90 active:scale-[0.97] transition-all duration-150 ${
            activeSection === 'contact' ? 'ring-2 ring-foreground/20' : ''
          }`}
          style={{ transitionTimingFunction: 'var(--ease-out)' }}
        >
          Contact
        </a>
      </nav>
    </header>
  );
}
