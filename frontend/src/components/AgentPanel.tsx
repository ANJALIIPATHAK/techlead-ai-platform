import { useEffect, useMemo, useState } from "react";

import { motion } from "framer-motion";
import {
  Bot,
  CheckCircle2,
  Circle,
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
    "I am identifying goals, users and business requirements.",
    "I am drafting the Product Requirements Document.",
  ],

  REVIEW_PRD: [
    "The Product Requirements Document is complete. I am waiting for your review.",
  ],

  GENERATING_SYSTEM_DESIGN: [
    "Hi, I am your System Architect. I have received the approved PRD.",
    "I am designing the overall system architecture.",
    "I am defining APIs, database schema and deployment strategy.",
  ],

  REVIEW_SYSTEM_DESIGN: [
    "The System Design is complete. I am waiting for your review.",
  ],

  GENERATING_SPRINT_PLAN: [
    "Hi, I am your Program Manager.",
    "I am breaking the architecture into implementation milestones.",
    "I am creating the sprint plan for the engineering team.",
  ],

  REVIEW_SPRINT_PLAN: [
    "The Sprint Plan is complete. I am waiting for your review.",
  ],

  COMPLETED: [
    "Congratulations. The software planning workflow has completed successfully.",
  ],
};

const stageTasks: Record<
  WorkflowStage,
  string[]
> = {
  IDLE: [
    "Understand Project",
    "Generate PRD",
    "Generate System Design",
    "Generate Sprint Plan",
  ],

  GENERATING_PRD: [
    "Analyze Requirements",
    "Identify Users",
    "Draft Functional Requirements",
    "Define Success Metrics",
  ],

  REVIEW_PRD: [
    "Product Requirements Ready",
    "Waiting for Review",
    "Incorporate Feedback",
    "Handoff to Architect",
  ],

  GENERATING_SYSTEM_DESIGN: [
    "Analyze PRD",
    "Design Components",
    "Define APIs",
    "Deployment Planning",
  ],

  REVIEW_SYSTEM_DESIGN: [
    "Architecture Ready",
    "Waiting for Review",
    "Revise Design",
    "Handoff to Program Manager",
  ],

  GENERATING_SPRINT_PLAN: [
    "Break Into Features",
    "Sprint Planning",
    "Prioritize Tasks",
    "Delivery Timeline",
  ],

  REVIEW_SPRINT_PLAN: [
    "Sprint Plan Ready",
    "Waiting for Review",
    "Final Validation",
    "Complete Workflow",
  ],

  COMPLETED: [
    "Requirements Approved",
    "Architecture Approved",
    "Sprint Plan Approved",
    "Workflow Completed",
  ],
};

const agentTone: Record<
  string,
  {
    avatar: string;
    badge: string;
    accent: string;
    glow: string;
    label: string;
  }
