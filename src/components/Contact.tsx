import { useRef, useState, type FormEvent } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  Copy,
  Github,
  Linkedin,
  Mail,
} from "lucide-react";
import { profile } from "@/data";

const email = profile.socials.email.replace(/^mailto:/, "");
const socialLinks = [
  { label: "GitHub", href: profile.socials.github, icon: Github },
  { label: "LinkedIn", href: profile.socials.linkedin, icon: Linkedin },
  { label: "X / Twitter", href: profile.socials.x, icon: ArrowUpRight },
];
const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d7fa77] focus-visible:ring-offset-4 focus-visible:ring-offset-[#18191c]";
const fieldClass =
  "mt-2 w-full rounded-xl border border-white/20 bg-white/[0.04] px-4 py-3.5 text-base text-[#f7f7f2] placeholder:text-white/40 outline-none transition-colors hover:border-white/40 focus:border-[#d7fa77] focus:ring-1 focus:ring-[#d7fa77]";

export function Contact() {
  const [copyStatus, setCopyStatus] = useState("");
  const [copied, setCopied] = useState(false);
  const [composerStatus, setComposerStatus] = useState("");
  const copyingRef = useRef(false);

  const copyEmail = async () => {
    if (copyingRef.current) return;
    copyingRef.current = true;
    setCopied(false);
    setCopyStatus("");
    let success = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(email);
        success = true;
      }
    } catch {
      // Clipboard permissions can be denied even on a secure connection.
    }
    if (!success) {
      const previousFocus = document.activeElement;
      const selection = window.getSelection();
      const ranges = selection
        ? Array.from({ length: selection.rangeCount }, (_, index) =>
            selection.getRangeAt(index).cloneRange(),
          )
        : [];
      const textarea = document.createElement("textarea");
      textarea.value = email;
      textarea.readOnly = true;
      textarea.style.cssText =
        "position:fixed;left:-9999px;top:0;font-size:16px;";
      document.body.appendChild(textarea);
      try {
        textarea.focus({ preventScroll: true });
        textarea.select();
        success = document.execCommand("copy");
      } catch {
        success = false;
      } finally {
        textarea.remove();
        if (previousFocus instanceof HTMLElement)
          previousFocus.focus({ preventScroll: true });
        if (selection) {
          selection.removeAllRanges();
          ranges.forEach((range) => selection.addRange(range));
        }
      }
    }
    setCopied(success);
    setCopyStatus(
      success
        ? "Email address copied to your clipboard."
        : "Could not copy automatically. Select and copy the email address above, or use the email link.",
    );
    copyingRef.current = false;
  };

  const openComposer = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const replyTo = String(data.get("email") ?? "").trim();
    const projectType = String(data.get("projectType") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    for (const fieldName of ["name", "message"]) {
      const field = form.elements.namedItem(fieldName);
      if (
        field instanceof HTMLInputElement ||
        field instanceof HTMLTextAreaElement
      ) {
        field.setCustomValidity(
          field.value.trim() ? "" : "Please enter more than just spaces.",
        );
      }
    }
    if (!form.reportValidity()) return;

    const subject = `${projectType} enquiry from ${name}`;
    const body = `Hi ${profile.firstName},\r\n\r\n${message}\r\n\r\nProject type: ${projectType}\r\nName: ${name}\r\nReply to: ${replyTo}`;
    const draft = `${profile.socials.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setComposerStatus(
      "Email draft requested — nothing has been sent. Review and send it in your email app. If no app opened, copy the email address and your message manually.",
    );
    window.location.href = draft;
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative scroll-mt-24 bg-[#f7f7f2] px-3 pb-8 pt-20 text-[#f7f7f2] sm:px-6 sm:pt-28 lg:px-8"
    >
      <div className="relative mx-auto max-w-[1280px] overflow-hidden rounded-[32px] bg-[#18191c] px-6 pb-8 pt-9 sm:px-10 sm:pb-10 sm:pt-12 lg:px-16 lg:pb-12 lg:pt-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-40 size-[480px] rounded-full bg-[#7446ed]/20 blur-[100px]"
        />
        <div className="relative flex items-center justify-between gap-4 border-b border-white/15 pb-6">
          <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em]">
            <span
              aria-hidden="true"
              className="size-2 rounded-full bg-[#d7fa77]"
            />{" "}
            Next chapter / Let’s collaborate
          </p>
          <span
            aria-hidden="true"
            className="hidden font-mono text-xs text-white/40 sm:block"
          >
            IDEA → REALITY
          </span>
        </div>

        <div className="relative mb-12 mt-10 flex items-end justify-between gap-8 sm:mb-16 lg:mt-14">
          <h2
            id="contact-title"
            className="max-w-[950px] font-display text-[clamp(2rem,7.4vw,6.5rem)] font-semibold leading-[0.98] tracking-[-0.055em]"
          >
            Good things start
            <br className="hidden sm:block" /> with a{" "}
            <span className="text-[#d7fa77]">conversation.</span>
          </h2>
          <span
            aria-hidden="true"
            className="mb-2 hidden size-28 shrink-0 -rotate-12 items-center justify-center rounded-[28px] bg-[#7446ed] text-[#d7fa77] xl:flex"
          >
            <ArrowDownRight className="size-16" strokeWidth={1.5} />
          </span>
        </div>

        <div className="relative grid gap-12 border-t border-white/15 pt-9 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:pt-12">
          <div className="flex min-w-0 flex-col items-start">
            <span className="mb-5 inline-flex -rotate-3 rounded-full bg-[#d7fa77] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#18191c]">
              Big ideas. Thoughtful execution.
            </span>
            <p className="max-w-sm text-lg leading-relaxed text-white/65">
              A new product, a tricky technical challenge, or something that
              doesn’t have a name yet. Tell me what you’re thinking.
            </p>

            <div className="mt-9 w-full">
              <p className="mb-3 text-xs uppercase tracking-[0.18em] text-white/50">
                Prefer a direct hello?
              </p>
              <a
                href={profile.socials.email}
                className={`group inline-flex max-w-full items-center gap-2 rounded-md font-display text-xl font-medium tracking-tight underline decoration-white/25 underline-offset-8 hover:decoration-[#d7fa77] sm:text-2xl ${focusRing}`}
              >
                <span className="min-w-0 break-all">{email}</span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-5 shrink-0 text-[#d7fa77]"
                />
              </a>
              <button
                type="button"
                onClick={() => void copyEmail()}
                className={`mt-5 flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-4 text-sm text-white/80 transition-colors hover:border-[#d7fa77] hover:text-[#d7fa77] ${focusRing}`}
              >
                {copied ? (
                  <Check aria-hidden="true" className="size-4" />
                ) : (
                  <Copy aria-hidden="true" className="size-4" />
                )}
                {copied ? "Email copied" : "Copy email address"}
              </button>
              <p
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="mt-3 min-h-5 max-w-sm text-sm leading-relaxed text-[#d7fa77]"
              >
                {copyStatus}
              </p>
            </div>

            <nav
              aria-label="Connect on social media"
              className="mt-8 flex flex-wrap gap-2 lg:mt-auto lg:pt-10"
            >
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${label} (opens in a new tab)`}
                  className={`inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-4 text-sm transition-colors hover:bg-white/10 ${focusRing}`}
                >
                  <Icon aria-hidden="true" className="size-4" />
                  {label}
                </a>
              ))}
            </nav>
          </div>

          <form
            onSubmit={openComposer}
            aria-label="Compose a project enquiry"
            aria-describedby="contact-form-note"
            className="min-w-0 rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-7"
          >
            <div className="mb-7 flex items-center justify-between gap-4">
              <h3 className="font-display text-2xl font-semibold tracking-tight">
                A little about your idea
              </h3>
              <Mail aria-hidden="true" className="size-5 text-[#d7fa77]" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="contact-name"
                  className="text-sm font-medium text-white/80"
                >
                  Your name{" "}
                  <span className="text-[#d7fa77]" aria-hidden="true">
                    *
                  </span>
                </label>
                <input
                  id="contact-name"
                  name="name"
                  autoComplete="name"
                  required
                  maxLength={100}
                  placeholder="What should I call you?"
                  onInput={(event) => event.currentTarget.setCustomValidity("")}
                  className={fieldClass}
                />
              </div>
              <div>
                <label
                  htmlFor="contact-email"
                  className="text-sm font-medium text-white/80"
                >
                  Email address{" "}
                  <span className="text-[#d7fa77]" aria-hidden="true">
                    *
                  </span>
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  placeholder="you@example.com"
                  className={fieldClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="contact-project"
                  className="text-sm font-medium text-white/80"
                >
                  What are we building?{" "}
                  <span className="text-[#d7fa77]" aria-hidden="true">
                    *
                  </span>
                </label>
                <select
                  id="contact-project"
                  name="projectType"
                  required
                  defaultValue=""
                  className={`${fieldClass} [color-scheme:dark] [&>option]:bg-[#18191c]`}
                >
                  <option value="" disabled>
                    Select a project type
                  </option>
                  <option value="Web application">Web application</option>
                  <option value="Mobile application">Mobile application</option>
                  <option value="Backend / API">Backend / API</option>
                  <option value="Collaboration / opportunity">
                    Collaboration / opportunity
                  </option>
                  <option value="Something else">Something else</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="contact-message"
                  className="text-sm font-medium text-white/80"
                >
                  The idea{" "}
                  <span className="text-[#d7fa77]" aria-hidden="true">
                    *
                  </span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  maxLength={3000}
                  rows={4}
                  placeholder="The vision, the challenge, your timeline…"
                  onInput={(event) => event.currentTarget.setCustomValidity("")}
                  className={`${fieldClass} min-h-32 resize-y`}
                />
              </div>
            </div>
            <p
              id="contact-form-note"
              className="mb-5 mt-4 text-xs leading-relaxed text-white/60"
            >
              All fields are required. This opens your email client with a
              prepared draft. There is no backend submission; nothing is sent
              until you send it in your email app.
            </p>
            <button
              type="submit"
              className={`group flex min-h-14 w-full items-center justify-between gap-3 rounded-full bg-[#d7fa77] px-6 text-sm font-bold text-[#18191c] transition-colors hover:bg-[#e4ff9f] ${focusRing}`}
            >
              Let’s start the conversation{" "}
              <ArrowUpRight
                aria-hidden="true"
                className="size-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none"
              />
            </button>
            <p
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className="mt-3 text-sm leading-relaxed text-[#d7fa77]"
            >
              {composerStatus}
            </p>
          </form>
        </div>
        <div
          aria-hidden="true"
          className="relative mt-12 flex items-center gap-3 border-t border-white/15 pt-6 text-[10px] uppercase tracking-[0.2em] text-white/40"
        >
          <span className="text-[#d7fa77]">✳</span> Human connection.
          Well-engineered outcomes.
          <span className="ml-auto hidden sm:block">
            {profile.firstName} / {profile.lastName}
          </span>
        </div>
      </div>
    </section>
  );
}
