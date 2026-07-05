import { useEffect, useState } from "react";

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

    if (!activeType) {
      return;
    }

    setExpandedSections((prev) => ({
      ...prev,
      [activeType]: true,
    }));
  }, [activeType, collapseWhenComplete]);

  const groupedDocuments = {
    PRD: documents
      .filter((d) => d.type === "PRD")
      .sort((a, b) => b.version - a.version),

    SYSTEM_DESIGN: documents
      .filter(
        (d) => d.type === "SYSTEM_DESIGN",
      )
      .sort((a, b) => b.version - a.version),

    SPRINT_PLAN: documents
      .filter(
        (d) => d.type === "SPRINT_PLAN",
      )
      .sort((a, b) => b.version - a.version),
  };

  const sections: Array<{
    key: DocumentType;
    title: string;
    documents: Document[];
  }> = [
    {
      key: "PRD",
      title:
        "Product Requirements Documents",
      documents: groupedDocuments.PRD,
    },
    {
      key: "SYSTEM_DESIGN",
      title: "System Design Documents",
      documents:
        groupedDocuments.SYSTEM_DESIGN,
    },
    {
      key: "SPRINT_PLAN",
      title: "Sprint Plans",
      documents:
        groupedDocuments.SPRINT_PLAN,
    },
  ];

  return (
    <section className="space-y-8">

      <div className="flex items-center gap-5">

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300">
          <Files size={24} />
        </div>

        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-300">
            Documents
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">
            Version History
          </h2>

        </div>

      </div>

      <div className="space-y-6">

        {sections.map((section) => {

          if (
            section.documents.length === 0
          ) {
            return null;
          }

          const isExpanded =
            expandedSections[section.key];

          return (
            <section
              key={section.key}
              className="overflow-hidden rounded-3xl border border-white/8 bg-[#0f1319] shadow-2xl shadow-black/40 transition-all duration-300"
            >

              <button
                onClick={() =>
                  setExpandedSections(
                    (prev) => ({
                      ...prev,
                      [section.key]:
                        !prev[
                          section.key
                        ],
                    }),
                  )
                }
                className="flex w-full items-center justify-between px-8 py-7 text-left transition-colors duration-300 hover:bg-white/[0.03]"
              >

                <div>

                  <div className="flex items-center gap-4">

                    <h3 className="text-xl font-semibold text-white">
                      {section.title}
                    </h3>

                    <span className="rounded-full border border-cyan-400/15 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                      {
                        section.documents
                          .length
                      }{" "}
                      Version
                      {section.documents
                        .length > 1
                        ? "s"
                        : ""}
                    </span>

                  </div>

                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    Expand to review every
                    generated version for
                    this document.
                  </p>

                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5">

                  {isExpanded ? (
                    <ChevronDown
                      className="text-slate-300"
                      size={22}
                    />
                  ) : (
                    <ChevronRight
                      className="text-slate-300"
                      size={22}
                    />
                  )}

                </div>

              </button>

              {isExpanded && (

                <div className="border-t border-white/8 bg-[#121821] p-8">

                  <div className="space-y-8">

                    {section.documents.map(
                      (document) => (

                        <DocumentViewer
                          key={`${document.type}-${document.version}`}
                          title={
                            document.title
                          }
                          version={
                            document.version
                          }
                          content={
                            document.content
                          }
                          status={
                            document.status
                          }
                        />

                      ),
                    )}

                  </div>

                </div>

              )}

            </section>
          );
        })}

      </div>

    </section>
  );
}

export default DocumentHistory;