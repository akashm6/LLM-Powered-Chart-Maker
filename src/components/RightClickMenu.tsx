// Custom right click menu after selecting some text
"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Copy, Edit3, GitBranch } from "lucide-react"; 
import { cn } from "@/lib/utils";

export interface RightClickMenuProps {
  x: number;
  y: number;
  selectedText: string;
  onChart: () => void;
}

const RightClickMenu = forwardRef<HTMLDivElement, RightClickMenuProps>(
  ({ x, y, selectedText, onChart }, ref) => {
    if (!selectedText) return null;

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        style={{ top: y, left: x, position: "fixed" }}
        className={cn(
          "z-50 w-56 rounded-xl border border-zinc-700 shadow-xl",
          "bg-zinc-900/80 backdrop-blur-lg overflow-hidden"
        )}
      >
        <div className="px-3 py-2 border-b border-zinc-700">
          <p className="text-xs text-zinc-400 line-clamp-2 italic">
            “{selectedText.slice(0, 60)}”
          </p>
        </div>

        <div className="flex flex-col">
          <button
            onClick={onChart}
            className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <GitBranch className="h-4 w-4 text-indigo-400" />
            Chart
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-800 transition-colors">
            <Copy className="h-4 w-4 text-green-400" />
            Copy
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-800 transition-colors">
            <Edit3 className="h-4 w-4 text-yellow-400" />
            Edit
          </button>
        </div>
      </motion.div>
    );
  }
);

RightClickMenu.displayName = "RightClickMenu";
export default RightClickMenu;
