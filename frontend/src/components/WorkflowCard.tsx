import type { WorkflowStage } from "../types/workflow";

import WorkflowTimeline from "./WorkflowTimeline";
import AgentPanel from "./AgentPanel";
import DocumentViewer from "./DocumentViewer";
import FeedbackPanel from "./FeedbackPanel";

interface WorkflowCardProps {
  stage: WorkflowStage;

  loading: boolean;

  agent: string;

  message: string;

  title: string;

  version: number;

  content: string;

  feedback: string;

  stageName: string;

  onFeedbackChange: (value: string) => void;

  onApprove: () => void;

  onRegenerate: () => void;
}

function WorkflowCard({
  stage,
  loading,
  agent,
  message,
  title,
  version,
  content,
  feedback,
  stageName,
  onFeedbackChange,
  onApprove,
  onRegenerate,
}: WorkflowCardProps) {
  return (
    <section className="space-y-8">
      <WorkflowTimeline stage={stage} />

      <AgentPanel
        agent={agent}
        loading={loading}
        message={message}
      />

      <DocumentViewer
        title={title}
        version={version}
        content={content}
      />

      <FeedbackPanel
        stageName={stageName}
        feedback={feedback}
        loading={loading}
        onChange={onFeedbackChange}
        onRegenerate={onRegenerate}
        onApprove={onApprove}
      />
    </section>
  );
}

export default WorkflowCard;