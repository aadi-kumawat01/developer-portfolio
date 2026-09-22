import Link from "next/link";

export const metadata = {
    title: "Resume | Aditya Kumawat",
    description:
        "Resume of Aditya Kumawat - Full Stack Web Developer seeking internship and junior developer opportunities.",
};

function SectionTitle({ children }) {
    return (
        <h2 className="mb-3 mt-7 border-b border-zinc-200 pb-2 text-sm font-bold uppercase tracking-[0.12em] text-zinc-950">
            {children}
        </h2>
    );
}

export default function ResumePage() {
    return (
        <main className="min-h-screen bg-[#0c0a0b] px-4 pb-20 pt-28 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
                {/* Top Actions */}
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Link
                        href="/"
                        className="inline-flex w-fit items-center rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white/70 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
                    >
                        ← Back to Portfolio
                    </Link>

                    <a
                        href="/resume/Aditya_Kumawat_Resume.pdf"
                        download="Aditya_Kumawat_Resume.pdf"
                        className="inline-flex w-fit items-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
                    >
                        Download Resume
                    </a>
                </div>

                {/* Resume Paper */}
                <article className="mx-auto max-w-[900px] bg-white px-6 py-8 text-zinc-800 shadow-[0_30px_100px_rgba(0,0,0,0.35)] sm:px-10 sm:py-10 lg:px-14 lg:py-12">
                    {/* Header */}
                    <header className="border-b border-zinc-200 pb-5 text-center">
                        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl">
                            ADITYA KUMAWAT
                        </h1>

                        <p className="mt-2 text-sm font-semibold text-zinc-700 sm:text-base">
                            Full Stack Web Developer | Internship & Junior Developer Roles
                        </p>

                        <div className="mx-auto mt-4 flex max-w-3xl flex-wrap justify-center gap-x-3 gap-y-1 text-xs leading-5 text-zinc-600 sm:text-sm">
                            <span>Jaipur, Rajasthan</span>
                            <span className="text-zinc-300">|</span>

                            <a
                                href="tel:6378891872"
                                className="transition hover:text-zinc-950"
                            >
                                6378891872
                            </a>

                            <span className="text-zinc-300">|</span>

                            <a
                                href="mailto:aadityakumawat6165@gmail.com"
                                className="transition hover:text-zinc-950"
                            >
                                aadityakumawat6165@gmail.com
                            </a>
                        </div>

                        <div className="mt-1 flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-zinc-600 sm:text-sm">
                            <a
                                href="https://www.linkedin.com/in/aditya-kumawat-b936ab31a"
                                target="_blank"
                                rel="noreferrer"
                                className="transition hover:text-zinc-950 hover:underline"
                            >
                                linkedin.com/in/aditya-kumawat-b936ab31a
                            </a>

                            <span className="text-zinc-300">|</span>

                            <a
                                href="https://github.com/aadi-kumawat01"
                                target="_blank"
                                rel="noreferrer"
                                className="transition hover:text-zinc-950 hover:underline"
                            >
                                github.com/aadi-kumawat01
                            </a>
                        </div>
                    </header>

                    {/* Summary */}
                    <SectionTitle>Professional Summary</SectionTitle>

                    <p className="text-sm leading-6 text-zinc-700">
                        Full Stack Web Developer focused on building responsive web
                        applications with Next.js, Node.js, Express.js and MongoDB. Built
                        individual full-stack projects including a complete e-commerce
                        platform and a role-based cafe management system. Looking for
                        internship or junior developer opportunities where I can contribute
                        to frontend and backend development while working on real products.
                    </p>

                    {/* Skills */}
                    <SectionTitle>Technical Skills</SectionTitle>

                    <div className="space-y-1.5 text-sm leading-6 text-zinc-700">
                        <p>
                            <strong className="text-zinc-950">Frontend:</strong>{" "}
                            HTML, CSS, JavaScript, React.js, Next.js, Tailwind CSS, Bootstrap
                        </p>

                        <p>
                            <strong className="text-zinc-950">Backend:</strong>{" "}
                            Node.js, Express.js
                        </p>

                        <p>
                            <strong className="text-zinc-950">Database:</strong>{" "}
                            MongoDB
                        </p>

                        <p>
                            <strong className="text-zinc-950">Version Control:</strong>{" "}
                            Git
                        </p>
                    </div>

                    {/* Projects */}
                    <SectionTitle>Projects</SectionTitle>

                    <div className="space-y-7">
                        {/* Nestro */}
                        <div>
                            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                                <h3 className="text-base font-bold text-zinc-950">
                                    Nestro E-commerce
                                </h3>

                                <p className="text-xs font-medium text-zinc-500">
                                    August 2026 | Individual Project
                                </p>
                            </div>

                            <p className="mt-1 text-sm text-zinc-600">
                                Next.js • Node.js • Express.js • MongoDB • Tailwind CSS
                            </p>

                            <div className="mt-2 flex gap-4 text-sm font-medium">
                                <a
                                    href="https://nestro-one.vercel.app/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-zinc-950 underline underline-offset-4"
                                >
                                    Live Demo
                                </a>

                                <a
                                    href="https://github.com/aadi-kumawat01/nestro"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-zinc-950 underline underline-offset-4"
                                >
                                    GitHub
                                </a>
                            </div>

                            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-6 text-zinc-700">
                                <li>
                                    Built an end-to-end e-commerce application with
                                    authentication, product browsing, search and filtering, cart,
                                    wishlist, checkout, orders and admin management.
                                </li>

                                <li>
                                    Implemented COD and Razorpay payment flows, user
                                    profile/address management and responsive interfaces for
                                    mobile, tablet and desktop.
                                </li>

                                <li>
                                    Used Express.js APIs and MongoDB to manage users, products,
                                    carts, orders and store data across the application.
                                </li>
                            </ul>
                        </div>

                        {/* Cafe */}
                        <div>
                            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                                <h3 className="text-base font-bold text-zinc-950">
                                    Cafe Management System
                                </h3>

                                <p className="text-xs font-medium text-zinc-500">
                                    September 2026 | Individual Project
                                </p>
                            </div>

                            <p className="mt-1 text-sm text-zinc-600">
                                Next.js • Node.js • Express.js • MongoDB • Tailwind CSS
                            </p>

                            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-6 text-zinc-700">
                                <li>
                                    Built a full-stack cafe management application with
                                    role-based access for Admin, Waiter and Kitchen/Cook users.
                                </li>

                                <li>
                                    Implemented permission-based access so each user role can work
                                    with the parts of the system required for its responsibilities.
                                </li>

                                <li>
                                    Developed responsive frontend screens and backend APIs with
                                    MongoDB for application data and access-controlled workflows.
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Education */}
                    <SectionTitle>Education</SectionTitle>

                    <div className="space-y-4">
                        <div>
                            <div className="flex flex-col sm:flex-row sm:justify-between">
                                <h3 className="text-sm font-bold text-zinc-950">
                                    Bachelor of Arts (B.A.)
                                </h3>

                                <span className="text-xs font-medium text-zinc-500">
                                    2025 - 2028
                                </span>
                            </div>

                            <p className="mt-1 text-sm text-zinc-700">
                                Govt Arts College, Sikar
                            </p>

                            <p className="text-sm text-zinc-500">
                                Pandit Deendayal Upadhyaya Shekhawati University, Sikar
                                {" "}• Currently 2nd Year
                            </p>
                        </div>

                        <div>
                            <div className="flex flex-col sm:flex-row sm:justify-between">
                                <h3 className="text-sm font-bold text-zinc-950">
                                    Class XII - Science (Mathematics)
                                </h3>

                                <span className="text-xs font-medium text-zinc-500">
                                    2024
                                </span>
                            </div>

                            <p className="mt-1 text-sm text-zinc-700">
                                Bright Sr. Sec. School • RBSE •{" "}
                                <strong className="text-zinc-950">90.60%</strong>
                            </p>
                        </div>

                        <div>
                            <div className="flex flex-col sm:flex-row sm:justify-between">
                                <h3 className="text-sm font-bold text-zinc-950">
                                    Class X
                                </h3>

                                <span className="text-xs font-medium text-zinc-500">
                                    2022
                                </span>
                            </div>

                            <p className="mt-1 text-sm text-zinc-700">
                                Bright Sr. Sec. School • RBSE •{" "}
                                <strong className="text-zinc-950">79%</strong>
                            </p>
                        </div>
                    </div>

                    {/* Training */}
                    <SectionTitle>Training & Certification</SectionTitle>

                    <div>
                        <h3 className="text-sm font-bold text-zinc-950">
                            MERN Full Stack Development
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-zinc-700">
                            WsCube Career School, Jaipur • 6-month program • March 2026 -
                            September 2026
                        </p>

                        <p className="text-sm text-zinc-500">
                            Certification expected September 2026
                        </p>
                    </div>

                    {/* Achievements */}
                    <SectionTitle>Achievements</SectionTitle>

                    <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-zinc-700">
                        <li>
                            <strong className="text-zinc-950">1st Position</strong> -
                            DOMinate with JavaScript - Coding Event, WsCube Career School,
                            Jaipur • 27 June 2026
                        </li>

                        <li>
                            <strong className="text-zinc-950">2nd Position</strong> -
                            Cascading Creativity - Coding Event, WsCube Career School,
                            Jaipur • 23 May 2026
                        </li>
                    </ul>

                    {/* Languages */}
                    <SectionTitle>Languages</SectionTitle>

                    <p className="text-sm text-zinc-700">
                        Hindi, English
                    </p>
                </article>
            </div>
        </main>
    );
}
