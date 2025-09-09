// Rendering for nodes + edges
"use client";

import { useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
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

  return
}

