import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

import Navbar from "../components/Navbar";
import { createProject } from "../api/projects";

function HomePage() {
  const navigate = useNavigate();

  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateProject = async () => {
    if (!description.trim()) {
      alert("Please enter a project description.");
      return;
    }

    try {
      setLoading(true);

      const project = await createProject(description);

      navigate(`/projects/${project.id}`);
    } catch (error) {
      console.error(error);
      alert("Failed to create project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="mx-auto mt-16 max-w-5xl px-8">
        <div className="mb-10 text-center">
          <div className="mb-4 flex justify-center">
            <Sparkles
              size={42}
              className="text-blue-600"
            />
          </div>

          <h1 className="mb-4 text-5xl font-bold text-gray-900">
            Build AI-Driven Software Projects
          </h1>

          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            Describe your project idea and let specialized AI
            agents collaboratively generate a Product
            Requirements Document, System Design, and Sprint
            Plan through a structured review workflow.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <label className="mb-3 block text-lg font-semibold">
            Project Description
          </label>

          <textarea
            rows={10}
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            placeholder="Describe your software project..."
            className="mb-6 w-full rounded-lg border border-gray-300 p-4 outline-none transition focus:border-blue-500"
          />

          <div className="flex justify-end">
            <button
              onClick={handleCreateProject}
              disabled={loading}
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {loading
                ? "Generating..."
                : "Generate Project"}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

export default HomePage;