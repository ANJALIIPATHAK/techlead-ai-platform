import {
  CheckCircle2,
  Download,
  PackageCheck,
} from "lucide-react";

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

  const link =
    document.createElement("a");

  link.href = url;
  link.download = `${filename || "document"}.md`;
  link.click();

  URL.revokeObjectURL(url);
}

function CompletionSummary({
  documents,
}: Props) {
  const approvedDocuments =
    documentSteps
      .map((step) => ({
        step,
        document:
          getLatestApprovedDocument(
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
    const content =
      approvedDocuments
        .map(
          ({ step, document }) =>
            `# ${step.label}\n\n${document.content}`,
        )
        .join("\n\n---\n\n");

    downloadMarkdown(
      "Hazel AI Final Planning Package",
      content,
    );
  }

  return (
    <section className="space-y-10 rounded-3xl border border-emerald-400/15 bg-[#0f1319] p-10 shadow-2xl shadow-black/40">

      {/* Header */}

      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex gap-5">

          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
            <PackageCheck size={32} />
          </div>

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">
              Workflow Complete
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight text-white">
              Final Planning Package Ready
            </h2>

            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-400">
              Product Requirements,
              System Design and Sprint
              Plan have all been approved.
              Your software planning
              package is now ready for
              engineering.
            </p>

          </div>

        </div>

        <button
          onClick={downloadFinalPackage}
          className="inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 px-8 py-4 text-base font-semibold text-slate-950 shadow-xl shadow-emerald-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-emerald-500/40"
        >
          <Download size={20} />

          Download Complete Package

        </button>

      </div>

      {/* Summary Cards */}

      <div className="grid gap-6 lg:grid-cols-3">

        {approvedDocuments.map(
          ({ step, document }) => (
            <article
              key={step.type}
              className="rounded-2xl border border-white/8 bg-[#151a22] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/20 hover:shadow-xl"
            >
              <div className="mb-6 flex items-center justify-between">

                <div className="flex items-center gap-2 text-emerald-300">

                  <CheckCircle2
                    size={20}
                  />

                  <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                    Approved
                  </span>

                </div>

                <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                  v{document.version}
                </div>

              </div>

              <h3 className="text-lg font-semibold text-white">
                {step.label}
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-400">
                Latest approved version
                available for download.
              </p>

              <button
                onClick={() =>
                  downloadMarkdown(
                    `${step.label} v${document.version}`,
                    document.content,
                  )
                }
                className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition-all duration-300 hover:border-emerald-400/25 hover:bg-emerald-400/10 hover:text-white"
              >
                <Download size={16} />

                Download

              </button>

            </article>
          ),
        )}

      </div>

      {/* Documents */}

      <div className="space-y-10">

        {approvedDocuments.map(
          ({ step, document }) => (
            <DocumentViewer
              key={`${step.type}-${document.version}`}
              title={step.label}
              version={document.version}
              content={document.content}
              status="APPROVED"
              heightClass="max-h-[460px]"
            />
          ),
        )}

      </div>

    </section>
  );
}

export default CompletionSummary;