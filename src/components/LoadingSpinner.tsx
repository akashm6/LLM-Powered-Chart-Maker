import { motion } from "framer-motion";

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.div
        className="w-12 h-12 border-4 border-indigo-400/40 border-t-indigo-400 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
      <p className="text-zinc-400 text-sm tracking-wide">
        Generating your flowchart…
      </p>
    </div>
  );
}
