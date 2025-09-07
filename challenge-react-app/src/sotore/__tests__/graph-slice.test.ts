import { GraphSlice, GraphState } from '../graph-slice';
import { Node, Edge } from '@xyflow/react';

describe('Graph Slice', () => {
    const mockNode: Node = {
        id: '1',
        type: 'default',
        position: { x: 100, y: 100 },
        data: { 
            label: 'Test Node',
            fieldMappings: {}
        }
    };

    const mockEdge: Edge = {
        id: 'e1-2',
        source: '1',
        target: '2'
    };

    const initialState: GraphState = {
        nodes: [],
        edges: []
    };

    describe('Initial State', () => {
        it('should have correct initial state', () => {
            expect(GraphSlice.getInitialState()).toEqual({
                nodes: [],
                edges: []
            });
        });
    });

    describe('setGraph Action', () => {
        it('should replace current state with payload', () => {
            const newState = GraphSlice.reducer(initialState, GraphSlice.actions.setGraph({
                nodes: [mockNode],
                edges: [mockEdge]
            }));

            expect(newState.nodes).toEqual([mockNode]);
            expect(newState.edges).toEqual([mockEdge]);
        });

        it('should merge partial state updates', () => {
            const stateWithNodes = {
                nodes: [mockNode],
                edges: []
            };

            const newState = GraphSlice.reducer(stateWithNodes, GraphSlice.actions.setGraph({
                edges: [mockEdge]
            }));

            expect(newState.nodes).toEqual([mockNode]);
            expect(newState.edges).toEqual([mockEdge]);
        });

        it('should handle empty payload', () => {
            const newState = GraphSlice.reducer(initialState, GraphSlice.actions.setGraph({}));
            expect(newState).toEqual(initialState);
        });

        it('should handle nodes only update', () => {
            const newState = GraphSlice.reducer(initialState, GraphSlice.actions.setGraph({
                nodes: [mockNode]
            }));

            expect(newState.nodes).toEqual([mockNode]);
            expect(newState.edges).toEqual([]);
        });

        it('should handle edges only update', () => {
            const newState = GraphSlice.reducer(initialState, GraphSlice.actions.setGraph({
                edges: [mockEdge]
            }));

            expect(newState.nodes).toEqual([]);
            expect(newState.edges).toEqual([mockEdge]);
        });
    });

    describe('updateFormFieldMapping Action', () => {
        const nodeWithMappings: Node = {
            id: '1',
            type: 'default',
            position: { x: 100, y: 100 },
            data: { 
                label: 'Test Node',
                fieldMappings: {
                    'existingField': { label: 'Existing', value: 'existing.value' }
                }
            }
        };

        const stateWithNode: GraphState = {
            nodes: [nodeWithMappings],
            edges: []
        };

        it('should add new field mapping to existing node', () => {
            const newState = GraphSlice.reducer(stateWithNode, GraphSlice.actions.updateFormFieldMapping({
                nodeId: '1',
                fieldName: 'newField',
                mapping: { label: 'New Field', value: 'new.value' }
            }));

            const updatedNode = newState.nodes.find(n => n.id === '1');
            expect(updatedNode?.data.fieldMappings).toEqual({
                'existingField': { label: 'Existing', value: 'existing.value' },
                'newField': { label: 'New Field', value: 'new.value' }
            });
        });

        it('should update existing field mapping', () => {
            const newState = GraphSlice.reducer(stateWithNode, GraphSlice.actions.updateFormFieldMapping({
                nodeId: '1',
                fieldName: 'existingField',
                mapping: { label: 'Updated Field', value: 'updated.value' }
            }));

            const updatedNode = newState.nodes.find(n => n.id === '1');
            expect(updatedNode?.data.fieldMappings).toEqual({
                'existingField': { label: 'Updated Field', value: 'updated.value' }
            });
        });

        it('should create fieldMappings object if it does not exist', () => {
            const nodeWithoutMappings: Node = {
                id: '2',
                type: 'default',
                position: { x: 200, y: 200 },
                data: { label: 'Node Without Mappings' }
            };

            const stateWithNodeWithoutMappings: GraphState = {
                nodes: [nodeWithoutMappings],
                edges: []
            };

            const newState = GraphSlice.reducer(stateWithNodeWithoutMappings, GraphSlice.actions.updateFormFieldMapping({
                nodeId: '2',
                fieldName: 'firstField',
                mapping: { label: 'First Field', value: 'first.value' }
            }));

            const updatedNode = newState.nodes.find(n => n.id === '2');
            expect(updatedNode?.data.fieldMappings).toEqual({
                'firstField': { label: 'First Field', value: 'first.value' }
            });
        });

        it('should not modify state if node is not found', () => {
            const newState = GraphSlice.reducer(stateWithNode, GraphSlice.actions.updateFormFieldMapping({
                nodeId: 'nonexistent',
                fieldName: 'field',
                mapping: { label: 'Field', value: 'value' }
            }));

            expect(newState).toEqual(stateWithNode);
        });

        it('should handle complex mapping objects', () => {
            const complexMapping = {
                label: 'Complex Field',
                value: 'complex.value',
                source: 'Complex Source',
                metadata: { type: 'text', required: true }
            };

            const newState = GraphSlice.reducer(stateWithNode, GraphSlice.actions.updateFormFieldMapping({
                nodeId: '1',
                fieldName: 'complexField',
                mapping: complexMapping
            }));

            const updatedNode = newState.nodes.find(n => n.id === '1');
            expect(updatedNode?.data.fieldMappings?.complexField).toEqual(complexMapping);
        });
    });

    describe('deleteFromFileMapping Action', () => {
        const nodeWithMappings: Node = {
            id: '1',
            type: 'default',
            position: { x: 100, y: 100 },
            data: { 
                label: 'Test Node',
                fieldMappings: {
                    'field1': { label: 'Field 1', value: 'field1.value' },
                    'field2': { label: 'Field 2', value: 'field2.value' },
                    'field3': { label: 'Field 3', value: 'field3.value' }
                }
            }
        };

        const stateWithNode: GraphState = {
            nodes: [nodeWithMappings],
            edges: []
        };

        it('should delete specified field mapping', () => {
            const newState = GraphSlice.reducer(stateWithNode, GraphSlice.actions.deleteFromFileMapping({
                nodeId: '1',
                fieldName: 'field2'
            }));

            const updatedNode = newState.nodes.find(n => n.id === '1');
            expect(updatedNode?.data.fieldMappings).toEqual({
                'field1': { label: 'Field 1', value: 'field1.value' },
                'field3': { label: 'Field 3', value: 'field3.value' }
            });
        });

        it('should not modify state if node is not found', () => {
            const newState = GraphSlice.reducer(stateWithNode, GraphSlice.actions.deleteFromFileMapping({
                nodeId: 'nonexistent',
                fieldName: 'field1'
            }));

            expect(newState).toEqual(stateWithNode);
        });

        it('should not modify state if fieldMappings does not exist', () => {
            const nodeWithoutMappings: Node = {
                id: '2',
                type: 'default',
                position: { x: 200, y: 200 },
                data: { label: 'Node Without Mappings' }
            };

            const stateWithNodeWithoutMappings: GraphState = {
                nodes: [nodeWithoutMappings],
                edges: []
            };

            const newState = GraphSlice.reducer(stateWithNodeWithoutMappings, GraphSlice.actions.deleteFromFileMapping({
                nodeId: '2',
                fieldName: 'field1'
            }));

            expect(newState).toEqual(stateWithNodeWithoutMappings);
        });

        it('should handle deleting non-existent field', () => {
            const newState = GraphSlice.reducer(stateWithNode, GraphSlice.actions.deleteFromFileMapping({
                nodeId: '1',
                fieldName: 'nonexistentField'
            }));

            const updatedNode = newState.nodes.find(n => n.id === '1');
            expect(updatedNode?.data.fieldMappings).toEqual({
                'field1': { label: 'Field 1', value: 'field1.value' },
                'field2': { label: 'Field 2', value: 'field2.value' },
                'field3': { label: 'Field 3', value: 'field3.value' }
            });
        });

        it('should handle deleting the last field mapping', () => {
            const nodeWithSingleMapping: Node = {
                id: '3',
                type: 'default',
                position: { x: 300, y: 300 },
                data: { 
                    label: 'Node With Single Mapping',
                    fieldMappings: {
                        'onlyField': { label: 'Only Field', value: 'only.value' }
                    }
                }
            };

            const stateWithSingleMapping: GraphState = {
                nodes: [nodeWithSingleMapping],
                edges: []
            };

            const newState = GraphSlice.reducer(stateWithSingleMapping, GraphSlice.actions.deleteFromFileMapping({
                nodeId: '3',
                fieldName: 'onlyField'
            }));

            const updatedNode = newState.nodes.find(n => n.id === '3');
            expect(updatedNode?.data.fieldMappings).toEqual({});
        });
    });

    describe('Action Creators', () => {
        it('should export setGraph action creator', () => {
            expect(GraphSlice.actions.setGraph).toBeDefined();
            expect(typeof GraphSlice.actions.setGraph).toBe('function');
        });

        it('should export updateFormFieldMapping action creator', () => {
            expect(GraphSlice.actions.updateFormFieldMapping).toBeDefined();
            expect(typeof GraphSlice.actions.updateFormFieldMapping).toBe('function');
        });

        it('should export deleteFromFileMapping action creator', () => {
            expect(GraphSlice.actions.deleteFromFileMapping).toBeDefined();
            expect(typeof GraphSlice.actions.deleteFromFileMapping).toBe('function');
        });
    });

    describe('Reducer Export', () => {
        it('should export reducer as default', () => {
            expect(GraphSlice.reducer).toBeDefined();
            expect(typeof GraphSlice.reducer).toBe('function');
        });
    });

    describe('Complex Scenarios', () => {
        it('should handle multiple operations in sequence', () => {
            let state = initialState;

            // Add nodes and edges
            state = GraphSlice.reducer(state, GraphSlice.actions.setGraph({
                nodes: [mockNode],
                edges: [mockEdge]
            }));

            // Update field mapping
            state = GraphSlice.reducer(state, GraphSlice.actions.updateFormFieldMapping({
                nodeId: '1',
                fieldName: 'field1',
                mapping: { label: 'Field 1', value: 'field1.value' }
            }));

            // Add another field mapping
            state = GraphSlice.reducer(state, GraphSlice.actions.updateFormFieldMapping({
                nodeId: '1',
                fieldName: 'field2',
                mapping: { label: 'Field 2', value: 'field2.value' }
            }));

            // Delete one field mapping
            state = GraphSlice.reducer(state, GraphSlice.actions.deleteFromFileMapping({
                nodeId: '1',
                fieldName: 'field1'
            }));

            const finalNode = state.nodes.find(n => n.id === '1');
            expect(state.nodes).toHaveLength(1);
            expect(state.edges).toHaveLength(1);
            expect(finalNode?.data.fieldMappings).toEqual({
                'field2': { label: 'Field 2', value: 'field2.value' }
            });
        });
    });
});

