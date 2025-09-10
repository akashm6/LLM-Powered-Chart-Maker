"use client";

import { useMemo, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Position,
  MarkerType,
} from "reactflow";
import dagre from "@dagrejs/dagre";
import "reactflow/dist/style.css";
import { GraphData } from "../app/api/types/graph";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const nodeWidth = 220;
const nodeHeight = 70;

function layoutWithDagre(graph: GraphData, direction: "TB" | "LR" = "TB") {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: direction, nodesep: 40, ranksep: 60 });
  g.setDefaultEdgeLabel(() => ({}));

  graph.nodes.forEach((n) =>
    g.setNode(n.id, { width: nodeWidth, height: nodeHeight })
  );
  graph.edges.forEach((e) => g.setEdge(e.source, e.target));

  dagre.layout(g);

  const chartNodes: Node[] = graph.nodes.map((n) => {
    const { x, y } = g.node(n.id);
    return {
      id: n.id,
      position: { x, y },
      data: { label: n.label, summary: (n as any).summary }, 
      sourcePosition: direction === "LR" ? Position.Right : Position.Bottom,
      targetPosition: direction === "LR" ? Position.Left : Position.Top,
      type: "default",
      style: {
        borderRadius: 12,
        padding: 8,
        border: "1px solid #D4D4D8",
        background: "#fff",
        width: nodeWidth,
        height: nodeHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        cursor: "pointer",
      },
    };
  });

  const chartEdges: Edge[] = graph.edges.map((e, i) => ({
    id: `${e.source}-${e.target}-${i}`,
    source: e.source,
    target: e.target,
    label: e.label,
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { strokeWidth: 1.5 },
    labelBgPadding: [4, 2],
    labelBgBorderRadius: 6,
  }));

  return { chartNodes, chartEdges };
}

export default function ChartCanvas({
  graph,
  direction = "TB",
}: {
  graph: GraphData;
  direction?: "TB" | "LR";
}) {
  const { chartNodes, chartEdges } = useMemo(
    () => layoutWithDagre(graph, direction),
    [graph, direction]
  );

  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  return (
    <div className="w-full h-full border border-zinc-700 rounded-lg overflow-hidden bg-white">
      <ReactFlow
        key={graph.nodes.map((n) => n.id).join("-")}
        nodes={chartNodes}
        edges={chartEdges}
        fitView
        onNodeClick={(_, node) => setSelectedNode(node)}
      >
        <Background />
        <MiniMap pannable zoomable />
        <Controls showFitView showZoom />
      </ReactFlow>

      <Dialog open={!!selectedNode} onOpenChange={() => setSelectedNode(null)}>
        <DialogContent className="sm:max-w-md bg-zinc-900 text-white border border-zinc-700">
          <DialogHeader>
            <DialogTitle>{selectedNode?.data?.label}</DialogTitle>
            <DialogDescription className="text-zinc-400">
              {selectedNode?.data?.summary ??
                "No summary available for this node."}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
