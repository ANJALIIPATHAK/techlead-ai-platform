import { useEffect, useState } from "react";

import { ChevronDown, ChevronRight } from "lucide-react";

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
    <section className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
          Version History
        </p>

        <h2 className="mt-1 text-2xl font-semibold text-white">
          Generated Documents
        </h2>
      </div>

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
            className="overflow-hidden rounded-2xl border border-[#2a2f38] bg-[#111317]/90 shadow-xl shadow-black/20"
          >
            <button
              onClick={() =>
                setExpandedSections(
                  (prev) => ({
                    ...prev,
                    [section.key]:
                      !prev[section.key],
                  }),
                )
              }
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {section.title}
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  {
                    section.documents
                      .length
                  }{" "}
                  version(s)
                </p>
              </div>

              {isExpanded ? (
                <ChevronDown className="shrink-0 text-slate-400" />
              ) : (
                <ChevronRight className="shrink-0 text-slate-400" />
              )}
            </button>

            {isExpanded && (
              <div className="space-y-5 border-t border-[#2a2f38] p-5">
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
            )}
          </section>
        );
      })}
    </section>
  );
}

export default DocumentHistory;
