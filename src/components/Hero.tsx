import { ArrowDown, ArrowUpRight, Twitter, Github, Linkedin, Mail } from 'lucide-react';
import { SplitText } from './SplitText';
import { profile } from '@/data';

export function Hero() {
  return (
    <section
      id="hero"
      className="min-h-[100dvh] flex flex-col items-center justify-center px-4 pt-24 pb-10 relative bg-gradient-to-br from-background via-background to-muted/30 overflow-hidden"
    >
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{
            background:
              'radial-gradient(circle, hsl(var(--brand) / 0.22), transparent 70%)',
            animation: 'float-slow 14s ease-in-out infinite',
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl"
          style={{
            background:
              'radial-gradient(circle, hsl(var(--brand-light) / 0.18), transparent 70%)',
            animation: 'float-slow 18s ease-in-out infinite',
            animationDelay: '3s',
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-60"
          style={{
            background:
              'radial-gradient(circle, hsl(var(--brand-dark) / 0.1), transparent 70%)',
            animation: 'glowPulse 9s ease-in-out infinite',
          }}
        />
      </div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage:
            'radial-gradient(ellipse 70% 60% at 50% 45%, black, transparent 75%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 70% 60% at 50% 45%, black, transparent 75%)',
        }}
      />

      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full">
        {/* Profile photo */}
        <a
          href="#about"
          className="group block mb-8"
          style={{
            opacity: 0,
            transform: 'scale(0.95)',
            animation: 'scaleIn 0.7s var(--ease-spring) 0.1s forwards',
          }}
        >
          <div className="relative size-32 md:size-40 rounded-full overflow-hidden transition-all duration-300 group-hover:rotate-3 group-hover:scale-105 shadow-lg shadow-foreground/10 group-hover:shadow-xl group-hover:shadow-brand/30">
            {/* Animated gradient ring */}
            <div className="absolute -inset-1 rounded-full bg-brand-gradient animate-gradient" />
            <div className="absolute inset-[3px] rounded-full bg-background" />
            <img
              src="/images/hero.jpg"
              alt="Emmanuel Oluyemi"
              className="absolute inset-[3px] w-[calc(100%-6px)] h-[calc(100%-6px)] rounded-full object-cover"
            />
          </div>
        </a>

        {/* H1 */}
        <h1 className="text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.05] tracking-tight mb-4">
          <SplitText text={`Hey, I'm ${profile.firstName} ${profile.lastName}.`} charDelay={25} />
        </h1>

        {/* H2 - role */}
        <h2 className="text-center text-xl md:text-2xl font-medium leading-[1.05] tracking-tight mb-6">
          <span className="text-brand-gradient animate-gradient">
            <SplitText text={profile.role} delay={400} charDelay={30} />
          </span>
        </h2>

        {/* Subtitle */}
        <p
          className="text-lg text-muted-foreground max-w-2xl text-center leading-relaxed mb-6"
          style={{
            opacity: 0,
            animation: 'fadeInUp 0.7s var(--ease-out) 0.8s forwards',
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
            animation: 'fadeInUp 0.7s var(--ease-out) 1s forwards',
          }}
        >
          {[
            { Icon: Twitter, href: profile.socials.x, label: 'X (Twitter)' },
            { Icon: Github, href: profile.socials.github, label: 'GitHub' },
            { Icon: Linkedin, href: profile.socials.linkedin, label: 'LinkedIn' },
            { Icon: Mail, href: profile.socials.email, label: 'Email' },
          ].map(({ Icon, href, label }, i) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('mailto:') ? undefined : '_blank'}
              rel="noopener noreferrer"
              className="group size-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-brand-foreground hover:border-transparent hover:bg-brand-gradient hover:scale-110 hover:shadow-lg hover:shadow-brand/30 active:scale-95 transition-all duration-300"
              style={{
                opacity: 0,
                animation: `scaleIn 0.5s var(--ease-spring) ${1 + i * 0.08}s forwards`,
              }}
              aria-label={label}
            >
              <Icon className="size-5" />
            </a>
          ))}
        </div>

        {/* Buttons */}
        <div
          className="flex flex-wrap gap-3 mt-2 justify-center"
          style={{
            opacity: 0,
            animation: 'fadeInUp 0.7s var(--ease-out) 1.2s forwards',
          }}
        >
          <a
            href="#projects"
            className="btn-primary rounded-full h-11 px-8 flex items-center font-medium text-sm active:scale-[0.97] transition-all duration-200"
            style={{ transitionTimingFunction: 'var(--ease-out)' }}
          >
            <span>View my work</span>
          </a>
          <a
            href="#contact"
            className="btn-ghost border bg-background text-foreground rounded-full h-11 px-8 flex items-center font-medium text-sm active:scale-[0.97] transition-all duration-200"
            style={{ transitionTimingFunction: 'var(--ease-out)' }}
          >
            <span>Get in touch</span>
          </a>
        </div>

        {/* Featured project teaser */}
        <a
          href="https://classmillia.onrender.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-10 flex items-center gap-3 rounded-2xl border border-border bg-background/60 backdrop-blur-sm px-4 py-3 hover:border-brand/40 hover:bg-brand/5 hover:shadow-lg hover:shadow-brand/10 transition-all duration-300 max-w-sm"
          style={{
            opacity: 0,
            animation: 'fadeInUp 0.7s var(--ease-out) 1.5s forwards',
          }}
        >
          <div className="size-9 rounded-xl overflow-hidden shrink-0 border border-border">
            <img src="/images/portfolio/classmillia.jpg" alt="ClassMillia" className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-foreground">ClassMillia</span>
              <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-500">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground truncate">AI academic platform for universities</p>
          </div>
          <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-brand group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 shrink-0 ml-auto" />
        </a>

        {/* Scroll down */}
        <a
          href="#about"
          className="absolute md:bottom-8 bottom-4 size-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-brand hover:border-brand/40 hover:bg-brand/5 hover:shadow-md transition-all duration-200"
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
