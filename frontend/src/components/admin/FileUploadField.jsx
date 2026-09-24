"use client";

import { useId, useState } from "react";

function formatFileSize(bytes) {
  if (!bytes) return "";
  return `${(bytes / 1024 / 1024).toFixed(bytes > 1024 * 1024 ? 1 : 0)} MB`;
}

export default function FileUploadField({ label, buttonLabel, accept, helpText, currentUrl = "", currentFileName = "", previewAlt = "", previewClassName = "", disabled = false, isUploading = false, onChange, onRemove }) {
  const inputId = useId();
  const [selectedFile, setSelectedFile] = useState(null);
  const imagePreview = currentUrl && previewAlt;
  const fileName = selectedFile?.name || currentFileName;

  function handleChange(event) {
    const file = event.target.files?.[0];
    if (file) setSelectedFile(file);
    onChange(event);
  }

  return <div className="min-w-0 rounded-xl border border-white/10 bg-black/10 p-4">
    <div className="flex min-w-0 flex-wrap items-center gap-4">
      {imagePreview ? <img src={currentUrl} alt={previewAlt} className={previewClassName} /> : <span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-lg text-[#ef6072]">{previewAlt ? "◈" : "PDF"}</span>}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-white">{label}</p>
        {fileName && <p className="mt-1 truncate text-xs text-white/65">{selectedFile ? `${fileName} · ${formatFileSize(selectedFile.size)}` : `Current: ${fileName}`}</p>}
        <p className="mt-1 text-xs text-white/45">{isUploading ? "Uploading..." : helpText}</p>
      </div>
      <label htmlFor={inputId} aria-disabled={disabled} className={`inline-flex shrink-0 items-center rounded-lg border px-3 py-2 text-sm font-medium transition ${disabled ? "cursor-not-allowed border-white/10 text-white/35" : "cursor-pointer border-white/15 text-white/80 hover:border-[#e82b45] hover:text-white"}`}>
        {isUploading ? "Uploading..." : buttonLabel}
      </label>
      <input id={inputId} type="file" accept={accept} disabled={disabled} onChange={handleChange} className="sr-only" />
    </div>
    {onRemove && currentUrl && <button type="button" onClick={onRemove} className="mt-3 cursor-pointer text-xs text-[#ffb0bb] hover:text-white">Remove</button>}
  </div>;
}
