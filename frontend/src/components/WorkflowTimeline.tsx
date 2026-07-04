import { CheckCircle, Circle } from "lucide-react";

interface WorkflowTimelineProps {
  stage: "PRD" | "SYSTEM_DESIGN" | "SPRINT_PLAN";
}

function WorkflowTimeline({
  stage,
}: WorkflowTimelineProps) {
  const stages = [
    "PRD",
    "SYSTEM_DESIGN",
    "SPRINT_PLAN",
  ];

  return (
    <section className="mx-auto mt-10 max-w-4xl rounded-3xl border border-gray-200 bg-white p-8 shadow-lg">
      <div className="flex items-center justify-between">
        {stages.map((item, index) => {
          const active =
            stages.indexOf(stage) >= index;

          return (
            <div
              key={item}
              className="flex flex-1 items-center"
            >
              <div className="flex flex-col items-center">
                {active ? (
                  <CheckCircle
                    className="text-green-500"
                    size={28}
                  />
                ) : (
                  <Circle
                    className="text-gray-400"
                    size={28}
                  />
                )}

                <span className="mt-2 text-sm font-medium">
                  {item.replace("_", " ")}
                </span>
              </div>

              {index !== stages.length - 1 && (
                <div className="mx-4 h-1 flex-1 rounded-full bg-gray-200" />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default WorkflowTimeline;