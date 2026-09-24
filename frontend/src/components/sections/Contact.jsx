"use client";

import { useState } from "react";
import { apiRequest } from "@/lib/api";

function MailIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M4 6h16v12H4V6Zm0 1 8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PinIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <circle
        cx="12"
        cy="10"
        r="2.2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function CopyIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect
        x="8"
        y="8"
        width="10"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function SendIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="m3 11 17-7-7 17-2.5-7.5L3 11Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <path
        d="m10.5 13.5 4-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GithubIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 .8a11.4 11.4 0 0 0-3.6 22.2c.6.1.8-.2.8-.5v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.4-1.3-5.4-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0C15.2 4.8 16.2 5 16.2 5c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.4 5.7.4.4.8 1.1.8 2.1v3.2c0 .3.2.7.8.5A11.4 11.4 0 0 0 12 .8Z" />
    </svg>
  );
}

function LinkedinIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M5.4 7.3H1.8V22h3.6V7.3ZM3.6 2A2.1 2.1 0 1 0 3.6 6.2 2.1 2.1 0 0 0 3.6 2ZM22.2 13.6c0-4.4-2.4-6.5-5.5-6.5-2.5 0-3.7 1.4-4.3 2.4V7.3H8.8V22h3.6v-7.3c0-1.9.4-3.8 2.8-3.8s2.4 2.2 2.4 3.9V22h3.6v-8.4Z" />
    </svg>
  );
}

function InstagramIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.4" cy="6.7" r="1" fill="currentColor" />
    </svg>
  );
}

