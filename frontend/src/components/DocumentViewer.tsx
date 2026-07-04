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
}

function DocumentViewer({
  title,
  version,
  content,
}: DocumentViewerProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/70 shadow-2xl backdrop-blur-xl"
    >
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-800 bg-zinc-900/95 px-8 py-6 backdrop-blur">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-blue-500/10 p-3">
            <FileText
              size={26}
              className="text-blue-400"
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              {title}
            </h2>

            <p className="mt-1 text-sm text-zinc-400">
              Version {version}
            </p>
          </div>
        </div>

        <button
          disabled
          className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-blue-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download size={16} />
          Download
        </button>
      </div>

      <div className="h-[650px] overflow-y-auto px-10 py-8">
        <MarkdownViewer
          content={content}
        />
      </div>
    </motion.section>
  );
}

export default DocumentViewer;