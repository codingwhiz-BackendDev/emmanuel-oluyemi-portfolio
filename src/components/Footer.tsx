import { Github, Linkedin, Mail } from 'lucide-react';
import { SplitText } from './SplitText';
import { profile } from '@/data';

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function Footer() {
  const socialLinks = [
    { icon: Github, href: profile.socials.github, label: 'GitHub' },
    { icon: Linkedin, href: profile.socials.linkedin, label: 'LinkedIn' },
    { icon: XIcon, href: profile.socials.x, label: 'X' },
    { icon: Mail, href: profile.socials.email, label: 'Email' },
  ];

  return (
    <footer className="py-10 md:py-12 border-t border-border">
      <div className="container mx-auto max-w-[1100px] px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Left: monogram + copyright */}
          <div className="flex items-center gap-3">
            <span
              className="font-display font-extrabold text-foreground"
              style={{ letterSpacing: '-0.09em' }}
            >
              EO
            </span>
            <span className="text-sm text-muted-foreground">
              © 2025 {profile.name}. Built from Nigeria.
            </span>
          </div>

          {/* Right: social icons */}
          <div className="flex items-center gap-2">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="hover-fine size-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                >
                  <Icon className="size-4" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Tagline */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            <span className="font-accent text-base text-foreground">
              <SplitText text="Let's build something great together" charDelay={15} />
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
