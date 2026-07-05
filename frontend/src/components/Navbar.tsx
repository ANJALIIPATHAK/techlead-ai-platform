import { Bot, CheckCircle2 } from "lucide-react";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#242933] bg-[#090b0e]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-6 px-5 md:px-8">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-300 via-violet-300 to-teal-300 shadow-lg shadow-black/30">
            <Bot
              size={25}
              className="text-slate-950"
            />
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold tracking-tight text-white md:text-xl">
              TechLead AI Platform
            </h1>

            <p className="truncate text-sm text-slate-400">
              Multi-Agent Software Planning
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-2 sm:flex">
          <CheckCircle2
            size={16}
            className="text-teal-300"
          />

          <span className="text-sm font-medium text-teal-200">
            Backend Connected
          </span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
