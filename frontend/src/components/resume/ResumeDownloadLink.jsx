"use client";

import { useEffect, useState } from "react";

const fallbackResume = {
  downloadUrl: "/resume/Aditya_Kumawat_Resume.pdf",
  downloadFileName: "Aditya_Kumawat_Resume.pdf",
  visible: true,
};

export default function ResumeDownloadLink() {
  const [resume, setResume] = useState(fallbackResume);

  useEffect(() => {
    let isMounted = true;

    async function loadResume() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/resume`);
        if (!response.ok) return;
        const payload = await response.json();
        const saved = payload?.data?.pdf;
        if (!saved || !isMounted) return;
        setResume({
          ...fallbackResume,
          ...saved,
          downloadUrl: saved.downloadUrl || fallbackResume.downloadUrl,
          downloadFileName: saved.downloadFileName || fallbackResume.downloadFileName,
        });
      } catch {
        // Keep the local resume download available when the CMS is unavailable.
      }
    }

    loadResume();
    return () => { isMounted = false; };
  }, []);

  if (!resume.visible) return null;

  return <a href={resume.downloadUrl} download={resume.downloadFileName} className="inline-flex w-fit items-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200">
    Download Resume
  </a>;
}
