// Dynamically routed page for any test PDF
"use client";

import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useState } from "react";
import RightClickMenu from "@/components/RightClickMenu";
import PromptModal from "@/components/PromptModal";
import ChartCanvas from "@/components/ChartCanvas";
import { GraphData } from "../../api/types/graph";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";

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
  const [graph, setGraph] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);

  const handleSubmitPrompt = async ({ prompt }: { prompt: string }) => {
    const promptPayload = { selectedText, prompt };
    // reset chart on new chart creation
    setGraph(null);
    try {
      setLoading(true);
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(promptPayload),
      });

      const rawOutput = await res.text();

      // check for invalid JSON output
      const data = JSON.parse(rawOutput);

      if (!res.ok) {
        throw new Error(data?.error ?? `HTTP ${res.status}`);
      }

      setLoading(false);
      setGraph(data);
    } catch (e: any) {
      console.error(
        "There was an error submitting your prompt. Try again: ",
        e?.message || e
      );
    }
  };

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
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_520px] gap-4">
        <div>
          <PdfReader
            fileUrl={fileUrl}
            onTextSelected={setSelectedText}
            onContextMenu={handleContextMenu}
          />
        </div>
        <div className="xl:block hidden">
          <div className="sticky top-4 h-[80vh]">
            {loading ? (
              <div className="p-4 bg-zinc-800 rounded">Generating chart...</div>
            ) : error ? (
              <div className="p-4 bg-red-600 rounded text-white">{error}</div>
            ) : graph ? (
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-medium">Chart</h2>
                <Button size="sm" onClick={() => setFullscreen(true)}>
                  Maximize
                </Button>
                <ChartCanvas graph={graph} />
              </div>
            ) : (
              <div className="p-4 bg-zinc-800 rounded text-zinc-300">
                Select text, Right-click, and generate AI-powered charts.
              </div>
            )}
          </div>
        </div>
      </div>

      <Button onClick={() => setFullscreen(true)}>Maximize</Button>
      <Dialog open={fullscreen} onOpenChange={setFullscreen}>
        <DialogHeader>
            <DialogTitle>Maximized View</DialogTitle>
          </DialogHeader>
        <DialogContent className="w-screen h-screen">
          {graph && <ChartCanvas graph={graph} />}
        </DialogContent>
      </Dialog>

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
        onSubmit={handleSubmitPrompt}
        onClose={() => setPromptOpen(false)}
      />
    </div>
  );
}
