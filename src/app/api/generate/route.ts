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

    if (typeof selectedText !== "string" || selectedText.length < 10) {
      return NextResponse.json(
        { error: "Selected text is too short." },
        { status: 400 }
      );
    }

    // truncate selected text + user prompt at some threshold
    const clipped = selectedText.slice(0, 6000);
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

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing API key." }, { status: 500 });
    }
    // Replace with the model you intend to use; JSON mode or response_format is great if available.
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: system },
          { role: "user", content },
        ],
        temperature: 0.2,
        response_format: { type: "json_object" },
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { error: data?.error ?? "Something went wrong. Please try again." },
        { status: res.status }
      );
    }

    const rawOutput = data.choices?.[0]?.message?.content;
    if (!rawOutput)
      return NextResponse.json({ error: "No content" }, { status: 502 });

    // ensure that LLM response produces valid schema JSON
    const parsed = GraphSchema.safeParse(JSON.parse(rawOutput));
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Bad graph JSON", issues: parsed.error.format() },
        { status: 422 }
      );
    }

    return NextResponse.json(parsed.data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Server error" },
      { status: 500 }
    );
  }
}
