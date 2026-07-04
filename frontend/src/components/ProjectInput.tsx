import { motion } from "framer-motion";

interface ProjectInputProps {
  description: string;
  loading: boolean;
  onChange: (value: string) => void;
  onGenerate: () => void;
}

function ProjectInput({
  description,
  loading,
  onChange,
  onGenerate,
}: ProjectInputProps) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.15 }}
      className="mx-auto mt-10 max-w-4xl rounded-3xl border border-gray-200 bg-white p-8 shadow-lg"
    >
      <h2 className="mb-5 text-xl font-semibold text-gray-900">
        Describe your software project
      </h2>

      <textarea
        value={description}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Describe your project requirements..."
        className="h-52 w-full resize-none rounded-2xl border border-gray-300 p-5 text-base outline-none transition focus:border-blue-500"
      />

      <div className="mt-6 flex justify-center">
        <button
          onClick={onGenerate}
          disabled={loading}
          className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {loading ? "Generating..." : "Generate Project"}
        </button>
      </div>
    </motion.section>
  );
}

export default ProjectInput;