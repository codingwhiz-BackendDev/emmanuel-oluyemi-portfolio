import { useEffect, useState } from 'react';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { label: 'About', href: '#about' },
    { label: 'Work', href: '#projects' },
    { label: 'Experience', href: '#experience' },
  ];

  return (
    <header
      className="fixed top-5 md:top-10 left-1/2 -translate-x-1/2 z-50"
      style={{
        transform: `translateX(-50%) translateY(${scrolled ? '0' : '0'})`,
      }}
    >
      <nav
        className="rounded-full border border-border bg-background/85 backdrop-blur-md shadow-sm px-1.5 md:px-2 py-1.5 md:py-2 flex items-center gap-0.5 md:gap-1 transition-all duration-200"
        style={{ boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.06)' : '0 1px 3px rgba(0,0,0,0.03)' }}
      >
        {/* Logo */}
        <a
          href="#hero"
          className="size-8 md:size-9 rounded-full flex items-center justify-center font-display font-extrabold text-foreground hover:bg-muted transition-colors"
          style={{ letterSpacing: '-0.09em' }}
          aria-label="Home"
        >
          EO
        </a>

        <div className="h-5 w-px bg-border mx-0.5" />

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-0.5">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="nav-nudge rounded-full px-3 h-8 flex items-center text-[13px] md:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="h-5 w-px bg-border mx-0.5 hidden md:block" />

        {/* Mobile menu items */}
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
          className="bg-foreground text-background rounded-full px-3 md:px-4 h-8 md:h-9 flex items-center text-[13px] md:text-sm font-medium hover:bg-foreground/90 active:scale-[0.97] transition-all duration-150"
          style={{ transitionTimingFunction: 'var(--ease-out)' }}
        >
          Contact
        </a>
      </nav>
    </header>
  );
}
