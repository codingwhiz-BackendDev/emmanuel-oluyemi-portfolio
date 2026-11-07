import { ArrowUp, ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { profile } from "@/data";

const socialLinks = [
  { label: "GitHub", href: profile.socials.github, icon: Github },
  { label: "LinkedIn", href: profile.socials.linkedin, icon: Linkedin },
  { label: "X / Twitter", href: profile.socials.x, icon: ArrowUpRight },
  { label: "Email", href: profile.socials.email, icon: Mail },
];
const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7446ed] focus-visible:ring-offset-4 focus-visible:ring-offset-[#f7f7f2]";

export function Footer() {
  return (
    <footer className="bg-[#f7f7f2] px-6 pb-7 pt-8 text-[#18191c] sm:px-10 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-col items-start justify-between gap-7 pb-8 sm:flex-row sm:items-center">
          <a
            href="#hero"
            aria-label={`${profile.name} — back to home`}
            className={`group flex items-center gap-3 rounded-lg ${focusRing}`}
          >
            <span
              aria-hidden="true"
              className="flex size-11 items-center justify-center rounded-[14px] border border-[#18191c]/20 font-display text-xl font-extrabold tracking-[-0.12em] transition-colors group-hover:border-[#7446ed] group-hover:bg-[#7446ed] group-hover:text-white"
            >
              EO.
            </span>
            <span>
              <span className="block font-display text-lg font-bold tracking-tight">
                {profile.name}
                <span className="text-[#7446ed]">.</span>
              </span>
              <span className="mt-0.5 block text-xs text-[#18191c]/60">
                Thoughtfully built. Ready for what’s next.
              </span>
            </span>
          </a>
          <a
            href="#hero"
            className={`group inline-flex min-h-11 items-center gap-3 rounded-full border border-[#18191c]/20 py-2 pl-5 pr-2 text-sm font-medium transition-colors hover:border-[#7446ed] hover:text-[#7446ed] ${focusRing}`}
          >
            Back to top
            <span className="flex size-8 items-center justify-center rounded-full bg-[#18191c] text-[#d7fa77] transition-colors group-hover:bg-[#7446ed]">
              <ArrowUp aria-hidden="true" className="size-4" />
            </span>
          </a>
        </div>

        <div className="flex flex-col-reverse justify-between gap-5 border-t border-[#18191c]/15 pt-5 md:flex-row md:items-center">
          <p className="text-xs leading-relaxed text-[#18191c]/60">
            © {new Date().getFullYear()} {profile.name}. Built from Nigeria.
          </p>
          <nav
            aria-label="Footer social links"
            className="flex flex-wrap items-center gap-x-5 gap-y-1"
          >
            {socialLinks.map(({ label, href, icon: Icon }) => {
              const external = !href.startsWith("mailto:");
              return (
                <a
                  key={label}
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  aria-label={
                    external ? `${label} (opens in a new tab)` : label
                  }
                  className={`inline-flex min-h-11 items-center gap-1.5 rounded-md text-xs font-medium transition-colors hover:text-[#7446ed] ${focusRing}`}
                >
                  <Icon aria-hidden="true" className="size-3.5" />
                  {label}
                </a>
              );
            })}
          </nav>
        </div>
      </div>
    </footer>
  );
}
