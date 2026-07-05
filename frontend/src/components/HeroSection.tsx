import { motion } from "framer-motion";
import {
  Building2,
  GitBranch,
  ShieldCheck,
} from "lucide-react";

const highlights = [
  {
    label: "Approval gated",
    Icon: ShieldCheck,
  },
  {
    label: "Multi-agent workflow",
    Icon: GitBranch,
  },
  {
    label: "Enterprise planning",
    Icon: Building2,
  },
];

function HeroSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="py-8"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200/80">
            Hazel AI
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-white md:text-6xl">
            Multi-agent software planning for enterprise teams
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 md:text-lg">
            Turn a project description into approved requirements, system
            design, and sprint planning documents through a guided review
            workflow.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:w-[430px] lg:grid-cols-1">
          {highlights.map(({ label, Icon }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-xl border border-[#2a2f38] bg-[#111317]/80 px-4 py-3"
            >
              <Icon
                size={18}
                className="text-amber-200"
              />
              <span className="text-sm font-medium text-slate-200">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

export default HeroSection;
