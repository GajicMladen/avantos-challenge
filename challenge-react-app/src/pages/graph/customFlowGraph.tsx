
import { addEdge, applyEdgeChanges, applyNodeChanges, Edge, ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useState } from 'react';

const initialNodes = [
    { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
    { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Node 2' } },
];
const initialEdges = [{ id: 'n1-n2', source: 'n1', target: 'n2' }];


//gonna be refactored later 
export type NodeToDraw = { id: string, position: { x: number, y: number }, data: { label: string } }
export type EdgeToDraw = { id: string, source: string, target: string }

export type FlowGraphProps = {
    nodes: NodeToDraw[];
    edges: EdgeToDraw[];
}

export const CustomFlowGraph = (props: FlowGraphProps) => {

    const [nodes, setNodes] = useState(props.nodes);
    const [edges, setEdges] = useState(props.edges);

    const onNodesChange = useCallback(
        (changes: any) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
        [],
    );
    const onEdgesChange = useCallback(
        (changes: any) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
        [],
    );
    const onConnect = useCallback(
        (params: any) => { },
        [],
    );

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
            />
        </div>
    );
}