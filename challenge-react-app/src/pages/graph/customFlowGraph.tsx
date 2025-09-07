
import { Edge, Node, NodeMouseHandler, ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useState } from 'react';
import PrefillFormModal from '../prefillForm/prefillFormModal';
import { FieldMapping } from '../../model/graph';
import { useAppSelector } from '../../sotore/store.hooks';

export type FlowGraphProps = {
    nodes: Node[];
    edges: Edge[];
}

export const CustomFlowGraph = (props: FlowGraphProps) => {

    const nodes = useAppSelector((state) => state.graph.nodes);
    const edges = useAppSelector((state) => state.graph.edges);

    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const onNodeClick: NodeMouseHandler = useCallback((_, node) => {
        setSelectedNode(node);
        setIsDialogOpen(true);
    }, []);

    const getNodeFormState = useCallback(
        (nodeId: string): Record<string, FieldMapping> => {
            const node = nodes.find((n) => n.id === nodeId);
            return (node?.data.fieldMappings as Record<string, FieldMapping>) || {};
        },
        [nodes]
    );

    return (
        <>
            <span>{nodes.length}</span>
            <div style={{ width: '100vw', height: '100vh' }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={() => { }}
                    onEdgesChange={() => { }}
                    onConnect={() => { }}
                    onNodeClick={onNodeClick}
                    fitView
                />
                {(selectedNode && isDialogOpen) && (
                    <PrefillFormModal
                        onClose={() => setIsDialogOpen(false)}
                        nodeId={selectedNode.id}
                    />
                )}
            </div>
        </>
    );
}