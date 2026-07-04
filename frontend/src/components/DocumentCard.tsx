import { FileText } from "lucide-react";

import type { Document } from "../types/project";
import MarkdownViewer from "./MarkdownViewer";
import StatusBadge from "./StatusBadge";

interface DocumentCardProps {
  document: Document;
}

function DocumentCard({
  document,
}: DocumentCardProps) {
  return (
    <section className="mb-8 rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText
              size={22}
              className="text-blue-600"
            />

            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {document.title}
              </h2>

              <p className="text-sm text-gray-500">
                {document.type.replace("_", " ")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <StatusBadge status={document.status} />

            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
              Version {document.version}
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <MarkdownViewer
          content={document.content}
        />
      </div>
    </section>
  );
}

export default DocumentCard;