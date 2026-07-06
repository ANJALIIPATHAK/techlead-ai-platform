import { useState } from "react";

import { motion } from "framer-motion";
import {
  ChevronsDownUp,
  ChevronsUpDown,
  Download,
  FileText,
} from "lucide-react";

import MarkdownViewer from "./MarkdownViewer";

interface DocumentViewerProps {
  title: string;
  version: number;
  content: string;
  status?: string;
  heightClass?: string;
}

function getStatusClass(status?: string) {
  switch (status) {
    case "APPROVED":
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-200";

    case "REJECTED":
      return "border-rose-400/20 bg-rose-400/10 text-rose-200";

    case "PENDING":
      return "border-violet-400/20 bg-violet-400/10 text-violet-200";

    default:
      return "border-white/10 bg-white/5 text-slate-300";
  }
}

function DocumentViewer({
  title,
  version,
  content,
  status,
  heightClass = "max-h-[420px]",
}: DocumentViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  function downloadMarkdown() {
    const filename = `${title}-v${version}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const blob = new Blob([content], {
      type: "text/markdown;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = `${filename || "document"}.md`;
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden rounded-2xl border border-white/8 bg-[#0f1319] shadow-xl shadow-black/30"
    >
      {/* Header */}

      <div className="flex flex-col gap-4 border-b border-white/8 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex min-w-0 items-center gap-4">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-300">
            <FileText size={19} />
          </div>

          <div className="min-w-0">

            <h2 className="truncate text-lg font-semibold text-white">
              {title}
            </h2>

            <div className="mt-1.5 flex flex-wrap items-center gap-2">

              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-medium text-slate-300">
                v{version}
              </span>

              {status && (
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${getStatusClass(
                    status,
                  )}`}
                >
                  {status}
                </span>
              )}

            </div>

          </div>

        </div>

        <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">

          <button
            type="button"
            onClick={() => setIsExpanded((value) => !value)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-medium text-slate-300 transition hover:border-cyan-400/20 hover:bg-cyan-400/10 hover:text-white"
          >
            {isExpanded ? (
              <ChevronsDownUp size={14} />
            ) : (
              <ChevronsUpDown size={14} />
            )}
            {isExpanded ? "Collapse" : "Expand"}
          </button>

          <button
            type="button"
            onClick={downloadMarkdown}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-medium text-slate-300 transition hover:border-cyan-400/20 hover:bg-cyan-400/10 hover:text-white"
          >
            <Download size={14} />
            Download
          </button>

        </div>

      </div>

      {/* Content */}

      <div
        className={`${
          isExpanded ? "max-h-none" : heightClass
        } overflow-y-auto bg-[#11161d] px-6 py-6 transition-[max-height] duration-300 sm:px-8`}
      >
        <div className="mx-auto max-w-3xl">
          <MarkdownViewer content={content} />
        </div>
      </div>

    </motion.section>
  );
}

export default DocumentViewer;