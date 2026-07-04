import { FileText } from "lucide-react";
import { motion } from "framer-motion";

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
      className="mx-auto mt-10 max-w-5xl rounded-3xl border border-gray-200 bg-white shadow-lg"
    >
      <div className="flex items-center justify-between border-b border-gray-200 px-8 py-5">
        <div className="flex items-center gap-3">
          <FileText
            size={24}
            className="text-blue-600"
          />

          <div>
            <h2 className="text-xl font-semibold">
              {title}
            </h2>

            <p className="text-sm text-gray-500">
              Version {version}
            </p>
          </div>
        </div>
      </div>

      <div className="h-[550px] overflow-y-auto px-8 py-8">
        <MarkdownViewer
          content={content}
        />
      </div>
    </motion.section>
  );
}

export default DocumentViewer;