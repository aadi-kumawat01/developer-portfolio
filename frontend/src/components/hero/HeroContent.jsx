import Link from "next/link";

export function HeroContent({ hero, profile }) {
  const intro = hero.availability || hero.introduction;
  const name = profile.name || profile.brandLabel;

  return (
    <div
      className="
        relative z-10
        w-full max-w-xl

        pt-[clamp(6rem,16svh,9rem)]

        min-[1152px]:ml-13
        min-[1152px]:max-w-[44rem]
        min-[1152px]:pt-0
      "
    >
      {intro && (
        <p
          className="
            m-0
            w-fit

            text-xs
            font-bold
            uppercase
            tracking-[0.075em]

            text-[var(--accent)]

            sm:text-sm
            min-[1152px]:text-[0.9rem]
          "
        >
          {intro}
        </p>
      )}

      <h1
        className="
          mt-3
          max-w-[10ch]

          text-[clamp(2.4rem,11vw,3.5rem)]
          font-[780]
          leading-[0.95]
          tracking-[-0.055em]

          text-[var(--foreground)]

          md:text-[clamp(3.1rem,7vw,4rem)]

          min-[1152px]:max-w-[9ch]
          min-[1152px]:text-[clamp(5rem,6.6vw,7rem)]
          min-[1152px]:leading-[0.9]
          min-[1152px]:tracking-[-0.06em]
        "
      >
        {name}
      </h1>

      {profile.name && hero.headline && (
        <p
          className="
            mt-3

            text-[1.05rem]
            font-semibold
            tracking-[-0.015em]

            text-[var(--foreground)]

            min-[1152px]:mt-4
            min-[1152px]:text-[1.35rem]
            min-[1152px]:tracking-[-0.02em]
          "
        >
          {hero.headline}
        </p>
      )}

      {hero.description && (
        <p
          className="
            mt-4
            max-w-lg

            text-base
            leading-[1.65]

            text-[var(--muted)]

            min-[1152px]:mt-[1.15rem]
            min-[1152px]:max-w-[37rem]
            min-[1152px]:text-[1.12rem]
            min-[1152px]:leading-[1.7]
          "
        >
          {hero.description}
        </p>
      )}

      <div
        className="
          mt-6
          flex
          flex-wrap
          gap-3

          min-[1152px]:mt-[1.65rem]
        "
      >
        <Link
          href={hero.primaryCtaHref || "/#projects"}
          className="
            inline-flex
            min-h-12
            items-center
            justify-center

            rounded-full

            border
            border-[var(--foreground)]

            bg-[var(--foreground)]

            px-5
            py-3

            text-sm
            font-bold
            text-[var(--background)]

            transition
            hover:opacity-90

            min-[1152px]:min-h-[52px]
            min-[1152px]:px-6
            min-[1152px]:text-[0.98rem]
          "
        >
          {hero.primaryCtaLabel}
        </Link>

        <Link
          href={hero.secondaryCtaHref || "/#contact"}
          className="
            inline-flex
            min-h-12
            items-center
            justify-center

            rounded-full

            border
            border-[var(--border)]

            bg-[var(--surface)]/70

            px-5
            py-3

            text-sm
            font-bold
            text-[var(--foreground)]

            backdrop-blur-md

            transition
            hover:border-[var(--foreground)]/40
            hover:bg-[var(--surface)]

            min-[1152px]:min-h-[52px]
            min-[1152px]:px-6
            min-[1152px]:text-[0.98rem]
          "
        >
          {hero.secondaryCtaLabel}
        </Link>
      </div>
    </div>
  );
}
