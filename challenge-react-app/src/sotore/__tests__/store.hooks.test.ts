import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../store.hooks';
import { store, RootState } from '../store';
import { GraphSlice } from '../graph-slice';
import { Node, Edge } from '@xyflow/react';
import React from 'react';

// Mock the API slice to avoid RTK Query issues in tests
jest.mock('../avantos-api-slice', () => ({
    avantosApiSlice: {
        reducerPath: 'avantosApiSlice',
        reducer: jest.fn((state = {}, action: any) => state),
        middleware: jest.fn(() => (next: any) => (action: any) => next(action))
    }
}));

// Mock store for testing
const createMockStore = (initialState: Partial<RootState> = {}) => {
    const defaultState: RootState = {
        avantosApiSlice: {} as any,
        graph: {
            nodes: [],
            edges: []
        },
        ...initialState
    };

    return {
        ...store,
        getState: () => defaultState,
        dispatch: jest.fn(),
        subscribe: jest.fn(),
        replaceReducer: jest.fn()
    };
};

// Test wrapper component using React.createElement to avoid JSX parsing issues
const TestWrapper: React.FC<{ children: React.ReactNode; store?: any }> = ({ 
    children, 
    store: testStore = createMockStore() 
}) => {
    return React.createElement(Provider, { store: testStore, children });
};

