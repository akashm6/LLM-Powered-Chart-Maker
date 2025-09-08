"use client";
import { useState, useEffect, useRef } from "react";
import RightClickMenu, {
  RightClickMenuProps,
} from "@/components/RightClickMenu";
import PromptModal from "@/components/PromptModal";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

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
    <div className="bg-zinc-800 text-white p-4 rounded shadow-md min-h-screen">
      <p>Right click menu.</p>
      <Button onClick={() => router.push("/pdf-viewer/1")}>Test PDF 1</Button>
      <Button onClick={() => router.push("/pdf-viewer/2")}>Test PDF 2</Button>
      <Button onClick={() => router.push("/pdf-viewer/3")}>Test PDF 3</Button>
      {selected && <p className="mt-2 text-sm">Selected: "{selected}"</p>}
      {menuVisible && <RightClickMenu ref={menuRef} {...menuProps} />}
      {open && (
        <PromptModal
          open={true}
          selectedText={selected}
          onSubmit={() => {}}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
