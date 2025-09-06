// Custom right click menu after selecting some text
"use client";

import { useEffect, useState } from "react";

export default function RightClickMenu() {
  const [selected, setSelected] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleMouseRelease = () => {
        const currSelection = window.getSelection()?.toString().trim();
        if (currSelection) {
          setSelected(currSelection);
          console.log("Selected text:", currSelection);
        }
      };

      document.addEventListener("mouseup", handleMouseRelease);

      return () => {
        document.removeEventListener("mouseup", handleMouseRelease);
      };
    }
  }, []);

  return (
    <div className="bg-zinc-800 text-white p-4 rounded shadow-md">
      <p>Right click menu.</p>
      {selected && <p className="mt-2 text-sm">Selected: "{selected}"</p>}
    </div>
  );
}

