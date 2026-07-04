import { motion } from "framer-motion";

function HeroSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-5xl rounded-3xl border border-gray-200 bg-white p-10 shadow-lg"
    >
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          Build Software with an AI Engineering Team
        </h1>

        <p className="mt-4 text-lg text-gray-600">
          Generate product requirements, system architecture,
          and sprint plans through a collaborative AI workflow.
        </p>
      </div>
    </motion.section>
  );
}

export default HeroSection;