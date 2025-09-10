"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Github } from "lucide-react";

export default function Home() {
  const router = useRouter();

  const pdfs = [
    { id: 1, title: "Civil Case Sample" },
    { id: 2, title: "Contracts Sample" },
    { id: 3, title: "UMiami Syllabus Sample" },
  ];

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-indigo-900 via-zinc-900 to-black text-white overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/40 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/40 rounded-full blur-3xl animate-pulse"></div>

      <main className="flex-1 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10 max-w-3xl text-center space-y-8"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
          >
            LawBandit LLM Chart Maker
          </motion.h1>

          <p className="text-zinc-300 text-lg">
            Transform dense legal or instructional PDFs into{" "}
            <span className="text-indigo-400 font-semibold">
              clear, interactive, LLM-powered flowcharts.
            </span>{" "}
            Just highlight some text, and right click.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
            {pdfs.map((pdf) => (
              <motion.div
                key={pdf.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="group relative cursor-pointer"
                onClick={() => router.push(`/pdf-viewer/${pdf.id}`)}
              >
                <div className="h-36 rounded-xl bg-zinc-800/60 backdrop-blur border border-zinc-700 flex items-center justify-center text-lg font-medium transition-colors group-hover:border-indigo-400 group-hover:bg-zinc-800">
                  {pdf.title}
                </div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-30 blur-xl transition"></div>
              </motion.div>
            ))}
          </div>

          <motion.a
            href="https://github.com/akashm6/LLM-Powered-Chart-Maker"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium shadow-md hover:shadow-lg transition-all mt-8"
          >
            <Github className="text-xl" />
            View on GitHub
          </motion.a>
        </motion.div>
      </main>

      <footer className="relative z-10 py-6 border-t border-zinc-800 bg-zinc-900/60 backdrop-blur text-center text-sm text-zinc-400">
        <p>
          Built by{" "}
          <a
            href="https://akashmohan.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-purple-400 transition"
          >
            Akash Mohan{" "}
          </a>
          for the LawBandit 2025 Software Engineer Internship·{" "}
        </p>
      </footer>
    </div>
  );
}
