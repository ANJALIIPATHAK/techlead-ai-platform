import { motion } from "framer-motion";
import { Download, FileText } from "lucide-react";

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
      return "border-teal-400/35 bg-teal-400/10 text-teal-200";
    case "REJECTED":
      return "border-rose-400/35 bg-rose-400/10 text-rose-200";
    case "PENDING":
      return "border-violet-400/35 bg-violet-400/10 text-violet-200";
    default:
      return "border-slate-700 bg-slate-900/70 text-slate-300";
  }
}

function DocumentViewer({
  title,
  version,
  content,
  status,
  heightClass = "max-h-[520px]",
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
    const link = document.createElement("a");

    link.href = url;
    link.download = `${filename || "document"}.md`;
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden rounded-2xl border border-[#2a2f38] bg-[#111317] shadow-xl shadow-black/20"
    >
      <div className="sticky top-0 z-10 flex flex-col gap-4 border-b border-[#2a2f38] bg-[#111317]/95 px-5 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <div className="rounded-xl bg-amber-400/10 p-3 text-amber-200">
            <FileText size={22} />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-xl font-semibold text-white">
              {title}
            </h2>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-sm text-slate-400">
                Version {version}
              </span>

              {status && (
                <span
                  className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                    status,
                  )}`}
                >
                  {status}
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={downloadMarkdown}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#343a44] bg-[#171a20] px-4 py-2 text-sm font-medium text-slate-200 hover:border-amber-300 hover:text-white"
        >
          <Download size={16} />
          Download
        </button>
      </div>

      <div
        className={`${heightClass} overflow-y-auto px-6 py-6`}
      >
        <MarkdownViewer content={content} />
      </div>
    </motion.section>
  );
}

export default DocumentViewer;
