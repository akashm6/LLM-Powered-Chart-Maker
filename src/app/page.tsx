"use client"
import Image from "next/image";
import { useState, useEffect } from "react";
import RightClickMenu from "@/components/RightClickMenu";

export default function Home() {

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

      const handleChart = () => {
        console.log("Chart selected.")
      }

      const handleContextMenu = (event: MouseEvent) => {
        const mouseX = event.clientX;
        const mouseY = event.clientY; 
        console.log(`Mouse X: ${mouseX}, Mouse Y: ${mouseY}`);
        return (
          <RightClickMenu x={mouseX} y={mouseY} selectedText={selected} onChart={handleChart} />
    )
      }

      document.addEventListener("contextmenu", handleContextMenu);

      return () => {
        document.removeEventListener("mouseup", handleMouseRelease);
        document.removeEventListener("contextmenu", handleContextMenu);
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
