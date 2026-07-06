import {
  FolderClock,
  PanelLeftClose,
  PanelLeftOpen,
  RefreshCw,
} from "lucide-react";

import type { Document, Project } from "../types/project";
import type { WorkflowStage } from "../types/workflow";

import WorkflowStepper from "./WorkflowStepper";

interface Props {
  isOpen: boolean;
  onToggle: () => void;
  stage: WorkflowStage;
  documents: Document[];
  projectHistory: Project[];
  historyLoading: boolean;
  onRefreshHistory: () => void;
  onOpenProject: (projectId: string) => void;
}

function AppSidebar({
  isOpen,
  onToggle,
  stage,
  documents,
  projectHistory,
  historyLoading,
  onRefreshHistory,
  onOpenProject,
}: Props) {
  return (
    <aside
      className={`w-full shrink-0 overflow-hidden rounded-3xl border border-white/10 bg-[#0f1319]/80 shadow-2xl shadow-black/30 backdrop-blur transition-all duration-300 lg:sticky lg:top-6 ${
        isOpen ? "p-5 lg:w-[300px]" : "p-3 lg:w-16"
      }`}
    >
      <div
        className={`flex items-center ${
          isOpen ? "justify-between" : "justify-center"
        }`}
      >
        {isOpen && (
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-cyan-300">
            Workspace
          </p>
        )}

        <button
          type="button"
          onClick={onToggle}
          aria-label={
            isOpen ? "Collapse sidebar" : "Expand sidebar"
          }
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10"
        >
          {isOpen ? (
            <PanelLeftClose size={16} />
          ) : (
            <PanelLeftOpen size={16} />
          )}
        </button>
      </div>

      <div className="mt-6">
        <WorkflowStepper
          stage={stage}
          documents={documents}
          collapsed={!isOpen}
        />
      </div>

      <div className="my-7 h-px bg-white/8" />

      {isOpen ? (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-cyan-300">
                History
              </p>

              <h3 className="mt-1 text-sm font-semibold text-white">
                Previous projects
              </h3>
            </div>

            <button
              type="button"
              onClick={onRefreshHistory}
              aria-label="Refresh project history"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10"
            >
              <RefreshCw size={14} />
            </button>
          </div>

          <div className="max-h-[360px] space-y-3 overflow-y-auto pr-1">
            {historyLoading ? (
              <p className="text-sm text-slate-400">
                Loading history...
              </p>
            ) : projectHistory.length === 0 ? (
              <p className="text-sm text-slate-500">
                No projects yet.
              </p>
            ) : (
              projectHistory.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onOpenProject(item.id)}
                  className="block w-full rounded-2xl border border-white/10 bg-[#0b0f14] p-4 text-left transition hover:border-cyan-400/20 hover:bg-[#0d1219]"
                >
                  <h4 className="truncate text-sm font-semibold text-white">
                    {item.title}
                  </h4>

                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-400">
                    {item.description}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400"
            title="Previous projects"
          >
            <FolderClock size={16} />
          </div>
        </div>
      )}
    </aside>
  );
}

export default AppSidebar;