import { useEffect, useMemo, useState } from "react";

import { motion } from "framer-motion";
import {
  Bot,
  MessageSquareText,
  Sparkles,
} from "lucide-react";

import type { WorkflowStage } from "../types/workflow";

interface AgentPanelProps {
  agent: string;
  message: string;
  loading: boolean;
  stage?: WorkflowStage;
}

const stageMessages: Record<
  WorkflowStage,
  string[]
> = {
  IDLE: [
    "Tell me what you want to build, and I will start the planning workflow.",
  ],
  GENERATING_PRD: [
    "Hi, I am your Product Manager. I am analyzing your project description.",
    "I am identifying goals, users, risks, and business requirements.",
    "I am drafting the Product Requirements Document.",
  ],
  REVIEW_PRD: [
    "The PRD is ready. I am waiting for your approval or feedback.",
  ],
  GENERATING_SYSTEM_DESIGN: [
    "Hi, I am your System Architect. The approved PRD has been handed to me.",
    "I am analyzing the requirements and mapping the system boundaries.",
    "I am drafting the architecture, data model, APIs, and deployment design.",
  ],
  REVIEW_SYSTEM_DESIGN: [
    "The System Design is ready. I am waiting for your approval or feedback.",
  ],
  GENERATING_SPRINT_PLAN: [
    "Hi, I am your Program Manager. I have the approved system design.",
    "I am breaking the work into delivery phases and implementation tasks.",
    "I am drafting the sprint plan for the engineering team.",
  ],
  REVIEW_SPRINT_PLAN: [
    "The Sprint Plan is ready. Review it, then approve it to complete the workflow.",
  ],
  COMPLETED: [
    "Congratulations. The full software planning workflow is complete.",
  ],
};

const agentTone: Record<
  string,
  {
    ring: string;
    avatar: string;
    badge: string;
    label: string;
  }
> = {
  "Product Manager": {
    ring: "shadow-amber-950/50",
    avatar:
      "from-amber-300 via-orange-400 to-rose-400",
    badge:
      "border-amber-300/40 bg-amber-300/10 text-amber-100",
    label: "Product Strategy",
  },
  "System Architect": {
    ring: "shadow-violet-950/50",
    avatar:
      "from-violet-300 via-indigo-400 to-sky-400",
    badge:
      "border-violet-300/40 bg-violet-300/10 text-violet-100",
    label: "Architecture",
  },
  "Program Manager": {
    ring: "shadow-teal-950/50",
    avatar:
      "from-teal-300 via-emerald-400 to-lime-300",
    badge:
      "border-teal-300/40 bg-teal-300/10 text-teal-100",
    label: "Delivery Planning",
  },
  "TechLead AI": {
    ring: "shadow-teal-950/50",
    avatar:
      "from-teal-300 via-cyan-300 to-violet-300",
    badge:
      "border-teal-300/40 bg-teal-300/10 text-teal-100",
    label: "Workflow Complete",
  },
};

function AgentPanel({
  agent,
  message,
  loading,
  stage = "IDLE",
}: AgentPanelProps) {
  const [messageIndex, setMessageIndex] =
    useState(0);

  const messages = useMemo(
    () => stageMessages[stage] ?? [message],
    [message, stage],
  );

  const tone =
    agentTone[agent] ?? agentTone["TechLead AI"];

  const shouldRotate =
    loading || stage.startsWith("GENERATING");

  useEffect(() => {
    setMessageIndex(0);
  }, [stage]);

  useEffect(() => {
    if (!shouldRotate || messages.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setMessageIndex(
        (current) =>
          (current + 1) % messages.length,
      );
    }, 2200);

    return () =>
      window.clearInterval(interval);
  }, [messages.length, shouldRotate]);

  const visibleMessage =
    messages[messageIndex] ?? message;

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border border-[#2a2f38] bg-[#111317]/92 p-6 shadow-2xl shadow-black/25"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
        <motion.div
          animate={
            shouldRotate
              ? { y: [0, -6, 0] }
              : { y: 0 }
          }
          transition={{
            duration: 2,
            repeat: shouldRotate
              ? Infinity
              : 0,
            ease: "easeInOut",
          }}
          className={`relative flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${tone.avatar} shadow-2xl ${tone.ring}`}
        >
          <span className="absolute inset-0 rounded-2xl border border-white/30" />
          <Bot
            size={46}
            className="relative text-slate-950"
          />
        </motion.div>

        <div className="min-w-0 flex-1">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-semibold text-white">
              {agent}
            </h2>

            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${tone.badge}`}
            >
              {tone.label}
            </span>
          </div>

          <div className="relative rounded-2xl border border-[#313741] bg-[#0b0d10] p-5">
            <span className="absolute -left-2 top-8 hidden h-4 w-4 rotate-45 border-b border-l border-[#313741] bg-[#0b0d10] lg:block" />

            <div className="mb-3 flex items-center gap-2 text-amber-200">
              <MessageSquareText size={16} />

              <span className="text-sm font-medium">
                Agent update
              </span>
            </div>

            <motion.p
              key={visibleMessage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-base leading-7 text-slate-200"
            >
              {visibleMessage}
            </motion.p>

            {shouldRotate && (
              <div className="mt-6 flex items-center gap-3 text-slate-500">
                <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-amber-300" />
                <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-violet-300 [animation-delay:150ms]" />
                <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-teal-300 [animation-delay:300ms]" />

                <span className="ml-1 flex items-center gap-1 text-sm">
                  <Sparkles size={14} />
                  Working
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default AgentPanel;
