// Routes for backend work (i.e. OpenAI calls) will be done here.

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const NodeSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
});
const EdgeSchema = z.object({
  source: z.string().min(1),
  target: z.string().min(1),
  label: z.string().optional(),
});
const GraphSchema = z.object({
  nodes: z.array(NodeSchema).min(1),
  edges: z.array(EdgeSchema),
});

export async function POST(req: NextRequest) {
  try {
    const { selectedText, prompt } = await req.json();

    if (typeof selectedText !== "string" || selectedText.length < 5) {
      return NextResponse.json(
        { error: "selectedText too short" },
        { status: 400 }
      );
    }

    const clipped = selectedText.slice(0, 4000);
    const userPrompt = (prompt ?? "").toString().slice(0, 1000);

    const system = `
You are a system that converts legal or instructional text into clean, helpful flowcharts.
Output ONLY valid JSON following this schema:
{
  "nodes": [{"id": "string", "label": "string", "type": "start|decision|process|end"}],
  "edges": [{"source": "string", "target": "string", "label": "string (optional)"}]
}

Rules:
- Node labels: short phrases (<= 8 words).
- Always include "start" and "end".
- Decisions branch with labeled edges ("yes", "no").
- Remove redundancy and minor details.
- Keep flow top-to-bottom, merging related steps.
- Do not output anything except valid JSON.
`;

    const content = `
Selected text:
"""${clipped}"""

Optional user prompt:
"""${userPrompt}"""

Produce a concise flowchart JSON.
`;
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Server error" },
      { status: 500 }
    );
  }
}
