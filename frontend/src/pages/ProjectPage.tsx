import { useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import DocumentCard from "../components/DocumentCard";
import { useProject } from "../hooks/useProject";

function ProjectPage() {
  const { projectId } = useParams();

  const { project, loading } = useProject(projectId);

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="mx-auto mt-12 max-w-6xl px-8">
          <h2 className="text-2xl font-semibold">
            Loading project...
          </h2>
        </main>
      </>
    );
  }

  if (!project) {
    return (
      <>
        <Navbar />

        <main className="mx-auto mt-12 max-w-6xl px-8">
          <h2 className="text-2xl font-semibold text-red-600">
            Project not found.
          </h2>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="mx-auto mt-12 max-w-6xl px-8 pb-12">
        <div className="mb-10">
          <h1 className="mb-3 text-4xl font-bold text-gray-900">
            {project.title}
          </h1>

          <p className="text-lg text-gray-600">
            {project.description}
          </p>
        </div>

        {project.documents.map((document) => (
          <DocumentCard
            key={`${document.type}-${document.version}`}
            document={document}
          />
        ))}
      </main>
    </>
  );
}

export default ProjectPage;