> = {
  "Product Manager": {
    avatar:
      "from-cyan-300 via-sky-400 to-blue-500",
    badge:
      "border-cyan-400/30 bg-cyan-400/10 text-cyan-200",
    accent: "text-cyan-300",
    glow: "shadow-cyan-500/20",
    label: "Product Strategy",
  },

  "System Architect": {
    avatar:
      "from-violet-300 via-indigo-400 to-sky-400",
    badge:
      "border-violet-400/30 bg-violet-400/10 text-violet-200",
    accent: "text-violet-300",
    glow: "shadow-violet-500/20",
    label: "Architecture",
  },

  "Program Manager": {
    avatar:
      "from-emerald-300 via-teal-400 to-cyan-400",
    badge:
      "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
    accent: "text-emerald-300",
    glow: "shadow-emerald-500/20",
    label: "Delivery Planning",
  },

  "TechLead AI": {
    avatar:
      "from-cyan-300 via-violet-300 to-fuchsia-300",
    badge:
      "border-cyan-400/30 bg-cyan-400/10 text-cyan-200",
    accent: "text-cyan-300",
    glow: "shadow-cyan-500/20",
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

  const tasks = useMemo(
    () => stageTasks[stage] ?? [],
    [stage],
  );

  const tone =
    agentTone[agent] ??
    agentTone["TechLead AI"];

  const shouldRotate =
    loading ||
    stage.startsWith("GENERATING");

  // Existing logic (UNCHANGED)

  useEffect(() => {
    setMessageIndex(0);
  }, [stage]);

  useEffect(() => {
    if (
      !shouldRotate ||
      messages.length <= 1
    ) {
      return;
    }

    const interval =
      window.setInterval(() => {
        setMessageIndex(
          (current) =>
            (current + 1) %
            messages.length,
        );
      }, 2200);

    return () =>
      window.clearInterval(interval);
  }, [messages.length, shouldRotate]);

  const visibleMessage =
    messages[messageIndex] ?? message;

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.35,
      }}
      className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#111317] via-[#101319] to-[#0b0d11] shadow-2xl shadow-black/30"
    >
      <div className="relative overflow-hidden p-8">

        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/5 blur-3xl" />

        <div className="flex flex-col gap-8 lg:flex-row">

          {/* Left Side */}

          <div className="flex flex-col items-center lg:w-64">

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
              className={`relative flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br ${tone.avatar} shadow-2xl ${tone.glow}`}
            >
              <span className="absolute inset-0 rounded-3xl border border-white/20" />

              <Bot
                size={52}
                className="relative text-slate-950"
              />
            </motion.div>

            <div className="mt-6 text-center">

              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-300">

                <span className="h-2 w-2 rounded-full bg-emerald-400" />

                LIVE

              </div>

              <h2 className="mt-4 text-2xl font-bold text-white">
                {agent}
              </h2>

              <div
                className={`mt-3 inline-flex rounded-full border px-4 py-2 text-xs font-semibold ${tone.badge}`}
              >
                {tone.label}
              </div>

            </div>

          </div>

          {/* Right Side */}

          <div className="flex-1">

            <div className="rounded-2xl border border-white/10 bg-[#0b0d10]/80 p-6">

              <div className="flex items-center gap-2">

                <MessageSquareText
                  size={18}
                  className={tone.accent}
                />

                <span
                  className={`text-sm font-semibold ${tone.accent}`}
                >
                  Current Update
                </span>

              </div>

              <motion.p
                key={visibleMessage}
                initial={{
                  opacity: 0,
                  y: 6,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="mt-5 text-lg leading-8 text-slate-200"
              >
                {visibleMessage}
              </motion.p>

              <div className="my-8 h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent" />

              <div>

                <div className="mb-5 flex items-center gap-2">

                  <Sparkles
                    size={17}
                    className={tone.accent}
                  />

                  <span
                    className={`text-sm font-semibold ${tone.accent}`}
                  >
                    Current Tasks
                  </span>

                </div>

                <div className="space-y-4"></div>

                  {tasks.map(
                    (
                      task,
                      index,
                    ) => {

                      const completed =
                        stage ===
                          "COMPLETED" ||
                        index <
                          messageIndex;

                      const active =
                        shouldRotate &&
                        index ===
                          messageIndex;

                      return (

                        <div
                          key={task}
                          className="flex items-center gap-4"
                        >

                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                              completed
                                ? "bg-emerald-400/15 text-emerald-300"
                                : active
                                  ? "bg-cyan-400/15 text-cyan-300"
                                  : "bg-white/5 text-slate-500"
                            }`}
                          >

                            {completed ? (
                              <CheckCircle2
                                size={18}
                              />
                            ) : active ? (
                              <Circle
                                size={15}
                                className="fill-current"
                              />
                            ) : (
                              <Circle
                                size={15}
                              />
                            )}

                          </div>

                          <span
                            className={`text-sm transition-colors ${
                              completed
                                ? "text-emerald-100"
                                : active
                                  ? "text-white"
                                  : "text-slate-400"
                            }`}
                          >
                            {task}
                          </span>

                        </div>

                      );

                    },
                  )}

              </div>

              {shouldRotate && (

                <>
                  <div className="my-8 h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent" />

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                      <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-cyan-300" />

                      <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-violet-300 [animation-delay:150ms]" />

                      <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-emerald-300 [animation-delay:300ms]" />

                      <span className="ml-2 text-sm text-slate-400">
                        Thinking...
                      </span>

                    </div>

                    <div
                      className={`text-xs font-medium ${tone.accent}`}
                    >
                      AI Working
                    </div>

                  </div>

                </>

              )}

            </div>

          </div>

        </div>

      </div>

    </motion.section>

  );

}

export default AgentPanel;