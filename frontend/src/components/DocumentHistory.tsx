import { useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  Files,
} from "lucide-react";

import type { Document } from "../types/project";
import type { DocumentType } from "../utils/workflowDocuments";

import DocumentViewer from "./DocumentViewer";

interface Props {
  documents: Document[];
  activeType?: DocumentType | null;
  collapseWhenComplete?: boolean;
}

function DocumentHistory({
  documents,
  activeType,
  collapseWhenComplete = false,
}: Props) {
  const [expandedSections, setExpandedSections] =
    useState<Record<string, boolean>>({
      PRD: false,
      SYSTEM_DESIGN: false,
      SPRINT_PLAN: false,
    });

  useEffect(() => {
    if (collapseWhenComplete) {
      setExpandedSections({
        PRD: false,
        SYSTEM_DESIGN: false,
        SPRINT_PLAN: false,
      });

      return;
    }

    // Only the active stage's document stays expanded; moving to the
    // next stage automatically collapses whatever was previously open.
    setExpandedSections({
      PRD: activeType === "PRD",
      SYSTEM_DESIGN: activeType === "SYSTEM_DESIGN",
      SPRINT_PLAN: activeType === "SPRINT_PLAN",
    });
  }, [activeType, collapseWhenComplete]);

  const groupedDocuments = {
    PRD: documents
      .filter((d) => d.type === "PRD")
      .sort((a, b) => b.version - a.version),

    SYSTEM_DESIGN: documents
      .filter((d) => d.type === "SYSTEM_DESIGN")
      .sort((a, b) => b.version - a.version),

    SPRINT_PLAN: documents
      .filter((d) => d.type === "SPRINT_PLAN")
      .sort((a, b) => b.version - a.version),
  };

  const sections: Array<{
    key: DocumentType;
    title: string;
    documents: Document[];
  }> = [
    {
      key: "PRD",
      title: "Product Requirements Documents",
      documents: groupedDocuments.PRD,
    },
    {
      key: "SYSTEM_DESIGN",
      title: "System Design Documents",
      documents: groupedDocuments.SYSTEM_DESIGN,
    },
    {
      key: "SPRINT_PLAN",
      title: "Sprint Plans",
      documents: groupedDocuments.SPRINT_PLAN,
    },
  ];

  const visibleSections = sections.filter(
    (section) => section.documents.length > 0,
  );

  if (visibleSections.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">

      <div className="flex items-center gap-4">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-300">
          <Files size={19} />
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-cyan-300">
            Documents
          </p>

          <h2 className="mt-1 text-xl font-bold tracking-tight text-white">
            Version History
          </h2>
        </div>

      </div>

      <div className="space-y-4">

        {visibleSections.map((section) => {
          const isExpanded = expandedSections[section.key];
          const isActive = section.key === activeType;

          return (
            <section
              key={section.key}
              className={`overflow-hidden rounded-2xl border shadow-xl shadow-black/30 transition-colors duration-300 ${
                isActive
                  ? "border-cyan-400/25 bg-[#101823]"
                  : "border-white/8 bg-[#0f1319]"
              }`}
            >

              <button
                type="button"
                onClick={() =>
                  setExpandedSections((prev) => ({
                    ...prev,
                    [section.key]: !prev[section.key],
                  }))
                }
                className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors duration-300 hover:bg-white/[0.03]"
              >

                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-base font-semibold text-white">
                      {section.title}
                    </h3>

                    <span className="rounded-full border border-cyan-400/15 bg-cyan-400/10 px-2.5 py-0.5 text-[11px] font-semibold text-cyan-200">
                      {section.documents.length} Version
                      {section.documents.length > 1 ? "s" : ""}
                    </span>

                    {isActive && (
                      <span className="rounded-full border border-violet-400/25 bg-violet-400/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-violet-200">
                        Active
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Expand to review every generated version.
                  </p>
                </div>

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                  {isExpanded ? (
                    <ChevronDown className="text-slate-300" size={18} />
                  ) : (
                    <ChevronRight className="text-slate-300" size={18} />
                  )}
                </div>

              </button>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden border-t border-white/8 bg-[#0d1218]"
                  >
                    <div className="space-y-6 p-6">
                      {section.documents.map((document) => (
                        <DocumentViewer
                          key={`${document.type}-${document.version}`}
                          title={document.title}
                          version={document.version}
                          content={document.content}
                          status={document.status}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </section>
          );
        })}

      </div>

    </section>
  );
}

export default DocumentHistory;