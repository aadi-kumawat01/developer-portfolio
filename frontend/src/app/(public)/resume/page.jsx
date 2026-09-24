import Link from "next/link";
import ResumeDownloadLink from "@/components/resume/ResumeDownloadLink";
import ResumeDocument from "@/components/resume/ResumeDocument";

export const metadata = {
  title: "Resume | Aditya Kumawat",
  description: "Resume of Aditya Kumawat.",
};

export default function ResumePage() {
  return <main className="min-h-screen bg-[#0c0a0b] px-4 pb-20 pt-28 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-5xl">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="inline-flex w-fit items-center rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white/70 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white">
          ← Back to Portfolio
        </Link>
        <ResumeDownloadLink />
      </div>
        <ResumeDocument />
    </div>
  </main>;
}
