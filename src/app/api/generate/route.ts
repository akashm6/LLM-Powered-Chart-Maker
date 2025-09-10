// Routes for backend work (i.e. OpenAI calls) will be done here.

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// schema definitions
const NodeSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  type: z.enum(["start", "decision", "process", "end"]),
  summary: z.string().optional(),
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

    const clipped = selectedText.slice(0, 6000);
    const userPrompt = (prompt ?? "").toString().slice(0, 1000);

    // prompt 1 prioritizes multi dimensional flowcharts
    const systemStructure = `
You are a system that converts legal or instructional text into *detailed, hierarchical flowcharts*.

Output ONLY valid JSON with this schema:
{
  "nodes": [
    { "id": "string", "label": "string", "type": "start|decision|process|end" }
  ],
  "edges": [
    { "source": "string", "target": "string", "label": "string (optional)" }
  ]
}

Rules:
- PRIORITY: produce a detailed, multidimensional flowchart (rich branching, hierarchy, descriptive edges).
- Node labels: concise (<= 12 words).
- Use decisions for conditions or exceptions.
- Use descriptive edge labels (e.g. "leads to", "requires").
- Always include Start and End.
- Err on the side of too much detail.
- Output ONLY valid JSON. No text outside the JSON.
`;

    const contentStructure = `
Selected text:
"""${clipped}"""

Optional user instruction:
"""${userPrompt}"""

Task:
- Break the text into nodes and edges with detailed hierarchy.
- Represent sections, subsections, and policies as a tree-like flow.
- Output a detailed flowchart JSON.
`;

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing API key." }, { status: 500 });
    }

    // generates graph structure
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemStructure },
          { role: "user", content: contentStructure },
        ],
        temperature: 0.2,
        response_format: { type: "json_object" },
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { error: data?.error ?? "Something went wrong." },
        { status: res.status }
      );
    }

    const rawOutput = data.choices?.[0]?.message?.content;
    if (!rawOutput) {
      return NextResponse.json(
        { error: "Generated chart is empty. Try selecting more text." },
        { status: 502 }
      );
    }

    // validate that we get valid JSON output
    const parsed = GraphSchema.safeParse(JSON.parse(rawOutput));
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Bad graph JSON.", issues: parsed.error.format() },
        { status: 422 }
      );
    }

    let graph = parsed.data;

    // prompt 2 prioritizes high-quality node summaries
    const systemSummary = `
You are a system that summarizes nodes in flowcharts.

Given the original source text and a node label, write 1–2 sentences
summarizing the meaning of this node in context.
Output ONLY the summary string.`;

    // parallelize the summary calls for 4x speedup
    const summaryPromises = graph.nodes.map(async (node) => {
      const summaryRes = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: systemSummary },
              {
                role: "user",
                content: `
Source text:
"""${clipped}"""

Node label: "${node.label}"

Task: Summarize this node in 1–2 sentences.
`,
              },
            ],
            temperature: 0.3,
          }),
        }
      );

      const summaryData = await summaryRes.json();
      node.summary =
        summaryData.choices?.[0]?.message?.content?.trim() ??
        "Summary unavailable.";
      return node;
    });

    // wait for all the summaries at once
    graph.nodes = await Promise.all(summaryPromises);

    // return final enriched graph
    return NextResponse.json(graph, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Server error." },
      { status: 500 }
    );
  }
}
