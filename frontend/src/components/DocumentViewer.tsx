import { motion } from "framer-motion";
import {
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
  heightClass = "max-h-[560px]",
}: DocumentViewerProps) {
  function downloadMarkdown() {
    const filename = `${title}-v${version}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const blob = new Blob([content], {
      type: "text/markdown;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download = `${filename || "document"}.md`;
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.35,
      }}
      className="overflow-hidden rounded-3xl border border-white/8 bg-[#0f1319] shadow-2xl shadow-black/40"
    >
      {/* Header */}

      <div className="sticky top-0 z-10 border-b border-white/8 bg-[#0f1319]/95 px-8 py-6 backdrop-blur-xl">

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex min-w-0 items-center gap-5">

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300">
              <FileText size={26} />
            </div>

            <div className="min-w-0">

              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
                Generated Document
              </p>

              <h2 className="mt-2 truncate text-2xl font-bold text-white">
                {title}
              </h2>

              <div className="mt-3 flex flex-wrap items-center gap-3">

                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300">
                  Version {version}
                </div>

                {status && (
                  <div
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(
                      status,
                    )}`}
                  >
                    {status}
                  </div>
                )}

              </div>

            </div>

          </div>

          <button
            onClick={downloadMarkdown}
            className="inline-flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-200 transition-all duration-300 hover:border-cyan-400/20 hover:bg-cyan-400/10 hover:text-white"
          >
            <Download size={17} />

            Download Markdown

          </button>

        </div>

      </div>

      {/* Content */}

      <div
        className={`${heightClass} overflow-y-auto bg-[#11161d] px-10 py-10`}
      >
        <div className="mx-auto max-w-5xl">
          <MarkdownViewer content={content} />
        </div>
      </div>
    </motion.section>
  );
}

export default DocumentViewer;