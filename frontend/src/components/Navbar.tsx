import { Bot } from "lucide-react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
        <Link
          to="/"
          className="flex items-center gap-3"
        >
          <Bot
            size={34}
            className="text-blue-600"
          />

          <div>
            <h1 className="text-xl font-bold text-gray-900">
              TechLead AI Platform
            </h1>

            <p className="text-sm text-gray-500">
              Multi-Agent Software Planning
            </p>
          </div>
        </Link>

        <div className="rounded-full bg-green-100 px-4 py-2">
          <span className="font-medium text-green-700">
            Backend Connected
          </span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;