describe('Store Hooks', () => {
    describe('useAppDispatch', () => {
        it('should return dispatch function with correct type', () => {
            const mockStore = createMockStore();
            const { result } = renderHook(() => useAppDispatch(), {
                wrapper: ({ children }) => React.createElement(TestWrapper, { store: mockStore, children })
            });

            expect(result.current).toBeDefined();
            expect(typeof result.current).toBe('function');
        });

        it('should dispatch actions correctly', () => {
            const mockStore = createMockStore();
            const { result } = renderHook(() => useAppDispatch(), {
                wrapper: ({ children }) => React.createElement(TestWrapper, { store: mockStore, children })
            });

            const dispatch = result.current;
            const action = GraphSlice.actions.setGraph({
                nodes: [{ id: '1', type: 'default', position: { x: 0, y: 0 }, data: { label: 'Test' } }],
                edges: []
            });

            dispatch(action);

            expect(mockStore.dispatch).toHaveBeenCalledWith(action);
        });

        it('should maintain dispatch reference across renders', () => {
            const mockStore = createMockStore();
            const { result, rerender } = renderHook(() => useAppDispatch(), {
                wrapper: ({ children }) => React.createElement(TestWrapper, { store: mockStore, children })
            });

            const firstDispatch = result.current;
            rerender();
            const secondDispatch = result.current;

            expect(firstDispatch).toBe(secondDispatch);
        });
    });

    describe('useAppSelector', () => {
        it('should select state correctly', () => {
            const mockState: RootState = {
                avantosApiSlice: {} as any,
                graph: {
                    nodes: [{ id: '1', type: 'default', position: { x: 0, y: 0 }, data: { label: 'Test' } }],
                    edges: []
                }
            };

            const mockStore = createMockStore(mockState);
            
            const { result } = renderHook(() => useAppSelector(state => state.graph), {
                wrapper: ({ children }) => React.createElement(TestWrapper, { store: mockStore, children })
            });

            expect(result.current).toEqual(mockState.graph);
        });

        it('should select specific properties from state', () => {
            const mockState: RootState = {
                avantosApiSlice: {} as any,
                graph: {
                    nodes: [
                        { id: '1', type: 'default', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
                        { id: '2', type: 'default', position: { x: 100, y: 100 }, data: { label: 'Node 2' } }
                    ],
                    edges: [{ id: 'e1-2', source: '1', target: '2' }]
                }
            };

            const mockStore = createMockStore(mockState);
            
            const { result } = renderHook(() => useAppSelector(state => state.graph.nodes), {
                wrapper: ({ children }) => React.createElement(TestWrapper, { store: mockStore, children })
            });

            expect(result.current).toEqual(mockState.graph.nodes);
            expect(result.current).toHaveLength(2);
        });

        it('should handle selector functions with parameters', () => {
            const mockState: RootState = {
                avantosApiSlice: {} as any,
                graph: {
                    nodes: [
                        { id: '1', type: 'default', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
                        { id: '2', type: 'default', position: { x: 100, y: 100 }, data: { label: 'Node 2' } }
                    ],
                    edges: []
                }
            };

            const mockStore = createMockStore(mockState);
            
            const { result } = renderHook(() => useAppSelector(state => 
                state.graph.nodes.find(node => node.id === '1')
            ), {
                wrapper: ({ children }) => React.createElement(TestWrapper, { store: mockStore, children })
            });

            expect(result.current).toEqual(mockState.graph.nodes[0]);
        });

        it('should return undefined for non-existent selections', () => {
            const mockStore = createMockStore();
            
            const { result } = renderHook(() => useAppSelector(state => 
                state.graph.nodes.find(node => node.id === 'nonexistent')
            ), {
                wrapper: ({ children }) => React.createElement(TestWrapper, { store: mockStore, children })
            });

            expect(result.current).toBeUndefined();
        });

        it('should handle complex selector logic', () => {
            const mockState: RootState = {
                avantosApiSlice: {} as any,
                graph: {
                    nodes: [
                        { 
                            id: '1', 
                            type: 'default', 
                            position: { x: 0, y: 0 }, 
                            data: { 
                                label: 'Node 1',
                                fieldMappings: {
                                    'field1': { label: 'Field 1', value: 'field1.value' }
                                }
                            } 
                        }
                    ],
                    edges: []
                }
            };

            const mockStore = createMockStore(mockState);
            
            const { result } = renderHook(() => useAppSelector(state => {
                const node = state.graph.nodes.find(n => n.id === '1');
                return node?.data.fieldMappings || {};
            }), {
                wrapper: ({ children }) => React.createElement(TestWrapper, { store: mockStore, children })
            });

            expect(result.current).toEqual({
                'field1': { label: 'Field 1', value: 'field1.value' }
            });
        });

        it('should maintain selector reference when state changes', () => {
            const mockStore = createMockStore();
            
            const { result, rerender } = renderHook(() => useAppSelector(state => state.graph), {
                wrapper: ({ children }) => React.createElement(TestWrapper, { store: mockStore, children })
            });

            const firstResult = result.current;
            rerender();
            const secondResult = result.current;

            // The selector should return the same reference if the state hasn't changed
            expect(firstResult).toBe(secondResult);
        });
    });

    describe('Hook Integration', () => {
        it('should work together in a component scenario', () => {
            const mockStore = createMockStore();
            
            const { result } = renderHook(() => {
                const dispatch = useAppDispatch();
                const graphState = useAppSelector(state => state.graph);
                
                return { dispatch, graphState };
            }, {
                wrapper: ({ children }) => React.createElement(TestWrapper, { store: mockStore, children })
            });

            expect(result.current.dispatch).toBeDefined();
            expect(result.current.graphState).toBeDefined();
            expect(typeof result.current.dispatch).toBe('function');
            expect(result.current.graphState).toEqual({
                nodes: [],
                edges: []
            });
        });

        it('should handle multiple selectors in same hook', () => {
            const mockState: RootState = {
                avantosApiSlice: {} as any,
                graph: {
                    nodes: [{ id: '1', type: 'default', position: { x: 0, y: 0 }, data: { label: 'Test' } }],
                    edges: [{ id: 'e1', source: '1', target: '2' }]
                }
            };

            const mockStore = createMockStore(mockState);
            
            const { result } = renderHook(() => {
                const nodes = useAppSelector(state => state.graph.nodes);
                const edges = useAppSelector(state => state.graph.edges);
                const nodeCount = useAppSelector(state => state.graph.nodes.length);
                const edgeCount = useAppSelector(state => state.graph.edges.length);
                
                return { nodes, edges, nodeCount, edgeCount };
            }, {
                wrapper: ({ children }) => React.createElement(TestWrapper, { store: mockStore, children })
            });

            expect(result.current.nodes).toEqual(mockState.graph.nodes);
            expect(result.current.edges).toEqual(mockState.graph.edges);
            expect(result.current.nodeCount).toBe(1);
            expect(result.current.edgeCount).toBe(1);
        });
    });

    describe('Type Safety', () => {
        it('should provide correct TypeScript types', () => {
            // These are compile-time tests - if the types are wrong, TypeScript will error
            const mockStore = createMockStore();
            
            const { result: dispatchResult } = renderHook(() => useAppDispatch(), {
                wrapper: ({ children }) => React.createElement(TestWrapper, { store: mockStore, children })
            });

            const { result: selectorResult } = renderHook(() => useAppSelector(state => state.graph), {
                wrapper: ({ children }) => React.createElement(TestWrapper, { store: mockStore, children })
            });

            // These should compile without errors
            expect(dispatchResult.current).toBeDefined();
            expect(selectorResult.current).toBeDefined();
        });
    });
});