// Dynamically routed page for any test PDF
"use client";

import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useState } from "react";
import RightClickMenu from "@/components/RightClickMenu";
import PromptModal from "@/components/PromptModal";
import ChartCanvas from "@/components/ChartCanvas";
import { GraphData } from "../../api/types/graph";

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
  const [graph, setGraph] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmitPrompt = async ({ prompt }: { prompt: string }) => {
    const promptPayload = { selectedText, prompt }
    try {
      setLoading(true);
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(promptPayload),
      });

      const raw = await res.text(); 

      // check for invalid JSON output
      const data = JSON.parse(raw);
      if (!res.ok) {
        throw new Error(data?.error ?? `HTTP ${res.status}`);
      }

      setLoading(false);
      setGraph(data);
    } catch (err: any) {
      console.error("Error submitting prompt. Try again.", err?.message || err);
    }
  };

  return (
    <div>ChartCanvas</div>
  )
}