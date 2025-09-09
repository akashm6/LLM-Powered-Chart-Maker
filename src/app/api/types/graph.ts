// Defines custom types for chart creation
// Creates standardized format for LLM output

export type GraphNode = {
    id: string;
    label: string;
}

export type GraphEdge = {
    source: string;
    target: string;
    label?: string;
}

export type GraphData = {
    nodes: GraphNode[];
    edges: GraphEdge[];
}