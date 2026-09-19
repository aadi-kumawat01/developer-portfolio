"use client";

import { useEffect, useState } from "react";

const testimonials = [
  {
    id: 1,
    name: "Rahul Sharma",
    role: "Founder, Startup",
    review:
      "Aditya understood exactly what we needed and turned the idea into a clean, responsive website. The entire process was smooth and the final result felt polished.",
    initials: "RS",
  },
  {
    id: 2,
    name: "Neha Verma",
    role: "Digital Marketer",
    review:
      "Working with Aditya was a great experience. He focused on both design and functionality, and the website feels modern, fast and easy to use.",
    initials: "NV",
  },
  {
    id: 3,
    name: "Aman Gupta",
    role: "Business Owner",
    review:
      "What I liked most was his attention to detail. Everything stayed clean, responsive and professional without making the design feel complicated.",
    initials: "AG",
  },
  {
    id: 4,
    name: "Priya Mehta",
    role: "Creative Professional",
    review:
      "The final website feels professional without being over-designed. The interface is polished and everything works smoothly across different devices.",
    initials: "PM",
  },
  {
    id: 5,
    name: "Kunal Jain",
    role: "Entrepreneur",
    review:
      "Aditya understood the requirements quickly and converted them into a modern interface. The final result was clean, practical and visually impressive.",
    initials: "KJ",
  },
  {
    id: 6,
    name: "Riya Kapoor",
    role: "Brand Consultant",
    review:
      "The balance between design and usability was excellent. Every detail felt intentional and the finished website looked clean and professional.",
    initials: "RK",
  },
];

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

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActiveIndex((current) => {
        return (current + 1) % testimonials.length;
      });
    }, SLIDE_TIME);

    return () => clearInterval(timer);
  }, [isPaused]);

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

        {/* Testimonial Slider */}
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
                key={testimonial.id}
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
                    {[1, 2, 3, 4, 5].map((star) => (
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
                    {testimonial.initials}
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

                    <p
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
                    </p>
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
              key={testimonial.id}
              type="button"
              aria-label={`Show testimonial ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={`
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
        </div>
      </div>
    </section>
  );
}
