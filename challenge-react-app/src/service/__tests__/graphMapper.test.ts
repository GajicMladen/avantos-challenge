import { mapDtoNodesToGraphNodes, mapDtoEdgesToGraphEdges } from '../blueprints/mappers/graphMapper';
import { NodeItem, EdgeItem, FormItem } from '../blueprints/responses/blueprints-response';
import { Node, Edge } from '@xyflow/react';

describe('Graph Mapper', () => {
    const mockFormItem: FormItem = {
        id: 'form1',
        name: 'Test Form',
        description: 'Test Form Description',
        is_reusable: true,
        field_schema: {
            properties: {
                field1: { type: 'string' },
                field2: { type: 'number' },
                field3: { type: 'boolean' }
            }
        },
        ui_schema: {},
        dynamic_field_config: {}
    };

    const mockNodeItem: NodeItem = {
        id: 'node1',
        type: 'form',
        position: { x: 100, y: 200 },
        data: {
            id: 'node1',
            component_key: 'form_component',
            component_type: 'form',
            component_id: 'form1',
            name: 'Test Node',
            prerequisites: ['node2'],
            permitted_roles: ['admin'],
            input_mapping: {},
            sla_duration: { number: 24, unit: 'hours' },
            approval_required: false,
            approval_roles: []
        }
    };

    const mockEdgeItem: EdgeItem = {
        source: 'node1',
        target: 'node2'
    };

    describe('mapDtoNodesToGraphNodes', () => {
        it('should map NodeItems to graph nodes correctly', () => {
            const forms = [mockFormItem];
            const nodes = [mockNodeItem];

            const result = mapDtoNodesToGraphNodes(forms, nodes);

            expect(result).toHaveLength(1);
            expect(result[0].id).toBe('node1');
            expect(result[0].position).toEqual({ x: 100, y: 200 });
            expect(result[0].type).toBe('form');
            expect(result[0].data.label).toBe('Test Node');
            expect(result[0].data.formId).toBe('form1');
            expect(result[0].data.formFields).toEqual(['field1', 'field2', 'field3']);
        });

        it('should handle empty forms array', () => {
            const forms: FormItem[] = [];
            const nodes = [mockNodeItem];

            const result = mapDtoNodesToGraphNodes(forms, nodes);

            expect(result).toHaveLength(1);
            expect(result[0].data.formFields).toEqual([]);
        });

        it('should handle empty nodes array', () => {
            const forms = [mockFormItem];
            const nodes: NodeItem[] = [];

            const result = mapDtoNodesToGraphNodes(forms, nodes);

            expect(result).toHaveLength(0);
        });

        it('should handle multiple nodes', () => {
            const forms = [mockFormItem];
            const node2: NodeItem = {
                ...mockNodeItem,
                id: 'node2',
                data: {
                    ...mockNodeItem.data,
                    id: 'node2',
                    component_id: 'form1',
                    name: 'Test Node 2'
                }
            };
            const nodes = [mockNodeItem, node2];

            const result = mapDtoNodesToGraphNodes(forms, nodes);

            expect(result).toHaveLength(2);
            expect(result[0].id).toBe('node1');
            expect(result[1].id).toBe('node2');
            expect(result[0].data.label).toBe('Test Node');
            expect(result[1].data.label).toBe('Test Node 2');
        });

        it('should handle node with no matching form', () => {
            const forms: FormItem[] = [];
            const nodes = [mockNodeItem];

            const result = mapDtoNodesToGraphNodes(forms, nodes);

            expect(result).toHaveLength(1);
            expect(result[0].data.formFields).toEqual([]);
        });

        it('should include dependency data in mapped nodes', () => {
            const forms = [mockFormItem];
            const nodes = [mockNodeItem];

            const result = mapDtoNodesToGraphNodes(forms, nodes);

            expect(result[0].data.dependencyData).toBeDefined();
            expect(result[0].data.dependencyData.directDependencies).toBeDefined();
            expect(result[0].data.dependencyData.transitiveDependencies).toBeDefined();
        });
    });

    describe('mapDtoEdgesToGraphEdges', () => {
        it('should map EdgeItems to graph edges correctly', () => {
            const edges = [mockEdgeItem];

            const result = mapDtoEdgesToGraphEdges(edges);

            expect(result).toHaveLength(1);
            expect(result[0].id).toBe('node1-node2-0');
            expect(result[0].source).toBe('node1');
            expect(result[0].target).toBe('node2');
        });

        it('should handle empty edges array', () => {
            const edges: EdgeItem[] = [];

            const result = mapDtoEdgesToGraphEdges(edges);

            expect(result).toHaveLength(0);
        });

        it('should handle multiple edges', () => {
            const edge2: EdgeItem = {
                source: 'node2',
                target: 'node3'
            };
            const edges = [mockEdgeItem, edge2];

            const result = mapDtoEdgesToGraphEdges(edges);

            expect(result).toHaveLength(2);
            expect(result[0].id).toBe('node1-node2-0');
            expect(result[1].id).toBe('node2-node3-1');
        });

        it('should handle duplicate edges with different indices', () => {
            const edge2: EdgeItem = {
                source: 'node1',
                target: 'node2'
            };
            const edges = [mockEdgeItem, edge2];

            const result = mapDtoEdgesToGraphEdges(edges);

            expect(result).toHaveLength(2);
            expect(result[0].id).toBe('node1-node2-0');
            expect(result[1].id).toBe('node1-node2-1');
            expect(result[0].source).toBe('node1');
            expect(result[0].target).toBe('node2');
            expect(result[1].source).toBe('node1');
            expect(result[1].target).toBe('node2');
        });

        it('should generate unique IDs for edges', () => {
            const edge2: EdgeItem = {
                source: 'node2',
                target: 'node3'
            };
            const edge3: EdgeItem = {
                source: 'node3',
                target: 'node4'
            };
            const edges = [mockEdgeItem, edge2, edge3];

            const result = mapDtoEdgesToGraphEdges(edges);

            const ids = result.map(edge => edge.id);
            const uniqueIds = new Set(ids);
            expect(uniqueIds.size).toBe(3);
        });
    });

    describe('Integration Tests', () => {
        it('should work together with complete data', () => {
            const forms = [mockFormItem];
            const nodes = [mockNodeItem];
            const edges = [mockEdgeItem];

            const mappedNodes = mapDtoNodesToGraphNodes(forms, nodes);
            const mappedEdges = mapDtoEdgesToGraphEdges(edges);

            expect(mappedNodes).toHaveLength(1);
            expect(mappedEdges).toHaveLength(1);
            expect(mappedNodes[0].id).toBe('node1');
            expect(mappedEdges[0].source).toBe('node1');
            expect(mappedEdges[0].target).toBe('node2');
        });

        it('should handle complex dependency scenarios', () => {
            const form1: FormItem = {
                ...mockFormItem,
                id: 'form1',
                field_schema: {
                    properties: {
                        field1: { type: 'string' }
                    }
                }
            };

            const form2: FormItem = {
                ...mockFormItem,
                id: 'form2',
                field_schema: {
                    properties: {
                        field2: { type: 'number' }
                    }
                }
            };

            const node1: NodeItem = {
                ...mockNodeItem,
                id: 'node1',
                data: {
                    ...mockNodeItem.data,
                    component_id: 'form1',
                    prerequisites: ['node2']
                }
            };

            const node2: NodeItem = {
                ...mockNodeItem,
                id: 'node2',
                data: {
                    ...mockNodeItem.data,
                    component_id: 'form2',
                    prerequisites: []
                }
            };

            const forms = [form1, form2];
            const nodes = [node1, node2];

            const result = mapDtoNodesToGraphNodes(forms, nodes);

            expect(result).toHaveLength(2);
            expect(result[0].data.formFields).toEqual(['field1']);
            expect(result[1].data.formFields).toEqual(['field2']);
        });
    });

    describe('Edge Cases', () => {
        it('should handle nodes with no prerequisites', () => {
            const nodeWithoutPrereqs: NodeItem = {
                ...mockNodeItem,
                data: {
                    ...mockNodeItem.data,
                    prerequisites: []
                }
            };

            const forms = [mockFormItem];
            const nodes = [nodeWithoutPrereqs];

            const result = mapDtoNodesToGraphNodes(forms, nodes);

            expect(result).toHaveLength(1);
            expect(result[0].data.dependencyData.directDependencies).toEqual([]);
        });

        it('should handle forms with empty field schemas', () => {
            const formWithEmptySchema: FormItem = {
                ...mockFormItem,
                field_schema: {
                    properties: {}
                }
            };

            const forms = [formWithEmptySchema];
            const nodes = [mockNodeItem];

            const result = mapDtoNodesToGraphNodes(forms, nodes);

            expect(result).toHaveLength(1);
            expect(result[0].data.formFields).toEqual([]);
        });
    });
});

