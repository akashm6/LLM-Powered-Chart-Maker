// Dynamically routed page for any test PDF
"use client";

import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useState } from "react";
import RightClickMenu from "@/components/RightClickMenu";
import PromptModal from "@/components/PromptModal";

// render the PDF reader on the client
// avoids SSR pulling Node-only code and worker issues
const PdfReader = dynamic(() => import("@/components/PdfReader"), {
  ssr: false,
});

export default function ViewerPage() {
  const params = useParams();
  // dynamically grab PDF url
  const docId = params?.["pdf-id"] as string;
  const fileUrl = `/test-pdfs/${docId}.pdf`;

  const [selectedText, setSelectedText] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const [promptOpen, setPromptOpen] = useState(false);

  // custom context menu works on PDF viewers
  const handleContextMenu = (e: React.MouseEvent) => {
    if (!selectedText) return;
    e.preventDefault();
    setMenuPos({ x: e.clientX, y: e.clientY });
    setMenuVisible(true);
  };

  const handleChart = () => {
    setMenuVisible(false);
    setPromptOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-zinc-900 text-white p-4">
      <h1 className="text-xl font-semibold mb-4">PDF Viewer</h1>

      <PdfReader
        fileUrl={fileUrl}
        onTextSelected={setSelectedText}
        onContextMenu={handleContextMenu}
      />

      {menuVisible && (
        <RightClickMenu
          x={menuPos.x}
          y={menuPos.y}
          selectedText={selectedText}
          onChart={handleChart}
        />
      )}

      <PromptModal
        open={promptOpen}
        selectedText={selectedText}
        onSubmit={({ prompt }) => {
          console.log("Data sent to backend: ", { selectedText, prompt });
          setPromptOpen(false);
        }}
        onClose={() => setPromptOpen(false)}
      />
    </div>
  );
}
