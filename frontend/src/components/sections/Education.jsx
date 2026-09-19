const education = [
    {
        id: "secondary",
        type: "Secondary Education",
        title: "Class 10th",
        institute: "Bright Senior Secondary School, Sikar",
        year: "2022",
        score: "79%",
        description:
            "Completed my secondary education with a strong academic foundation and consistent performance across core subjects.",
        status: "Completed",
    },
    {
        id: "higher-secondary",
        type: "Higher Secondary Education",
        title: "Class 12th — Science (Mathematics)",
        institute: "Bright Senior Secondary School, Sikar",
        year: "2024",
        score: "90.60%",
        description:
            "Completed higher secondary education in the Science stream with Mathematics, achieving a strong academic score and improving analytical thinking.",
        status: "Completed",
    },
    {
        id: "college",
        type: "Undergraduate",
        title: "Bachelor's Degree — Arts",
        institute:
            "Pandit Deendayal Upadhyaya Shekhawati University, Sikar",
        year: "Currently in 2nd Year",
        score: "2nd Year",
        description:
            "Currently pursuing a Bachelor's degree in Arts while learning web development independently and gaining practical experience by building real projects.",
        status: "Ongoing",
    },
];

function SchoolIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-5 w-5"
            aria-hidden="true"
        >
            <path
                d="M3 10.5 12 5l9 5.5-9 5.5-9-5.5Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
            />

            <path
                d="M6.5 12.7V17c0 1.3 2.5 2.5 5.5 2.5s5.5-1.2 5.5-2.5v-4.3"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
            />
        </svg>
    );
}

function CalendarIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4"
            aria-hidden="true"
        >
            <rect
                x="4"
                y="5"
                width="16"
                height="15"
                rx="3"
                stroke="currentColor"
                strokeWidth="1.7"
            />

            <path
                d="M8 3v4M16 3v4M4 10h16"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
            />
        </svg>
    );
}

