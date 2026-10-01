import { ArrowDown, Twitter, Github, Linkedin, Mail } from 'lucide-react';
import { SplitText } from './SplitText';
import { profile } from '@/data';

export function Hero() {
  return (
    <section
      id="hero"
      className="min-h-[100dvh] flex flex-col items-center justify-center px-4 pt-24 pb-10 relative"
      style={{
        backgroundImage: 'url(/images/hero.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

      {/* Content wrapper with z-index */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full">
      {/* Profile photo */}
      <a
        href="#about"
        className="group block mb-8"
        style={{
          opacity: 0,
          transform: 'scale(0.95)',
          animation: 'fadeIn 0.6s var(--ease-out) 0.1s forwards',
        }}
      >
        <div className="size-24 md:size-28 rounded-full border border-border overflow-hidden transition-transform duration-200 group-hover:rotate-3 group-hover:scale-105">
          <img
            src="/images/hero.jpg"
            alt="Emmanuel Oluyemi"
            className="w-full h-full object-cover"
          />
        </div>
      </a>

      {/* H1 */}
      <h1 className="text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.05] tracking-tight mb-4">
        <SplitText text={`Hey, I'm ${profile.firstName} ${profile.lastName}.`} charDelay={25} />
      </h1>

      {/* H2 - role */}
      <h2 className="text-center text-xl md:text-2xl font-medium text-muted-foreground leading-[1.05] tracking-tight mb-6">
        <SplitText text={profile.role} delay={400} charDelay={30} />
      </h2>

      {/* Subtitle */}
      <p
        className="text-lg text-muted-foreground max-w-xl text-center leading-relaxed mb-6"
        style={{
          opacity: 0,
          animation: 'fadeIn 0.6s var(--ease-out) 0.8s forwards',
        }}
      >
        A 20-year-old Backend Developer from Nigeria building scalable, secure web
        applications with Django &amp; Python — turning ideas into real{' '}
        <span className="font-accent text-[1.3em] text-foreground">products</span>.
      </p>

      {/* Social icons */}
      <div
        className="flex gap-4 mb-8"
        style={{
          opacity: 0,
          animation: 'fadeIn 0.6s var(--ease-out) 1s forwards',
        }}
      >
        <a
          href={profile.socials.x}
          target="_blank"
          rel="noopener noreferrer"
          className="size-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
          aria-label="X (Twitter)"
        >
          <Twitter className="size-5" />
        </a>
        <a
          href={profile.socials.github}
          target="_blank"
          rel="noopener noreferrer"
          className="size-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
          aria-label="GitHub"
        >
          <Github className="size-5" />
        </a>
        <a
          href={profile.socials.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="size-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
          aria-label="LinkedIn"
        >
          <Linkedin className="size-5" />
        </a>
        <a
          href={profile.socials.email}
          className="size-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
          aria-label="Email"
        >
          <Mail className="size-5" />
        </a>
      </div>

      {/* Buttons */}
      <div
        className="flex gap-3 mt-2"
        style={{
          opacity: 0,
          animation: 'fadeIn 0.6s var(--ease-out) 1.2s forwards',
        }}
      >
        <a
          href="#projects"
          className="bg-foreground text-background rounded-full h-11 px-8 flex items-center font-medium text-sm hover:bg-foreground/90 active:scale-[0.97] transition-all duration-150"
          style={{ transitionTimingFunction: 'var(--ease-out)' }}
        >
          View my work
        </a>
        <a
          href="#contact"
          className="border border-input bg-background rounded-full h-11 px-8 flex items-center font-medium text-sm hover:bg-accent active:scale-[0.97] transition-all duration-150"
          style={{ transitionTimingFunction: 'var(--ease-out)' }}
        >
          Get in touch
        </a>
      </div>

      {/* Scroll down */}
      <a
        href="#about"
        className="absolute md:bottom-8 bottom-4 size-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Scroll down"
      >
        <ArrowDown
          className="size-4"
          style={{ animation: 'gentle-bounce 2.4s ease-in-out infinite' }}
        />
      </a>
      </div>
    </section>
  );
}
