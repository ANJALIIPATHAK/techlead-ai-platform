import { CheckCircle2, Download, PackageCheck } from "lucide-react";

import type { Document } from "../types/project";
import {
  documentSteps,
  getLatestApprovedDocument,
} from "../utils/workflowDocuments";

import DocumentViewer from "./DocumentViewer";

interface Props {
  documents: Document[];
}

function downloadMarkdown(
  title: string,
  content: string,
) {
  const filename = title
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

function CompletionSummary({
  documents,
}: Props) {
  const approvedDocuments = documentSteps
    .map((step) => ({
      step,
      document: getLatestApprovedDocument(
        documents,
        step.type,
      ),
    }))
    .filter(
      (
        item,
      ): item is {
        step: (typeof documentSteps)[number];
        document: Document;
      } => Boolean(item.document),
    );

  function downloadFinalPackage() {
    const content = approvedDocuments
      .map(
        ({ step, document }) =>
          `# ${step.label}\n\n${document.content}`,
      )
      .join("\n\n---\n\n");

    downloadMarkdown(
      "Hazel AI final planning package",
      content,
    );
  }

  return (
    <section className="space-y-6 rounded-2xl border border-teal-400/30 bg-teal-400/[0.06] p-6 shadow-xl shadow-black/20">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-400/15 text-teal-200">
            <PackageCheck size={26} />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200/80">
              Workflow Complete
            </p>

            <h2 className="mt-1 text-2xl font-semibold text-white">
              Final approved planning package is ready
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
              The Product Requirements, System Design, and Sprint Plan have all
              been approved.
            </p>
          </div>
        </div>

        <button
          onClick={downloadFinalPackage}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-950/30 hover:bg-teal-300"
        >
          <Download size={17} />
          Download Package
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {approvedDocuments.map(
          ({ step, document }) => (
            <article
              key={step.type}
              className="rounded-xl border border-teal-400/20 bg-[#101418] p-4"
            >
              <div className="mb-4 flex items-center gap-2 text-teal-200">
                <CheckCircle2 size={18} />
                <span className="text-xs font-semibold uppercase tracking-[0.16em]">
                  Approved
                </span>
              </div>

              <h3 className="text-base font-semibold text-white">
                {step.label}
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Version {document.version}
              </p>

              <button
                onClick={() =>
                  downloadMarkdown(
                    `${step.label} v${document.version}`,
                    document.content,
                  )
                }
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#30343c] px-3 py-2 text-sm font-medium text-slate-200 hover:border-teal-300 hover:text-white"
              >
                <Download size={15} />
                Download
              </button>
            </article>
          ),
        )}
      </div>

      <div className="space-y-5">
        {approvedDocuments.map(
          ({ step, document }) => (
            <DocumentViewer
              key={`${step.type}-${document.version}`}
              title={step.label}
              version={document.version}
              content={document.content}
              status="APPROVED"
              heightClass="max-h-[420px]"
            />
          ),
        )}
      </div>
    </section>
  );
}

export default CompletionSummary;
