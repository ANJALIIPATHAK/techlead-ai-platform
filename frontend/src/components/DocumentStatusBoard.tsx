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
    card:
      "border-white/8 bg-[#12161d]",
    icon:
      "bg-slate-700/20 text-slate-400",
    pill:
      "border-slate-700 bg-slate-800/70 text-slate-300",
    glow: "",
    Icon: Clock3,
  },

  GENERATING: {
    card:
      "border-cyan-400/20 bg-gradient-to-br from-cyan-500/[0.07] to-[#12161d]",
    icon:
      "bg-cyan-400/15 text-cyan-300",
    pill:
      "border-cyan-400/30 bg-cyan-400/10 text-cyan-200",
    glow:
      "shadow-xl shadow-cyan-950/20",
    Icon: Loader2,
  },

  PENDING_APPROVAL: {
    card:
      "border-violet-400/20 bg-gradient-to-br from-violet-500/[0.07] to-[#12161d]",
    icon:
      "bg-violet-400/15 text-violet-300",
    pill:
      "border-violet-400/30 bg-violet-400/10 text-violet-200",
    glow:
      "shadow-xl shadow-violet-950/20",
    Icon: FileText,
  },

  APPROVED: {
    card:
      "border-emerald-400/20 bg-gradient-to-br from-emerald-500/[0.07] to-[#12161d]",
    icon:
      "bg-emerald-400/15 text-emerald-300",
    pill:
      "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
    glow:
      "shadow-xl shadow-emerald-950/20",
    Icon: CheckCircle2,
  },

  REJECTED: {
    card:
      "border-rose-400/20 bg-gradient-to-br from-rose-500/[0.07] to-[#12161d]",
    icon:
      "bg-rose-400/15 text-rose-300",
    pill:
      "border-rose-400/30 bg-rose-400/10 text-rose-200",
    glow:
      "shadow-xl shadow-rose-950/20",
    Icon: AlertCircle,
  },
};

function DocumentStatusBoard({
  documents,
  stage,
}: Props) {
  return (
    <section className="rounded-3xl border border-white/8 bg-[#0f1319] p-10 shadow-2xl shadow-black/40">
      <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
            Workflow Overview
          </p>

          <h2 className="mt-3 text-4xl font-bold tracking-tight text-white">
            Planning Deliverables
          </h2>

          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-400">
            Monitor every planning artifact as it progresses through the
            approval workflow.
          </p>
        </div>

        <div className="self-start rounded-full border border-cyan-400/20 bg-cyan-400/10 px-5 py-2 text-sm font-medium text-cyan-200">
          Enterprise Workflow
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
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

          const style =
            statusStyles[status];

          const Icon =
            style.Icon;

          return (
            <article
              key={step.type}
              className={`group rounded-3xl border ${style.card} ${style.glow} p-7 transition-all duration-300 hover:-translate-y-2 hover:border-white/15 hover:shadow-2xl`}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl ${style.icon}`}
                >
                  <Icon
                    size={28}
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

              <div className="mt-9">
                <h3 className="text-2xl font-semibold text-white">
                  {step.label}
                </h3>

                <p className="mt-4 text-xs uppercase tracking-[0.22em] text-slate-500">
                  Latest Version
                </p>

                <p className="mt-2 text-xl font-medium text-slate-200">
                  {latestDocument
                    ? `Version ${latestDocument.version}`
                    : "Not Generated"}
                </p>
              </div>

              <div className="my-7 h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent" />

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                    Status
                  </p>

                  <p className="mt-2 text-sm font-medium text-slate-300">
                    {getStatusLabel(status)}
                  </p>
                </div>

                {status === "APPROVED" && (
                  <div className="rounded-xl bg-emerald-400/10 px-4 py-2 text-xs font-semibold text-emerald-300">
                    Ready →
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default DocumentStatusBoard;