function SocialLink({ name, href, icon }) {
  const available = Boolean(href);

  if (!available) {
    return (
      <div
        aria-disabled="true"
        className="
          flex min-h-12 items-center gap-3
          rounded-2xl
          border border-[var(--border)]
          bg-[var(--surface)]/25
          px-3.5
          text-[var(--muted)]
          opacity-40
        "
      >
        <span className="grid h-8 w-8 place-items-center">
          {icon}
        </span>

        <span className="text-xs font-semibold">
          {name}
        </span>
      </div>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="
        group
        flex min-h-12 min-w-0 items-center gap-2.5
        rounded-2xl
        border border-[var(--border)]
        bg-[var(--surface)]/25
        px-3
        cursor-pointer
        text-[var(--foreground)]
        transition-all duration-300
        hover:-translate-y-0.5
        hover:border-[var(--primary)]/45
        hover:bg-[var(--primary)]/[0.06]
      "
    >
      <span
        className="
          grid h-8 w-8 place-items-center
          text-[var(--muted)]
          transition-colors
          group-hover:text-[var(--accent)]
        "
      >
        {icon}
      </span>

      <span className="min-w-0 whitespace-nowrap text-xs font-semibold">
        {name}
      </span>

      <span
        className="
          ml-auto
          text-sm text-[var(--muted)]
          transition-all duration-300
          group-hover:-translate-y-0.5
          group-hover:translate-x-0.5
          group-hover:text-[var(--accent)]
        "
      >
        ↗
      </span>
    </a>
  );
}

function socialIcon(iconKey) {
  const key = String(iconKey || "").trim().toLowerCase();
  if (key === "github") return <GithubIcon />;
  if (key === "linkedin") return <LinkedinIcon />;
  if (key === "instagram") return <InstagramIcon />;
  return <ArrowIcon className="h-5 w-5" />;
}

export function Contact({ contact, profile, socialLinks }) {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "", website: "" });
  const [formStatus, setFormStatus] = useState({ type: "", message: "" });
  const [isSending, setIsSending] = useState(false);

  const email =
    contact?.email ||
    profile?.email ||
    "";

  const location =
    contact?.location ||
    profile?.location ||
    "";

  const socials = Array.isArray(socialLinks)
    ? socialLinks.map((link) => ({ name: link.label, href: link.url, icon: socialIcon(link.iconKey) }))
    : [];

  async function copyEmail() {
    if (!email) return;

    try {
      await navigator.clipboard.writeText(email);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1600);
    } catch {
      setCopied(false);
    }
  }

  function updateForm(field, value) {
    setFormData((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormStatus({ type: "", message: "" });

    const name = formData.name.trim();
    const visitorEmail = formData.email.trim();
    const message = formData.message.trim();

    if (!name || !visitorEmail || !message) {
      setFormStatus({ type: "error", message: "Please fill in your name, email, and message." });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(visitorEmail)) {
      setFormStatus({ type: "error", message: "Please enter a valid email address." });
      return;
    }

    setIsSending(true);

    try {
      await apiRequest("/api/contact/send", {
        method: "POST",
        body: JSON.stringify({ ...formData, name, email: visitorEmail, message }),
      });
      setFormData({ name: "", email: "", subject: "", message: "", website: "" });
      setFormStatus({ type: "success", message: "Message sent successfully. I'll get back to you soon." });
    } catch (requestError) {
      setFormStatus({ type: "error", message: requestError.message || "Couldn't send your message right now. Please try again." });
    } finally {
      setIsSending(false);
    }
  }

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="
        relative isolate
        scroll-mt-24
        overflow-hidden
        bg-[var(--background)]
        px-4 py-14
        sm:px-6 sm:py-16
        lg:px-8 lg:py-28
      "
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute -right-48 top-1/4 -z-10
          h-[430px] w-[430px]
          rounded-full
          bg-[var(--primary)]/[0.07]
          blur-[160px]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute -bottom-60 -left-48 -z-10
          h-[430px] w-[430px]
          rounded-full
          bg-[var(--primary)]/[0.045]
          blur-[160px]
        "
      />

      <div className="mx-auto w-full max-w-7xl">
        <div
          className="
            grid gap-8
            min-[900px]:grid-cols-[0.9fr_1.1fr]
            lg:grid-cols-[0.72fr_1.28fr]
            lg:gap-16
            xl:gap-24
          "
        >
          <div className="lg:pt-4">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[var(--primary)]" />

              <span
                className="
                  text-[10px] font-black uppercase
                  tracking-[0.22em]
                  text-[var(--accent)]
                "
              >
                {contact?.eyebrow || "Contact"}
              </span>
            </div>

            <h2
              id="contact-heading"
              className="
                mt-4 max-w-xl
                text-[clamp(2.2rem,7vw,5.4rem)]
                md:text-[clamp(2.4rem,4vw,3.4rem)]
                lg:text-[clamp(3rem,5vw,5.4rem)]
                font-bold
                leading-[0.9]
                tracking-[-0.075em]
                text-[var(--foreground)]
              "
            >
              {contact?.heading || <>
                Let&apos;s build
                <span className="block text-[var(--accent)]">something useful.</span>
              </>}
            </h2>

            <p
              className="
                mt-4 max-w-md
                text-[15px] leading-7
                text-[var(--muted)]
                sm:text-base
              "
            >
              {contact?.description ||
                "Have an idea, project or opportunity in mind? Send me a message and let's talk about it."}
            </p>

            <div className="mt-6 flex items-center gap-3">
              <span className="relative flex h-2.5 w-2.5">
                <span
                  className="
                    absolute inline-flex
                    h-full w-full
                    animate-ping
                    rounded-full
                    bg-emerald-400
                    opacity-30
                  "
                />

                <span
                  className="
                    relative inline-flex
                    h-2.5 w-2.5
                    rounded-full
                    bg-emerald-400
                  "
                />
              </span>

              <span
                className="
                  text-[10px] font-bold uppercase
                  tracking-[0.15em]
                  text-[var(--muted)]
                "
              >
                {contact?.availabilityText || "Open to new opportunities"}
              </span>
            </div>

            <div className="mt-7 border-t border-[var(--border)]">
              <div
                className="
                  flex items-center gap-4
                  border-b border-[var(--border)]
                  py-5
                "
              >
                <div
                  className="
                    grid h-10 w-10 shrink-0
                    place-items-center
                    rounded-xl
                    bg-[var(--primary)]/10
                    text-[var(--accent)]
                  "
                >
                  <MailIcon />
                </div>

                <div className="min-w-0 flex-1">
                  <p
                    className="
                      text-[9px] font-bold uppercase
                      tracking-[0.14em]
                      text-[var(--muted)]
                    "
                  >
                    Email
                  </p>

                  <a
                    href={`mailto:${email}`}
                    className="
                      mt-1 block truncate
                      text-sm font-semibold
                      text-[var(--foreground)]
                      transition
                      hover:text-[var(--accent)]
                    "
                  >
                    {email}
                  </a>
                </div>

                <button
                  type="button"
                  onClick={copyEmail}
                  aria-label="Copy email"
                  className="
                    grid h-9 w-9 shrink-0
                    place-items-center
                    rounded-full
                    border border-[var(--border)]
                    text-[var(--muted)]
                    transition-all
                    hover:border-[var(--primary)]/50
                    hover:text-[var(--accent)]
                  "
                >
                  <CopyIcon />
                </button>
              </div>

              <div className="flex items-center gap-4 py-5">
                <div
                  className="
                    grid h-10 w-10 shrink-0
                    place-items-center
                    rounded-xl
                    bg-[var(--primary)]/10
                    text-[var(--accent)]
                  "
                >
                  <PinIcon />
                </div>

                <div>
                  <p
                    className="
                      text-[9px] font-bold uppercase
                      tracking-[0.14em]
                      text-[var(--muted)]
                    "
                  >
                    Location
                  </p>

                  <p
                    className="
                      mt-1 text-sm font-semibold
                      text-[var(--foreground)]
                    "
                  >
                    {location}
                  </p>
                </div>
              </div>
            </div>

            {copied && (
              <p
                className="
                  mt-2 text-xs font-semibold
                  text-[var(--accent)]
                "
              >
                Email copied.
              </p>
            )}

            {socials.length > 0 && <div className="mt-6">
              <div className="flex items-center justify-between gap-4">
                <p
                  className="
                    text-[9px] font-bold uppercase
                    tracking-[0.17em]
                    text-[var(--muted)]
                  "
                >
                  Find me online
                </p>

                <span className="h-px flex-1 bg-[var(--border)]" />
              </div>

              <div
                className="
                  mt-4 grid gap-2
                  grid-cols-1
                  min-[420px]:grid-cols-2
                  xl:grid-cols-2
                "
              >
                {socials.map((social) => (
                  <SocialLink
                    key={social.name}
                    name={social.name}
                    href={social.href}
                    icon={social.icon}
                  />
                ))}
              </div>
            </div>}
          </div>

          <div
            className="
              relative overflow-hidden
              rounded-[30px]
              border border-[var(--border)]
              bg-[var(--surface)]/40
              p-4
              backdrop-blur-xl
              sm:p-6
              lg:p-8
            "
          >
            <div
              aria-hidden="true"
              className="
                absolute left-8 right-8 top-0
                h-px
                bg-gradient-to-r
                from-transparent
                via-[var(--primary)]/65
                to-transparent
              "
            />

            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute -right-20 -top-24
                h-60 w-60
                rounded-full
                bg-[var(--primary)]/[0.07]
                blur-[100px]
              "
            />

            <div className="relative">
              <div>
                <p
                  className="
                    text-[10px] font-black uppercase
                    tracking-[0.18em]
                    text-[var(--accent)]
                  "
                >
                  Send a message
                </p>

                <h3
                  className="
                    mt-2
                    text-2xl font-bold
                    tracking-[-0.045em]
                    text-[var(--foreground)]
                    sm:text-3xl
                  "
                >
                  {contact?.formHeading || "Tell me about your project."}
                </h3>

                {contact?.formDescription && <p
                  className="
                    mt-2 max-w-xl
                    text-sm leading-6
                    text-[var(--muted)]
                  "
                >
                  {contact.formDescription}
                </p>}
              </div>

              <form
                onSubmit={handleSubmit}
                className="mt-6"
              >
                <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                  <label htmlFor="contact-website">Website</label>
                  <input
                    id="contact-website"
                    name="website"
                    type="text"
                    value={formData.website}
                    onChange={(event) => updateForm("website", event.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label>
                    <span
                      className="
                        text-xs font-semibold
                        text-[var(--foreground)]
                      "
                    >
                      Your Name
                      <span className="text-[var(--accent)]">
                        {" "}*
                      </span>
                    </span>

                    <input
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(event) => updateForm("name", event.target.value)}
                      className="
                        mt-2 w-full
                        border-0 border-b
                        border-[var(--border)]
                        bg-transparent
                        px-0 py-3
                        text-sm
                        text-[var(--foreground)]
                        outline-none
                        transition-colors
                        placeholder:text-[var(--muted)]/40
                        focus:border-[var(--primary)]
                      "
                    />
                  </label>

                  <label>
                    <span
                      className="
                        text-xs font-semibold
                        text-[var(--foreground)]
                      "
                    >
                      Email
                      <span className="text-[var(--accent)]">
                        {" "}*
                      </span>
                    </span>

                    <input
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(event) => updateForm("email", event.target.value)}
                      className="
                        mt-2 w-full
                        border-0 border-b
                        border-[var(--border)]
                        bg-transparent
                        px-0 py-3
                        text-sm
                        text-[var(--foreground)]
                        outline-none
                        transition-colors
                        placeholder:text-[var(--muted)]/40
                        focus:border-[var(--primary)]
                      "
                    />
                  </label>
                </div>

                <label className="mt-5 block">
                  <span
                    className="
                      text-xs font-semibold
                      text-[var(--foreground)]
                    "
                  >
                    Subject
                  </span>

                  <input
                    name="subject"
                    type="text"
                    placeholder="Project discussion"
                    value={formData.subject}
                    onChange={(event) => updateForm("subject", event.target.value)}
                    className="
                      mt-2 w-full
                      border-0 border-b
                      border-[var(--border)]
                      bg-transparent
                      px-0 py-3
                      text-sm
                      text-[var(--foreground)]
                      outline-none
                      transition-colors
                      placeholder:text-[var(--muted)]/40
                      focus:border-[var(--primary)]
                    "
                  />
                </label>

                <label className="mt-5 block">
                  <div className="flex items-center justify-between gap-4">
                    <span
                      className="
                        text-xs font-semibold
                        text-[var(--foreground)]
                      "
                    >
                      Message
                      <span className="text-[var(--accent)]">
                        {" "}*
                      </span>
                    </span>

                    <span
                      className="
                        text-[9px] font-bold uppercase
                        tracking-[0.12em]
                        text-[var(--muted)]/55
                      "
                    >
                      Max 800
                    </span>
                  </div>

                  <textarea
                    name="message"
                    required
                    maxLength={800}
                    rows={5}
                    placeholder="Tell me what you'd like to build..."
                    value={formData.message}
                    onChange={(event) => updateForm("message", event.target.value)}
                    className="
                      mt-3 w-full resize-none
                      rounded-[20px]
                      border border-[var(--border)]
                      bg-[var(--background)]/30
                      px-4 py-4
                      text-sm leading-6
                      text-[var(--foreground)]
                      outline-none
                      transition-colors
                      placeholder:text-[var(--muted)]/40
                      focus:border-[var(--primary)]/60
                    "
                  />
                </label>

                <div
                  className="
                    mt-5 flex flex-col gap-3
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                  "
                >
                  <button
                    type="submit"
                    disabled={isSending}
                    className="
                      group
                      inline-flex min-h-12
                      items-center justify-center
                      gap-3
                      rounded-full
                      bg-[var(--primary)]
                      px-6
                      text-sm font-bold
                      text-white
                      shadow-[0_10px_30px_rgba(0,0,0,.12)]
                      transition-all duration-300
                      hover:-translate-y-0.5
                      hover:brightness-110
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >
                    <SendIcon />

                    {isSending ? "Sending..." : "Send Message"}

                    <ArrowIcon
                      className="
                        h-4 w-4
                        transition-transform duration-300
                        group-hover:translate-x-1
                      "
                    />
                  </button>

                  <p
                    className="
                      max-w-[260px]
                      text-[10px] leading-5
                      text-[var(--muted)]
                    "
                  >
                    Your message will be sent securely.
                  </p>
                </div>

                {formStatus.message && (
                  <p
                    aria-live="polite"
                    className={`mt-4 text-sm ${formStatus.type === "success" ? "text-emerald-400" : "text-[var(--accent)]"}`}
                  >
                    {formStatus.message}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>

      
      </div>
    </section>
  );
}
