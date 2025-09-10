"use client";

import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useState } from "react";
import RightClickMenu from "@/components/RightClickMenu";
import PromptModal from "@/components/PromptModal";
import ChartCanvas from "@/components/ChartCanvas";
import { GraphData } from "../../api/types/graph";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";

// render the PDF reader on the client
const PdfReader = dynamic(() => import("@/components/PdfReader"), {
  ssr: false,
});

export default function ViewerPage() {
  const params = useParams();
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
    setGraph(null);
    try {
      setLoading(true);
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(promptPayload),
      });

      const rawOutput = await res.text();
      const data = JSON.parse(rawOutput);

      if (!res.ok) throw new Error(data?.error ?? `HTTP ${res.status}`);

      setGraph(data);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Error generating chart";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="relative min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900 text-white">
      <header className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center sticky top-0 z-20 backdrop-blur bg-zinc-900/50">
        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          PDF → Flowchart
        </h1>
      </header>

      <main className="grid grid-cols-1 xl:grid-cols-[0.9fr_1.1fr] gap-6 p-6">
        <div className="rounded-xl bg-zinc-800/60 backdrop-blur border border-zinc-700 p-4 overflow-y-auto">
          <PdfReader
            fileUrl={fileUrl}
            onTextSelected={setSelectedText}
            onContextMenu={handleContextMenu}
          />
        </div>

        <div className="hidden xl:block">
          <div className="sticky top-4 h-[78vh] p-5 rounded-xl bg-zinc-800/70 backdrop-blur border border-zinc-700 shadow-lg flex flex-col">
            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : error ? (
              <div className="p-4 bg-red-600 rounded text-white">{error}</div>
            ) : graph ? (
              <>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold">Generated Chart</h2>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => setFullscreen(true)}
                  >
                    Maximize
                  </Button>
                </div>
                <div className="flex-1 rounded-lg overflow-hidden border border-zinc-700">
                  <ChartCanvas graph={graph} />
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-zinc-400 space-y-3">
                <p className="text-sm">
                  Highlight text in the PDF,
                  <br /> Right click, and click
                  <span className="font-medium text-white"> “Chart”</span>
                </p>
                <p className="text-xs text-zinc-500">
                  Your generated flowchart will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Dialog open={fullscreen} onOpenChange={setFullscreen}>
        <DialogContent
          className="
      sm:max-w-[92vw] max-w-[92vw]
      w-[92vw] h-[88vh]
      bg-zinc-900/95 border border-zinc-700 rounded-xl
      p-4 flex flex-col
    "
        >
          <DialogHeader className="p-0 pb-3">
            <DialogTitle className="text-white text-lg">
              Maximized Chart View
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 min-h-0 w-full rounded-lg overflow-hidden border border-zinc-700">
            {graph && <ChartCanvas key="maximized" graph={graph} />}
          </div>
        </DialogContent>
      </Dialog>

      {menuVisible && (
        <RightClickMenu
          x={menuPos.x}
          y={menuPos.y}
          selectedText={selectedText}
          onChart={handleChart}
          onClose={() => setMenuVisible(false)}
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
