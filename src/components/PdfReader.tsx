// PdfReader component that allows for clean text selection on a given PDF
"use client";

import { useRef } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const workerUrl =
  "https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js";

// onContextMenu -> custom function so we can use our right click menu on the PDF itself
interface PdfReaderProps {
  fileUrl: string;
  onTextSelected?: (text: string) => void;
  onContextMenu?: (e: React.MouseEvent) => void;
}

export default function PdfReader({
  fileUrl,
  onTextSelected,
  onContextMenu,
}: PdfReaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const layout = defaultLayoutPlugin();

  const handleMouseUp = () => {
    const text = window.getSelection()?.toString().trim();
    if (text && onTextSelected) onTextSelected(text);
  };
  // Pass in a valid Web Worker to render the PDF and display the correponding PDFP
  return (
    <div
      ref={containerRef}
      onMouseUp={handleMouseUp}
      onContextMenu={onContextMenu}
      style={{ userSelect: "text" }}
      className="bg-white text-black p-4 rounded max-w-3xl mx-auto"
    >
      <Worker workerUrl={workerUrl}>
        <Viewer fileUrl={fileUrl} plugins={[layout]} />
      </Worker>
    </div>
  );
}
