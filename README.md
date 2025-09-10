# 📊 LawBandit LLM Chart Maker

An LLM-powered tool that transforms dense legal or instructional text into structured, interactive flowcharts.
Built with **TypeScript + Node.js**, featuring a fullstack architecture using **Next.js**, **React Flow**, **OpenAI**, and **Dagre** for AI-powered visual logic parsing.

This repository is my submission for the **Fall 2025 LawBandit Software Engineer Internship Challenge**.

## ▶️ Demo & Links

- **Live App**: [Deployed Link](https://llm-powered-chart-maker.vercel.app/)
- **Demo Video**: [Demo](https://youtu.be/sThzCRLzXSs?si=yucYPCn7Uc3BkkgX)

## ✨ Key Features

- **Highlight-to-Chart Interface**  
  Instantly convert selected legal or instructional PDF text into a visual flowchart using a custom right-click menu.

- **LLM-Driven Logical Decomposition**  
  Uses GPT-4o to extract multi-branch logic (rules, exceptions, conditions, outcomes) with structured JSON output.

- **Auto-Laid Graphs with Rich Semantics**  
  Nodes and edges are dynamically generated and laid out using Dagre + React Flow, preserving conditional structure and flow direction.

- **Context-Aware Node Summaries**  
  Each node is enriched with 2–3 sentence summaries generated in parallel via OpenAI, enhancing clarity without clutter.

- **Robust Type Safety & Validation**  
  All LLM responses are parsed and validated with Zod schemas to enforce structure and prevent malformed graphs.

- **Modern, Responsive UI**  
  Clean interface styled with Tailwind CSS, Framer Motion animations, and shadcn/ui components to optimize for accessibility and responsiveness.

## 🛠️ Tech Stack

- **Framework**: Next.js (App Router), TypeScript, Node.js
- **LLM**: OpenAI (`gpt-4o-mini`), strict JSON output
- **Graph**: React Flow (rendering), Dagre (layout)
- **PDF Reader**: `@react-pdf-viewer/*` (client-only)
- **UI**: Tailwind CSS, Framer Motion, shadcn/ui
- **Validation**: Zod schemas for graph JSON

## 🧩 How It Works

### 1. Capture Context

- User highlights text inside the PDF viewer (`@react-pdf-viewer/core`)
- Custom `RightClickMenu` appears at cursor position
- “Chart” opens `PromptModal` for optional additional user customization prompts

### 2. Generate Flowchart via LLM

**Endpoint:**

```http
POST /api/generate
```

**Request Body:**

```json
{
  "selectedText": "string (clipped to ~6000 chars)", // User highlighted text
  "prompt": "optional user hint (clipped to ~1000 chars)"
}
```

**Structure Pass** (Prompt 1)

- This prompt creates the architecture of a flowchart by creating an **adjacency list** representing a DAG.
- The system prompt encourages hierarchical, conditional, and multi-branch logic to create multi-dimensional flowcharts.
- The LLM returns strict JSON with JSON schemas validated using **Zod**.

**Example**: "If a student misses a deadline, they must request an extension unless they have a documented excuse."

```json
{
  "nodes": [
    { "id": "start", "label": "Start", "type": "start" },
    { "id": "missedDeadline", "label": "Missed Deadline?", "type": "decision" },
    {
      "id": "hasExcuse",
      "label": "Has Documented Excuse?",
      "type": "decision"
    },
    {
      "id": "requestExtension",
      "label": "Request Extension",
      "type": "process"
    },
    { "id": "end", "label": "End", "type": "end" }
  ],
  "edges": [
    { "source": "start", "target": "missedDeadline", "label": "" },
    { "source": "missedDeadline", "target": "hasExcuse", "label": "Yes" },
    { "source": "missedDeadline", "target": "end", "label": "No" },
    { "source": "hasExcuse", "target": "end", "label": "Yes" },
    { "source": "hasExcuse", "target": "requestExtension", "label": "No" },
    { "source": "requestExtension", "target": "end", "label": "" }
  ]
}
```

**Node Summaries** (Prompt 2)

Once structure is generated, a second LLM prompt adds richer explanations to each node.

2-3 sentence contextual summaries are generated in parallel for all nodes using `Promise.all`.

**Example output:**

```json
{
  "nodes": [
    {
      "id": "missedDeadline",
      "label": "Missed Deadline?",
      "type": "decision",
      "summary": "Determines whether the student failed to submit the required material by the stated deadline."
    },
    {
      "id": "hasExcuse",
      "label": "Documented Excuse?",
      "type": "decision",
      "summary": "Checks if the student has valid documentation (e.g., medical, legal) that justifies the missed deadline."
    },
    {
      "id": "requestExtension",
      "label": "Request Extension",
      "type": "process",
      "summary": "Instructs the student to formally request additional time, following the department's extension policy."
    }
  ]
}
```

Final output is a full custom `GraphData` object with enriched summaries.

### 3. Layout & Rendering

- **Dagre** computes graph layout (default rankdir: TB -> top-bottom)
- **React Flow** renders with zoom/pan, mini-map, fitView, and more.
- Clicking a node opens a **NodeInfoDialog** showing the label + summary.

## 🏗️ Project Structure

```bash
.
├── README.md
├── components.json
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public
│   ├── favicons
│   ├── test-pdfs
│   │   ├── 1.pdf
│   │   ├── 2.pdf
│   │   └── 3.pdf
├── src
│   ├── app
│   │   ├── api
│   │   │   ├── generate
│   │   │   │   └── route.ts
│   │   │   └── types
│   │   │       └── graph.ts
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── pdf-viewer
│   │       └── [pdf-id]
│   │           └── page.tsx
│   ├── components
│   │   ├── ChartCanvas.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── PdfReader.tsx
│   │   ├── PromptModal.tsx
│   │   ├── RightClickMenu.tsx
│   │   └── ui
│   │       ├── button.tsx
│   │       ├── dialog.tsx
│   │       └── textarea.tsx
│   └── lib
│       └── utils.ts
└── tsconfig.json
```

## 🚀 Local Setup

### 1. Clone & Install

```bash
git clone https://github.com/akashm6/LLM-Powered-Chart-Maker.git
cd lawbandit-chartmaker
npm install
```

### 2. Environment Variables

Create a `.env` file in the project root:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Start Dev Server

```bash
npm run dev
```

#### PDF Worker Version Match (important)

This app uses `@react-pdf-viewer/*` pinned to `pdfjs-dist@3.11.174`.

In `PdfReader.tsx`, we set:

```ts
const workerUrl =
  "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";
```

Ensure the `pdfjs-dist` version in `package.json` matches the worker URL version.

## ⚡ Performance Notes

The structure + summaries flow may take time for long text selections.

### Optimizations Implemented

- **Input clipping**: text and prompt are clipped to practical limits.
- **Parallel batching**: node summary requests are grouped via `Promise.all`.
- **Progressive render**: initial structure renders first; summaries enrich as they arrive.

Typical end-to-end time for sample selections: **~15–25 seconds**, depending on:

- LLM load
- Input length
- Number of nodes

## ⏳ Timeline & Milestones

- ✅ Scaffold complete – Sep 4, 2025
- ✅ Right-click menu & PromptModal – Sep 7, 2025
- ✅ PDF viewer + context menu – Sep 8, 2025
- ✅ Backend API integration – Sep 9, 2025
- ✅ UI flowchart rendering – Sep 9, 2025
- ✅ Deployed to Vercel – Sep 10, 2025
