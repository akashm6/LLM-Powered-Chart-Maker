"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import RightClickMenu, {
  RightClickMenuProps,
} from "@/components/RightClickMenu";

export default function Home() {
  const [selected, setSelected] = useState("");
  const [menuVisible, setMenuVisibility] = useState(false);
  const [menuProps, setMenuProps] = useState<RightClickMenuProps>({
    x: 0,
    y: 0,
    selectedText: "",
    onChart: () => {},
  });

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
        console.log("Chart selected.");
      };

      const handleContextMenu = (event: MouseEvent) => {
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        console.log(`Mouse X: ${mouseX}, Mouse Y: ${mouseY}`);
        setMenuVisibility(true);
        setMenuProps((prev) => ({
          ...prev,
          x: mouseX,
          y: mouseY,
          selectedText: selected,
        }));
      };

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
      {menuVisible && <RightClickMenu {...menuProps} />}
    </div>
  );
}
