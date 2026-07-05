import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  FileText,
  Loader2,
} from "lucide-react";

import type { Document } from "../types/project";
import type { WorkflowStage } from "../types/workflow";
import {
  documentSteps,
  getDocumentProgressStatus,
  getLatestDocument,
  getStatusLabel,
} from "../utils/workflowDocuments";

interface Props {
  documents: Document[];
  stage: WorkflowStage;
}

const statusStyles = {
  WAITING: {
    card: "border-[#30343c] bg-[#15171b]",
    icon: "bg-[#242832] text-slate-400",
    pill: "border-slate-700 bg-slate-900/70 text-slate-300",
    Icon: Clock3,
  },
  GENERATING: {
    card: "border-amber-400/40 bg-amber-400/[0.07]",
    icon: "bg-amber-400/15 text-amber-300",
    pill: "border-amber-400/40 bg-amber-400/10 text-amber-200",
    Icon: Loader2,
  },
  PENDING_APPROVAL: {
    card: "border-violet-400/40 bg-violet-400/[0.07]",
    icon: "bg-violet-400/15 text-violet-300",
    pill: "border-violet-400/40 bg-violet-400/10 text-violet-200",
    Icon: FileText,
  },
  APPROVED: {
    card: "border-teal-400/40 bg-teal-400/[0.07]",
    icon: "bg-teal-400/15 text-teal-300",
    pill: "border-teal-400/40 bg-teal-400/10 text-teal-200",
    Icon: CheckCircle2,
  },
  REJECTED: {
    card: "border-rose-400/40 bg-rose-400/[0.07]",
    icon: "bg-rose-400/15 text-rose-300",
    pill: "border-rose-400/40 bg-rose-400/10 text-rose-200",
    Icon: AlertCircle,
  },
};

function DocumentStatusBoard({
  documents,
  stage,
}: Props) {
  return (
    <section className="rounded-2xl border border-[#2a2f38] bg-[#111317]/90 p-5 shadow-xl shadow-black/20">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-200/80">
            Document Control
          </p>

          <h2 className="mt-1 text-xl font-semibold text-white">
            Live Document Status
          </h2>
        </div>

        <div className="hidden rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-1 text-xs font-medium text-teal-200 sm:block">
          Approval gated
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {documentSteps.map((step) => {
          const status =
            getDocumentProgressStatus(
              documents,
              step.type,
              stage,
            );
          const latestDocument =
            getLatestDocument(
              documents,
              step.type,
            );
          const style = statusStyles[status];
          const Icon = style.Icon;

          return (
            <article
              key={step.type}
              className={`rounded-xl border p-4 ${style.card}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${style.icon}`}
                >
                  <Icon
                    size={21}
                    className={
                      status === "GENERATING"
                        ? "animate-spin"
                        : undefined
                    }
                  />
                </div>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${style.pill}`}
                >
                  {getStatusLabel(status)}
                </span>
              </div>

              <h3 className="mt-5 text-lg font-semibold text-white">
                {step.label}
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                {latestDocument
                  ? `Version ${latestDocument.version}`
                  : "No document yet"}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default DocumentStatusBoard;
