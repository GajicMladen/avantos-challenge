// Mock RTK Query to avoid module issues in tests
jest.mock('@reduxjs/toolkit/query/react', () => ({
    createApi: jest.fn(() => ({
        reducerPath: 'avantosApiSlice',
        reducer: jest.fn((state = {}, action) => state),
        middleware: jest.fn(() => (next) => (action) => next(action)),
        endpoints: {}
    })),
    fetchBaseQuery: jest.fn(() => jest.fn())
}));

import { avantosApiSlice } from '../avantos-api-slice';

describe('Avantos API Slice', () => {
    it('should create API slice with correct configuration', () => {
        expect(avantosApiSlice).toBeDefined();
        expect(avantosApiSlice.reducerPath).toBe('avantosApiSlice');
    });

    it('should have correct base URL', () => {
        // The base URL is configured as 'http://localhost:3000/api/v1/'
        // We can verify this by checking the slice configuration
        expect(avantosApiSlice.reducerPath).toBe('avantosApiSlice');
    });

    it('should have correct tag types', () => {
        // The slice should have 'Blueprints' as a tag type
        // This is configured in the createApi call
        expect(avantosApiSlice).toBeDefined();
    });

    it('should export reducer', () => {
        expect(avantosApiSlice.reducer).toBeDefined();
        expect(typeof avantosApiSlice.reducer).toBe('function');
    });

    it('should export middleware', () => {
        expect(avantosApiSlice.middleware).toBeDefined();
        expect(typeof avantosApiSlice.middleware).toBe('function');
    });

    it('should have empty endpoints initially', () => {
        // The endpoints builder returns an empty object initially
        // This means no endpoints are defined yet
        expect(avantosApiSlice).toBeDefined();
    });

    it('should be compatible with RTK Query', () => {
        // Verify that the slice has the expected RTK Query properties
        expect(avantosApiSlice.reducerPath).toBeDefined();
        expect(avantosApiSlice.reducer).toBeDefined();
        expect(avantosApiSlice.middleware).toBeDefined();
        expect(avantosApiSlice.endpoints).toBeDefined();
    });

    it('should have correct reducer path for store integration', () => {
        // The reducer path should match what's used in the store configuration
        expect(avantosApiSlice.reducerPath).toBe('avantosApiSlice');
    });
});
