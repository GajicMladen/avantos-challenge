import { Edge, Node } from "@xyflow/react";
import { EdgeItem, FormItem, NodeItem } from "../responses/blueprints-response";
import { DependencyData, DependencyForm } from "../../../model/graph";

/**
 * Maps DTO NodeItems into graph nodes usable by @xyflow/react.
 * Each graph node contains its metadata, form fields, and dependency data.
 */
export const mapDtoNodesToGraphNodes = (
    forms: FormItem[],
    nodes: NodeItem[]
): Node[] => {
    return nodes.map((node) => ({
        id: node.id,
        position: node.position,
        type: node.type,
        data: {
            label: node.data.name,
            formFields: getFormFields(forms, node),
            formId: node.data.component_id,
            dependencyData: getAllDependencyForms(node, nodes, forms),
        },
    }));
};

/**
 * Maps DTO edges into graph edges with unique IDs.
 * The index ensures uniqueness when multiple edges exist between the same nodes.
 */
export const mapDtoEdgesToGraphEdges = (edges: EdgeItem[]): Edge[] => {
    return edges.map((edge, index) => ({
        id: `${edge.source}-${edge.target}-${index}`,
        source: edge.source,
        target: edge.target,
    }));
};

/**
 * Returns all field names for a given node's form.
 */
const getFormFields = (forms: FormItem[], node: NodeItem) => {
    const form = forms.find((form) => form.id === node.data.component_id);
    return Object.keys(form?.field_schema.properties || {});
};

/**
 * Retrieves only the **direct dependencies** of a given node.
 * Each dependency includes node info and its form fields.
 */
const getDirectDependencies = (
    node: NodeItem,
    allNodes: NodeItem[],
    forms: FormItem[]
) => {
    const directDeps = node.data.prerequisites || [];

    return directDeps.map((depId) => {
        const depNode = allNodes.find((n) => n.id === depId);
        if (!depNode) return null;

        const form = forms.find((f) => f.id === depNode.data.component_id);
        return {
            nodeId: depId,
            nodeName: depNode.data.name,
            formId: depNode.data.component_id,
            formFields: Object.keys(form?.field_schema.properties || {}),
        };
    }).filter(Boolean) as DependencyForm[];
};

/**
 * Retrieves all **transitive dependencies** of a node (BFS traversal).
 * This means dependencies of dependencies (recursively).
 */
const getTransitiveDependencies = (
    node: NodeItem,
    allNodes: NodeItem[],
    forms: FormItem[]
) => {
    const visited = new Set<string>(); // prevents cycles & duplicates
    const queue: string[] = [...(node.data.prerequisites || [])];
    const transitiveDeps: DependencyForm[] = [];

    while (queue.length > 0) {
        const currentNodeId = queue.shift()!;
        if (visited.has(currentNodeId)) continue; // skip already processed

        visited.add(currentNodeId);

        const currentNode = allNodes.find((n) => n.id === currentNodeId);
        if (!currentNode) continue;

        // Add current dependency if valid
        const form = forms.find((f) => f.id === currentNode.data.component_id && !node.data.prerequisites.includes(currentNode.id));
        if (form) {
            transitiveDeps.push({
                nodeId: currentNode.id,
                nodeName: currentNode.data.name,
                formId: currentNode.data.component_id,
                formFields: Object.keys(form.field_schema.properties || {}),
            });
        }

        // Add its prerequisites to queue for BFS
        queue.push(...(currentNode.data.prerequisites || []));
    }

    return transitiveDeps;
};

/**
 * Retrieves **all dependency forms** (direct + transitive) for a given node.
 */
const getAllDependencyForms = (
    node: NodeItem,
    allNodes: NodeItem[],
    forms: FormItem[]
): DependencyData => ({
    directDependencies: getDirectDependencies(node, allNodes, forms),
    transitiveDependencies: getTransitiveDependencies(node, allNodes, forms),
});