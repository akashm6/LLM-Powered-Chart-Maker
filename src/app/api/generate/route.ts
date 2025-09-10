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

    if (typeof selectedText !== "string" || selectedText.length < 50) {
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

Strict Rules:
- PRIORITY: Flowcharts must be *multidimensional*, with tree-like branching and hierarchy.
- NEVER produce a single straight line of nodes. At least 2 branches and sub-sections are required if any hierarchy exists.
- Group related ideas under parent nodes (e.g. "Evaluation" → "Midterm Exam" → "Weight 15%").
- Use decision nodes for conditions, policies, or exceptions, with edges labeled "yes"/"no" where relevant.
- All edges should have descriptive labels (e.g. "leads to", "requires", "includes"), except trivial sequential links.
- Node labels: clear and concise (<= 12 words).
- Always include Start and End nodes.
- Err on the side of *too much detail*, never too little.
- Output ONLY valid JSON. No text outside the JSON.
- Do not skip relationships — every section, requirement, or exception must be connected by edges.
`;

const contentStructure = `
Selected text:
"""${clipped}"""

Optional user instruction:
"""${userPrompt}"""

Task:
- Break the text into nodes and edges with a branching, tree-like hierarchy.
- Explicitly represent sections, subsections, requirements, exceptions, and relationships.
- Ensure at least 2+ branches are visible where structure allows.
- Output a detailed flowchart JSON ready for rendering.
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

    const graph = parsed.data;

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
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Server error.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
