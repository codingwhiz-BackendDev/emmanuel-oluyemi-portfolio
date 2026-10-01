import { ArrowUpRight, Github, Linkedin, Mail, FileText, Send } from 'lucide-react';
import { SplitText } from './SplitText';
import { allTech, profile } from '@/data';

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function Contact() {
  const marqueeItems = [...allTech, ...allTech];

  return (
    <div className="relative overflow-hidden mt-24" style={{ borderRadius: '32px' }}>
      {/* Brand glow accent */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] rounded-full blur-3xl pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, hsl(var(--brand) / 0.18), transparent 65%)',
          transform: 'translate(-50%, -55%)',
        }}
      />
      <section
        id="contact"
        className="relative bg-ink text-ink-foreground py-24 md:py-32 w-full"
        style={{ transform: 'scale(0.94)', transformOrigin: 'center' }}
      >
        <div className="container mx-auto max-w-4xl px-6">
          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-display font-bold max-w-2xl mb-4">
            <SplitText text="Have an idea? Let's build it." />
          </h2>
          <p
            className="text-white/60 text-lg mb-12 max-w-xl"
            style={{ opacity: 0, animation: 'fadeInUp 0.7s var(--ease-out) 0.6s forwards' }}
          >
            Open to freelance work, collaborations, and interesting problems. Reach out and let's talk.
          </p>

          {/* Dual marquees */}
          <div className="space-y-3 mb-12">
            <div className="marquee-container">
              <div className="flex gap-3 animate-marquee-left w-max">
                {marqueeItems.map((tech, i) => (
                  <span
                    key={`l-${i}`}
                    className="rounded-full border border-white/15 text-white/80 px-4 py-1.5 text-sm font-medium whitespace-nowrap shrink-0 hover:border-brand/50 hover:text-white transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="marquee-container">
              <div className="flex gap-3 animate-marquee-right w-max">
                {[...marqueeItems].reverse().map((tech, i) => (
                  <span
                    key={`r-${i}`}
                    className="rounded-full border border-white/15 text-white/80 px-4 py-1.5 text-sm font-medium whitespace-nowrap shrink-0 hover:border-brand/50 hover:text-white transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Contact grid */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left: email + socials */}
            <div>
              <a
                href={profile.socials.email}
                className="group inline-flex items-center gap-2 font-display text-lg sm:text-xl md:text-2xl lg:text-3xl underline decoration-white/20 hover:decoration-brand transition-all"
              >
                <span>{profile.socials.email.replace('mailto:', '')}</span>
                <ArrowUpRight className="size-5 md:size-6 text-brand transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              <div className="flex flex-wrap gap-3 mt-8">
                <a
                  href={profile.socials.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/15 text-white/80 px-4 py-2 text-sm hover:border-brand hover:text-white hover:bg-brand/20 hover:scale-105 transition-all flex items-center gap-2"
                >
                  <XIcon className="size-4" />
                  <span>X</span>
                </a>
                <a
                  href={profile.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/15 text-white/80 px-4 py-2 text-sm hover:border-brand hover:text-white hover:bg-brand/20 hover:scale-105 transition-all flex items-center gap-2"
                >
                  <Github className="size-4" />
                  <span>GitHub</span>
                </a>
                <a
                  href={profile.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/15 text-white/80 px-4 py-2 text-sm hover:border-brand hover:text-white hover:bg-brand/20 hover:scale-105 transition-all flex items-center gap-2"
                >
                  <Linkedin className="size-4" />
                  <span>LinkedIn</span>
                </a>
                <a
                  href={profile.socials.email}
                  className="rounded-full border border-white/15 text-white/80 px-4 py-2 text-sm hover:border-brand hover:text-white hover:bg-brand/20 hover:scale-105 transition-all flex items-center gap-2"
                >
                  <Mail className="size-4" />
                  <span>Email</span>
                </a>
              </div>
            </div>

            {/* Right: contact form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                window.location.href = profile.socials.email;
              }}
              className="space-y-4"
            >
              <input
                type="text"
                placeholder="Your name"
                className="w-full bg-white/5 border border-white/15 text-white placeholder:text-white/40 rounded-lg px-4 py-3 text-sm outline-none focus:border-brand/60 focus:bg-white/10 transition-colors"
              />
              <input
                type="email"
                placeholder="Your email"
                className="w-full bg-white/5 border border-white/15 text-white placeholder:text-white/40 rounded-lg px-4 py-3 text-sm outline-none focus:border-brand/60 focus:bg-white/10 transition-colors"
              />
              <textarea
                placeholder="Your message"
                rows={4}
                className="w-full bg-white/5 border border-white/15 text-white placeholder:text-white/40 rounded-lg px-4 py-3 text-sm outline-none focus:border-brand/60 focus:bg-white/10 transition-colors resize-none"
              />
              <button
                type="submit"
                className="btn-primary w-full rounded-lg py-3 text-sm font-medium active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Send className="size-4 relative z-10" />
                <span className="relative z-10">Send message</span>
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
