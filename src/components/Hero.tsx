import { ArrowDown, Twitter, Github, Linkedin, Mail } from 'lucide-react';
import { SplitText } from './SplitText';
import { profile } from '@/data';

export function Hero() {
  return (
    <section
      id="hero"
      className="min-h-[100dvh] flex flex-col items-center justify-center px-4 pt-24 pb-10 relative bg-gradient-to-br from-background via-background to-muted/20 overflow-hidden"
    >
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse"
          style={{
            animation: 'float 8s ease-in-out infinite',
            animationDelay: '0s',
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-foreground/10 rounded-full blur-3xl animate-pulse"
          style={{
            animation: 'float 10s ease-in-out infinite',
            animationDelay: '2s',
          }}
        />
      </div>

      {/* Content wrapper */}
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
        <div className="size-32 md:size-40 rounded-full border-2 border-border overflow-hidden transition-all duration-300 group-hover:rotate-3 group-hover:scale-105 group-hover:border-foreground/30 shadow-lg shadow-foreground/10 group-hover:shadow-xl group-hover:shadow-foreground/20">
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
      <h2 className="text-center text-xl md:text-2xl font-medium text-foreground leading-[1.05] tracking-tight mb-6 bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
        <SplitText text={profile.role} delay={400} charDelay={30} />
      </h2>

      {/* Subtitle */}
      <p
        className="text-lg text-muted-foreground max-w-2xl text-center leading-relaxed mb-6"
        style={{
          opacity: 0,
          animation: 'fadeIn 0.6s var(--ease-out) 0.8s forwards',
        }}
      >
        Building scalable, secure web applications and mobile experiences that turn
        innovative ideas into{' '}
        <span className="font-accent text-[1.3em] text-foreground">production-ready products</span>.
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
          className="size-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent hover:border-foreground/30 hover:scale-110 hover:shadow-md transition-all duration-200"
          aria-label="X (Twitter)"
        >
          <Twitter className="size-5" />
        </a>
        <a
          href={profile.socials.github}
          target="_blank"
          rel="noopener noreferrer"
          className="size-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent hover:border-foreground/30 hover:scale-110 hover:shadow-md transition-all duration-200"
          aria-label="GitHub"
        >
          <Github className="size-5" />
        </a>
        <a
          href={profile.socials.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="size-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent hover:border-foreground/30 hover:scale-110 hover:shadow-md transition-all duration-200"
          aria-label="LinkedIn"
        >
          <Linkedin className="size-5" />
        </a>
        <a
          href={profile.socials.email}
          className="size-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent hover:border-foreground/30 hover:scale-110 hover:shadow-md transition-all duration-200"
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
          className="bg-foreground text-background rounded-full h-11 px-8 flex items-center font-medium text-sm hover:bg-foreground/90 hover:shadow-lg hover:shadow-foreground/20 active:scale-[0.97] transition-all duration-200"
          style={{ transitionTimingFunction: 'var(--ease-out)' }}
        >
          View my work
        </a>
        <a
          href="#contact"
          className="border border-input bg-background text-foreground rounded-full h-11 px-8 flex items-center font-medium text-sm hover:bg-accent hover:border-foreground/30 hover:shadow-md active:scale-[0.97] transition-all duration-200"
          style={{ transitionTimingFunction: 'var(--ease-out)' }}
        >
          Get in touch
        </a>
      </div>

      {/* Scroll down */}
      <a
        href="#about"
        className="absolute md:bottom-8 bottom-4 size-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 hover:bg-accent hover:shadow-md transition-all duration-200"
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
