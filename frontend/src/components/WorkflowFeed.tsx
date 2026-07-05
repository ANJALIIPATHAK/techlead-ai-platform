import WorkflowCard from "./WorkflowCard";

import type { Document } from "../types/project";
import type { WorkflowStage } from "../types/workflow";

interface WorkflowFeedProps {
  stage: WorkflowStage;

  loading: boolean;

  agent: string;

  message: string;

  documents: Document[];

  feedback: string;

  stageName: string;

  onFeedbackChange: (value: string) => void;

  onApprove: () => void;

  onRegenerate: () => void;
}

function WorkflowFeed({
  stage,
  loading,
  agent,
  message,
  documents,
  feedback,
  stageName,
  onFeedbackChange,
  onApprove,
  onRegenerate,
}: WorkflowFeedProps) {
  return (
    <div className="mt-12 space-y-16">
      {documents.map((document) => (
        <WorkflowCard
          key={`${document.type}-${document.version}`}
          stage={stage}
          loading={loading}
          agent={agent}
          message={message}
          title={document.title}
          version={document.version}
          content={document.content}
          feedback={feedback}
          stageName={stageName}
          onFeedbackChange={onFeedbackChange}
          onApprove={onApprove}
          onRegenerate={onRegenerate}
        />
      ))}
    </div>
  );
}

export default WorkflowFeed;