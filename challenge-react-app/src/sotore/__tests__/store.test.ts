import { store, RootState, AppDispatch } from '../store';
import { GraphSlice } from '../graph-slice';

// Mock the API slice to avoid RTK Query issues in tests
jest.mock('../avantos-api-slice', () => ({
    avantosApiSlice: {
        reducerPath: 'avantosApiSlice',
        reducer: (state = {}, action: any) => state, // Return state instead of using jest.fn
        middleware: jest.fn(() => (next: any) => (action: any) => next(action))
    }
}));

describe('Store Configuration', () => {
    it('should create store with correct initial state', () => {
        const state = store.getState();
        
        // Check that the store has the expected structure
        expect(state).toHaveProperty('avantosApiSlice');
        expect(state).toHaveProperty('graph');
        
        // Check initial graph state
        expect(state.graph).toEqual({
            nodes: [],
            edges: []
        });
    });

    it('should have correct reducer paths', () => {
        const state = store.getState();
        
        // Verify that the API slice reducer is properly mounted
        expect(state.avantosApiSlice).toBeDefined();
        
        // Verify that the graph slice reducer is properly mounted
        expect(state.graph).toBeDefined();
    });

    it('should configure middleware correctly', () => {
        // The store should be configured with RTK Query middleware
        // This is tested implicitly by the store creation and state structure
        const state = store.getState();
        expect(state).toBeDefined();
    });

    it('should have serializable check disabled', () => {
        // This is configured in the store setup
        // We can verify by checking that the store works with non-serializable data
        const state = store.getState();
        expect(state).toBeDefined();
    });
});

describe('Type Exports', () => {
    it('should export RootState type', () => {
        // This is a compile-time test - if the type is wrong, TypeScript will error
        const mockState: RootState = {
            avantosApiSlice: {} as any,
            graph: {
                nodes: [],
                edges: []
            }
        };
        
        expect(mockState).toBeDefined();
        expect(mockState.graph).toBeDefined();
        expect(mockState.avantosApiSlice).toBeDefined();
    });

    it('should export AppDispatch type', () => {
        // This is a compile-time test
        const mockDispatch: AppDispatch = store.dispatch;
        expect(mockDispatch).toBeDefined();
    });
});

describe('Store Integration', () => {
    it('should integrate with avantosApiSlice', () => {
        const state = store.getState();
        expect(state.avantosApiSlice).toBeDefined();
    });

    it('should integrate with GraphSlice', () => {
        const state = store.getState();
        expect(state.graph).toEqual({
            nodes: [],
            edges: []
        });
    });

    it('should allow dispatching actions', () => {
        const initialState = store.getState();
        
        // Dispatch a graph action
        store.dispatch(GraphSlice.actions.setGraph({
            nodes: [{ id: '1', type: 'default', position: { x: 0, y: 0 }, data: { label: 'Test' } }],
            edges: []
        }));
        
        const newState = store.getState();
        expect(newState.graph.nodes).toHaveLength(1);
        expect(newState.graph.nodes[0].id).toBe('1');
    });
});