function EducationCard({ item, index }) {
    const ongoing = item.status === "Ongoing";

    return (
        <article className="group relative">
            {/* Timeline dot */}
            <div className="absolute left-[17px] top-8 z-10 hidden min-[1152px]:block">
                <span
                    className={`grid h-4 w-4 place-items-center rounded-full border-2 ${ongoing
                        ? "border-[var(--accent)] bg-[var(--background)] shadow-[0_0_16px_color-mix(in_srgb,var(--accent)_45%,transparent)]"
                        : "border-[var(--primary)] bg-[var(--background)]"
                        }`}
                >
                    <span
                        className={`h-1.5 w-1.5 rounded-full ${ongoing
                            ? "bg-[var(--accent)]"
                            : "bg-[var(--primary)]"
                            }`}
                    />
                </span>
            </div>

            <div className="min-[1152px]:pl-14">
                <div className="relative overflow-hidden rounded-[20px] border border-[var(--border)] bg-[var(--surface)]/50 p-3 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[var(--primary)]/35 sm:rounded-[24px] sm:p-5 min-[1152px]:p-7">
                    {/* top accent */}
                    <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-[var(--primary)]/70 to-transparent opacity-60" />

                    {/* ambient glow */}
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-[var(--primary)]/[0.06] blur-3xl transition-all duration-500 group-hover:bg-[var(--primary)]/[0.10]"
                    />

                    <div className="relative">
                        {/* Top */}
                        <div className="flex items-start justify-between gap-2 min-[1152px]:gap-3">
                            <div className="flex min-w-0 gap-3 sm:gap-4">
                                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/[0.08] text-[var(--accent)] sm:h-12 sm:w-12 sm:rounded-2xl">
                                    <SchoolIcon />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[var(--accent)]">
                                        {item.type}
                                    </p>

                                    <h3 className="mt-1 text-base font-bold tracking-[-0.035em] text-[var(--foreground)] sm:mt-1.5 sm:text-xl">
                                        {item.title}
                                    </h3>

                                    <p className="mt-1 text-[13px] font-medium leading-5 text-[var(--muted)] sm:mt-1.5 sm:text-sm sm:leading-6">
                                        {item.institute}
                                    </p>
                                </div>
                            </div>

                            <span
                                className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border px-2 py-1 text-[8px] font-black uppercase tracking-[0.11em] sm:gap-2 sm:px-3 sm:py-1.5 sm:text-[9px] sm:tracking-[0.13em] ${ongoing
                                    ? "border-[var(--accent)]/25 bg-[var(--accent)]/[0.08] text-[var(--accent)]"
                                    : "border-[var(--border)] bg-[var(--foreground)]/[0.035] text-[var(--muted)]"
                                    }`}
                            >
                                {ongoing && (
                                    <span className="relative flex h-1.5 w-1.5">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-40" />
                                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                                    </span>
                                )}

                                {item.status}
                            </span>
                        </div>

                        {/* Meta */}
                        <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--background)]/35 px-2.5 py-1 text-[10px] font-semibold text-[var(--muted)] sm:gap-2 sm:px-3 sm:py-1.5 sm:text-[11px]">
                                <CalendarIcon />
                                {item.year}
                            </span>

                            <span className="inline-flex items-center rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/[0.07] px-2.5 py-1 text-[10px] font-bold text-[var(--accent)] sm:px-3 sm:py-1.5 sm:text-[11px]">
                                {item.score}
                            </span>
                        </div>

                        {/* Description */}
                        <p className="mt-3 max-w-3xl text-[12px] leading-5 text-[var(--muted)] sm:mt-5 sm:text-sm sm:leading-6">
                            {item.description}
                        </p>

                        {/* number */}
                        <span className="absolute bottom-0 right-0 text-[11px] font-black tracking-[0.15em] text-[var(--muted)]/25">
                            {String(index + 1).padStart(2, "0")}
                        </span>
                    </div>
                </div>
            </div>
        </article>
    );
}

export function Education() {
    return (
        <section
            id="education"
            aria-labelledby="education-heading"
            className="relative isolate scroll-mt-24 overflow-hidden bg-[var(--background)] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-24"
        >
            {/* Background glow */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-52 top-[15%] -z-10 h-[420px] w-[420px] rounded-full bg-[var(--primary)]/[0.045] blur-[160px]"
            />

            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-48 bottom-[5%] -z-10 h-[360px] w-[360px] rounded-full bg-[var(--accent)]/[0.03] blur-[150px]"
            />

            <div className="mx-auto w-full max-w-6xl">
                {/* Header */}
                <div className="mx-auto max-w-3xl text-center">
                    <div className="flex items-center justify-center gap-3">
                        <span className="h-px w-9 bg-gradient-to-r from-transparent to-[var(--primary)]" />

                        <span className="text-[10px] font-black uppercase tracking-[0.23em] text-[var(--accent)]">
                            My Journey
                        </span>

                        <span className="h-px w-9 bg-gradient-to-l from-transparent to-[var(--primary)]" />
                    </div>

                    <h2
                        id="education-heading"
                        className="mt-4 text-[clamp(2rem,5.5vw,4rem)] font-bold leading-[1.02] tracking-[-0.055em] text-[var(--foreground)]"
                    >
                        Education &
                        <span className="ml-2 bg-gradient-to-r from-[var(--accent)] via-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent">
                            learning.
                        </span>
                    </h2>

                    <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-[15px]">
                        My academic journey alongside the practical skills I continue to
                        develop through technology, projects and continuous learning.
                    </p>
                </div>

                {/* Timeline */}
                <div className="relative mt-7 sm:mt-10">
                    <div
                        aria-hidden="true"
                        className="absolute bottom-8 left-[24px] top-8 hidden w-px bg-gradient-to-b from-[var(--primary)]/70 via-[var(--border)] to-transparent min-[1152px]:block"
                    />

                    <div className="grid gap-2.5 sm:gap-3 md:grid-cols-2 min-[1152px]:!grid-cols-1 min-[1152px]:gap-5">
                        {education.map((item, index) => (
                            <EducationCard
                                key={item.id}
                                item={item}
                                index={index}
                            />
                        ))}
                    </div>
                </div>

                {/* Bottom status */}
                <div className="mt-7 flex justify-center sm:mt-9">
                    <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)]/40 px-3 py-2 text-center backdrop-blur-xl sm:gap-2.5 sm:px-4">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-35" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
                        </span>

                        <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[var(--muted)]">
                            Currently pursuing undergraduate studies
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
