// Custom right click menu after selecting some text
"use client";

import { forwardRef } from "react";

export interface RightClickMenuProps {
  x: number;
  y: number;
  selectedText: string;
  onChart: () => void;
}

const RightClickMenu = forwardRef<HTMLDivElement, RightClickMenuProps>(
  ({ x, y, selectedText, onChart }, ref) => {
    return (
      <div
        ref={ref}
        className="absolute z-50 bg-zinc-800 text-white rounded shadow-md border border-zinc-600 w-48"
        style={{ top: y, left: x }}
      >
        <p className="px-3 py-2 border-b border-zinc-700 text-xs text-zinc-400">
          Selected: "{selectedText.slice(0, 30)}"
        </p>
        <button
          className="w-full text-left px-4 py-2 hover:bg-zinc-700"
          onClick={onChart}
        >
          Chart
        </button>
        <button className="w-full text-left px-4 py-2 hover:bg-zinc-700">
          Copy
        </button>
        <button className="w-full text-left px-4 py-2 hover:bg-zinc-700">
          Edit
        </button>
      </div>
    );
  }
);
export default RightClickMenu;
