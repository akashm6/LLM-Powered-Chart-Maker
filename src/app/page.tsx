"use client";
import { useState, useEffect, useRef } from "react";
import {
  RightClickMenuProps,
} from "@/components/RightClickMenu";
import { useRouter } from "next/navigation";
import {motion} from "framer-motion";

export default function Home() {
  const [selected, setSelected] = useState("");
  const [menuVisible, setMenuVisibility] = useState(false);
  const [menuProps, setMenuProps] = useState<RightClickMenuProps>({
    x: 0,
    y: 0,
    selectedText: "",
    onChart: () => {},
  });

  const [open, setOpen] = useState(false);

  const router = useRouter();

  const menuRef = useRef<HTMLDivElement>(null);
  const pdfs = [
    { id: 1, title: "Civil Case Sample" },
    { id: 2, title: "Contracts Sample" },
    { id: 3, title: "UMiami Syllabus Sample" },
  ];

  const handleClose = () => {
    setOpen(false);
  };

  // for tracking selection text
  useEffect(() => {
    const handleMouseRelease = () => {
      const currSelection = window.getSelection()?.toString().trim();
      if (currSelection) {
        setSelected(currSelection);
        console.log("Selected text:", currSelection);
      }
    };

    document.addEventListener("mouseup", handleMouseRelease);
    return () => document.removeEventListener("mouseup", handleMouseRelease);
  }, []);

  // custom right click menu
  useEffect(() => {
    const handleChart = () => {
      console.log("Chart selected.");
      setOpen(true);
    };

    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
      const mouseX = event.clientX;
      const mouseY = event.clientY;

      setMenuVisibility(true);
      setMenuProps((prev) => ({
        ...prev,
        x: mouseX,
        y: mouseY,
        selectedText: selected,
        onChart: handleChart,
      }));
    };

    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, [selected]);

  // closing right click menu when clicking outside of it
  useEffect(() => {
    if (!menuVisible) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuVisibility(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuVisible]);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-zinc-900 to-black text-white overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/40 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/40 rounded-full blur-3xl animate-pulse"></div>

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
          LawBandit Chart Maker
        </motion.h1>

        <p className="text-zinc-300 text-lg">
          Transform dense legal or instructional PDFs into{" "}
          <span className="text-indigo-400 font-semibold">
            clear, interactive, LLM-powered flowcharts.
          </span>{" "}
          Just highlight some text, and right click.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
          {pdfs.map((pdf, i) => (
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
      </motion.div>
    </div>
  );
}