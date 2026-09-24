"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

const SLIDE_TIME = 3800;

function QuoteIcon() {
  return (
    <svg
      viewBox="0 0 32 32"
      className="h-6 w-6"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M7.6 14.4H13V25H3V17.4C3 10.7 6.2 6.4 12.4 4L14 7.5C10 9.2 7.9 11.4 7.6 14.4ZM22.6 14.4H28V25H18V17.4C18 10.7 21.2 6.4 27.4 4L29 7.5C25 9.2 22.9 11.4 22.6 14.4Z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-3.5 w-3.5"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M10 1.7l2.5 5.05 5.57.81-4.03 3.93.95 5.55L10 14.42 5.01 17.04l.95-5.55-4.03-3.93 5.57-.81L10 1.7Z" />
    </svg>
  );
}

export default function Testimonials({ items = [] }) {
  const testimonials = Array.isArray(items) ? items : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "", rating: "5", review: "", website: "" });
  const [formState, setFormState] = useState({ isSubmitting: false, error: "", success: "" });

  useEffect(() => {
    if (isPaused || !testimonials.length) return;

    const timer = setInterval(() => {
      setActiveIndex((current) => {
        return (current + 1) % testimonials.length;
      });
    }, SLIDE_TIME);

    return () => clearInterval(timer);
  }, [isPaused, testimonials.length]);

  useEffect(() => {
    if (!isReviewModalOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsReviewModalOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isReviewModalOpen]);

  const getPosition = (index) => {
    const total = testimonials.length;

    const previousIndex =
      (activeIndex - 1 + total) % total;

    const nextIndex =
      (activeIndex + 1) % total;

    if (index === activeIndex) return "center";
    if (index === previousIndex) return "left";
    if (index === nextIndex) return "right";

    return "hidden";
  };

  const moveToPrevious = () => {
    setActiveIndex((current) => {
      return (
        (current - 1 + testimonials.length) %
        testimonials.length
      );
    });
  };

  const moveToNext = () => {
    setActiveIndex((current) => {
      return (current + 1) % testimonials.length;
    });
  };

  async function submitReview(event) {
    event.preventDefault();
    setFormState({ isSubmitting: true, error: "", success: "" });
    try {
      const payload = await apiRequest("/api/testimonials", {
        method: "POST",
        body: JSON.stringify({ ...form, rating: Number(form.rating) }),
      });
      if (!payload.success) throw new Error(payload.message || "Unable to submit your review.");
      setForm({ name: "", email: "", role: "", rating: "5", review: "", website: "" });
      setFormState({ isSubmitting: false, error: "", success: "Thanks! Your review has been submitted for approval." });
    } catch (error) {
      setFormState({ isSubmitting: false, error: error.message || "Unable to submit your review.", success: "" });
    }
  }

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-28"
    >
      {/* Soft background glow */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[60%]
          -z-10
          h-[500px]
          w-[500px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-rose-500/[0.03]
          blur-[150px]
        "
      />

      <div className="mx-auto max-w-[1400px]">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <p
            className="
              mb-4
              text-xs
              font-semibold
              uppercase
              tracking-[0.3em]
              text-rose-400
              sm:text-sm
            "
          >
            Testimonials
          </p>

          <h2
            className="
              text-3xl
              font-bold
              tracking-tight
              text-white
              sm:text-4xl
              lg:text-5xl
            "
          >
            What people say about
            <span className="block text-white/50">
              working with me
            </span>
          </h2>

          <p
            className="
              mx-auto
              mt-5
              max-w-2xl
              text-sm
              leading-7
              text-white/50
              sm:text-base
            "
          >
            Feedback from people I&apos;ve worked with on websites,
            interfaces and digital experiences.
          </p>
        </div>

        {testimonials.length ? <>
        <div
          className="
            relative
            mx-auto
            mt-8
            h-[330px]
            w-full
            sm:mt-10 sm:h-[350px]
            lg:mt-14
            lg:h-[380px]
          "
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {testimonials.map((testimonial, index) => {
            const position = getPosition(index);

            return (
              <article
                key={testimonial._id || testimonial.id}
                onClick={() => {
                  if (position === "left") {
                    moveToPrevious();
                  }

                  if (position === "right") {
                    moveToNext();
                  }
                }}
                className={`
                  absolute
                  left-1/2
                  top-1/2

                  flex
                  min-h-[280px]

                  w-[76%]
                  max-w-[390px]

                  flex-col

                  rounded-[24px]
                  border

                  px-5
                  py-6

                  backdrop-blur-xl

                  transition-all
                  duration-700
                  ease-[cubic-bezier(0.22,1,0.36,1)]

                  sm:w-[56%]
                  sm:px-6
                  sm:py-7

                  lg:w-[27%]

                  ${
                    position === "center"
                      ? `
                        z-30

                        -translate-x-1/2
                        -translate-y-1/2

                        scale-[1.02]

                        cursor-default

                        border-rose-400/25
                        bg-white/[0.055]

                        opacity-100

                        shadow-[0_22px_65px_rgba(0,0,0,0.3)]
                      `
                      : ""
                  }

                  ${
                    position === "left"
                      ? `
                        z-20

                        -translate-x-[158%]
                        -translate-y-1/2

                        scale-[0.96]

                        cursor-pointer

                        border-white/[0.07]
                        bg-white/[0.026]

                        opacity-[0.74]

                        hover:opacity-[0.88]
                      `
                      : ""
                  }

                  ${
                    position === "right"
                      ? `
                        z-20

                        translate-x-[58%]
                        -translate-y-1/2

                        scale-[0.96]

                        cursor-pointer

                        border-white/[0.07]
                        bg-white/[0.026]

                        opacity-[0.74]

                        hover:opacity-[0.88]
                      `
                      : ""
                  }

                  ${
                    position === "hidden"
                      ? `
                        pointer-events-none

                        z-0

                        -translate-x-1/2
                        -translate-y-1/2

                        scale-[0.88]

                        opacity-0
                      `
                      : ""
                  }
                `}
              >
                {/* Quote + Stars */}
                <div className="flex items-start justify-between gap-4">
                  <div
                    className={`
                      transition-colors
                      duration-500

                      ${
                        position === "center"
                          ? "text-rose-400"
                          : "text-white/40"
                      }
                    `}
                  >
                    <QuoteIcon />
                  </div>

                  <div
                    className={`
                      flex
                      items-center
                      gap-1

                      transition-all
                      duration-500

                      ${
                        position === "center"
                          ? "text-amber-300/85"
                          : "text-amber-300/55"
                      }
                    `}
                  >
                    {Array.from({ length: testimonial.rating || 0 }, (_, index) => index + 1).map((star) => (
                      <StarIcon key={star} />
                    ))}
                  </div>
                </div>

                {/* Review */}
                <p
                  className={`
                    mt-6
                    flex-1

                    transition-all
                    duration-500

                    ${
                      position === "center"
                        ? `
                          text-[15px]
                          font-medium
                          leading-7
                          text-white/80

                          sm:text-[16px]
                          sm:leading-7
                        `
                        : `
                          text-[14px]
                          leading-7
                          text-white/60
                        `
                    }
                  `}
                >
                  “{testimonial.review}”
                </p>

                {/* Reviewer */}
                <div
                  className="
                    mt-6
                    flex
                    items-center
                    gap-3
                    border-t
                    border-white/[0.07]
                    pt-5
                  "
                >
                  <div
                    className={`
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center

                      rounded-full
                      border

                      text-xs
                      font-semibold

                      transition-all
                      duration-500

                      ${
                        position === "center"
                          ? `
                            border-rose-400/20
                            bg-rose-400/[0.08]
                            text-white
                          `
                          : `
                            border-white/[0.08]
                            bg-white/[0.04]
                            text-white/65
                          `
                      }
                    `}
                  >
                    {testimonial.avatarUrl ? <img src={testimonial.avatarUrl} alt="" className="h-full w-full rounded-full object-cover" /> : testimonial.initials || testimonial.name?.slice(0, 2)}
                  </div>

                  <div className="min-w-0">
                    <h3
                      className={`
                        truncate
                        text-sm
                        font-semibold

                        transition-colors
                        duration-500

                        ${
                          position === "center"
                            ? "text-white"
                            : "text-white/70"
                        }
                      `}
                    >
                      {testimonial.name}
                    </h3>

                    {testimonial.role && <p
                      className={`
                        mt-1
                        truncate
                        text-xs

                        ${
                          position === "center"
                            ? "text-white/45"
                            : "text-white/35"
                        }
                      `}
                    >
                      {testimonial.role}
                    </p>}
                  </div>
                </div>

                {/* Active card bottom accent */}
                <div
                  className={`
                    absolute
                    bottom-0
                    left-10
                    right-10

                    h-px

                    bg-gradient-to-r
                    from-transparent
                    via-rose-400/70
                    to-transparent

                    transition-all
                    duration-700

                    ${
                      position === "center"
                        ? "scale-x-100 opacity-100"
                        : "scale-x-0 opacity-0"
                    }
                  `}
                />
              </article>
            );
          })}
        </div>

        {/* Slider Indicators */}
        <div
          className="
            mt-1
            flex
            items-center
            justify-center
            gap-2
          "
        >
          {testimonials.map((testimonial, index) => (
            <button
              key={testimonial._id || testimonial.id}
              type="button"
              aria-label={`Show testimonial ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={`
                cursor-pointer
                h-1.5
                rounded-full

                transition-all
                duration-500

                ${
                  index === activeIndex
                    ? "w-7 bg-rose-400"
                    : "w-1.5 bg-white/20 hover:bg-white/40"
                }
              `}
            />
          ))}
        </div></> : <div className="mx-auto mt-10 max-w-xl text-center sm:mt-12">
          <p className="text-base font-medium text-white/75">No reviews yet.</p>
          <p className="mt-2 text-sm leading-7 text-white/50">Be the first to share your feedback.</p>
        </div>}

        <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-white/[0.09] bg-white/[0.03] px-5 py-6 text-center sm:mt-12 sm:px-7">
          <h3 className="text-lg font-semibold text-white">Share Your Experience</h3>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-white/50">Worked with me or explored one of my projects? I&apos;d love to hear your feedback.</p>
          <button type="button" onClick={() => setIsReviewModalOpen(true)} className="mt-5 cursor-pointer rounded-lg bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-400">Leave a Review</button>
        </div>
      </div>
      {isReviewModalOpen && <ReviewModal form={form} formState={formState} onChange={(field, value) => setForm((current) => ({ ...current, [field]: value }))} onClose={() => setIsReviewModalOpen(false)} onSubmit={submitReview} />}
    </section>
  );
}

function ReviewModal({ form, formState, onChange, onClose, onSubmit }) {
  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 py-5 backdrop-blur-sm" onMouseDown={onClose}>
    <div role="dialog" aria-modal="true" aria-labelledby="review-modal-title" className="max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/[0.12] bg-[#171417] p-5 shadow-2xl sm:p-7" onMouseDown={(event) => event.stopPropagation()}>
      <div className="flex items-start justify-between gap-4">
        <div><h3 id="review-modal-title" className="text-xl font-semibold text-white">Share Your Feedback</h3><p className="mt-2 text-sm leading-6 text-white/50">Your review will be visible after approval.</p></div>
        <button type="button" onClick={onClose} aria-label="Close review form" className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-lg border border-white/15 text-lg text-white/70 transition hover:border-rose-400 hover:text-white">×</button>
      </div>
      {formState.success ? <div className="py-12 text-center"><p role="status" aria-live="polite" className="text-base leading-7 text-emerald-300">{formState.success}</p><button type="button" onClick={onClose} className="mt-6 cursor-pointer rounded-lg border border-white/15 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-rose-400">Close</button></div> : <form onSubmit={onSubmit} className="mt-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <ReviewField label="Name *" value={form.name} onChange={(value) => onChange("name", value)} required />
          <ReviewField label="Email *" type="email" value={form.email} onChange={(value) => onChange("email", value)} required />
          <ReviewField label="Your Role" value={form.role} onChange={(value) => onChange("role", value)} />
          <label className="text-sm font-medium text-white/75">Rating<select value={form.rating} onChange={(event) => onChange("rating", event.target.value)} className="mt-2 w-full cursor-pointer rounded-lg border border-white/15 bg-black/20 px-3 py-2.5 text-sm text-white outline-none focus:border-rose-400"><option value="5">5 — Excellent</option><option value="4">4 — Very Good</option><option value="3">3 — Good</option><option value="2">2 — Fair</option><option value="1">1 — Poor</option></select></label>
          <ReviewField label="Review *" value={form.review} onChange={(value) => onChange("review", value)} required multiline className="sm:col-span-2" />
          <input tabIndex="-1" autoComplete="off" value={form.website} onChange={(event) => onChange("website", event.target.value)} className="hidden" aria-hidden="true" />
        </div>
        {formState.error && <p role="alert" className="mt-4 text-sm text-rose-300">{formState.error}</p>}
        <div className="mt-6 flex flex-wrap justify-end gap-3"><button type="button" onClick={onClose} className="cursor-pointer rounded-lg border border-white/15 px-5 py-2.5 text-sm font-semibold text-white/80 transition hover:border-rose-400">Cancel</button><button type="submit" disabled={formState.isSubmitting} className="cursor-pointer rounded-lg bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-60">{formState.isSubmitting ? "Submitting..." : "Submit Review"}</button></div>
      </form>}
    </div>
  </div>;
}

function ReviewField({ label, type = "text", value, onChange, required = false, multiline = false, className = "" }) {
  const classNames = "mt-2 w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2.5 text-sm text-white outline-none focus:border-rose-400";
  return <label className={`text-sm font-medium text-white/75 ${className}`}>{label}{multiline ? <textarea value={value} required={required} onChange={(event) => onChange(event.target.value)} rows="5" maxLength="1500" className={classNames} /> : <input type={type} value={value} required={required} onChange={(event) => onChange(event.target.value)} maxLength={type === "email" ? 254 : 100} className={classNames} />}</label>;
}
