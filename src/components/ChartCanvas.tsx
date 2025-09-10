// Rendering for nodes + edges
"use client";

import { useMemo } from "react";
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
    data: { label: n.label, summary: n.summary }, 
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

// specify charts as top-bottom for now
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

  const onNodeClick = (_: any, node: Node) => {
  alert(node.data.summary); 
};
  return (
    <div className="w-full h-full border border-zinc-700 rounded-lg overflow-hidden bg-white">
      <ReactFlow
        key={graph.nodes.map((n) => n.id).join("-")}
        nodes={chartNodes}
        edges={chartEdges}
        fitView
        onNodeClick={onNodeClick}
      >
        <Background />
        <MiniMap pannable zoomable/>
        <Controls showFitView showZoom/>
      </ReactFlow>
    </div>
  );
}
