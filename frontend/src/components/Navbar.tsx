import { Bot, CheckCircle2 } from "lucide-react";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/20">
            <Bot
              size={28}
              className="text-white"
            />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              TechLead AI Platform
            </h1>

            <p className="text-sm text-zinc-400">
              Multi-Agent Software Planning
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2">
          <CheckCircle2
            size={16}
            className="text-emerald-400"
          />

          <span className="text-sm font-medium text-emerald-300">
            Backend Connected
          </span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;