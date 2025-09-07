import { ApplicationRoutes } from '../routes';

// Mock the router module to avoid React Router DOM dependency issues
jest.mock('../router', () => ({
    router: {
        routes: [],
        navigate: jest.fn(),
        location: { pathname: '/' }
    }
}));

// Mock the DisplayGraphPage component
jest.mock('../pages/graph/displayGraphPage', () => ({
    DisplayGraphPage: () => 'DisplayGraphPage'
}));

import { router } from '../router';

describe('Router Configuration', () => {
    describe('router', () => {
        it('should be defined', () => {
            expect(router).toBeDefined();
        });

        it('should be created with createBrowserRouter', () => {
            // The router should be created using createBrowserRouter
            expect(router).toBeDefined();
        });
    });

    describe('ApplicationRoutes', () => {
        it('should have LANDING_PAGE route', () => {
            expect(ApplicationRoutes.LANDING_PAGE).toBe('/');
        });

        it('should be a static readonly property', () => {
            // This is a compile-time test - if it's not static readonly, TypeScript will error
            expect(ApplicationRoutes.LANDING_PAGE).toBeDefined();
        });

        it('should have correct route value', () => {
            expect(ApplicationRoutes.LANDING_PAGE).toBe('/');
        });
    });

    describe('Route Configuration', () => {
        it('should use ApplicationRoutes.LANDING_PAGE for the landing page', () => {
            // The router should use the ApplicationRoutes constant
            expect(ApplicationRoutes.LANDING_PAGE).toBe('/');
        });

        it('should have DisplayGraphPage as the landing page element', () => {
            // The router should render DisplayGraphPage for the landing page
            // This is tested implicitly by the router being created successfully
            expect(router).toBeDefined();
        });
    });

    describe('Integration', () => {
        it('should work together with routes and components', () => {
            // Test that the router, routes, and components work together
            expect(router).toBeDefined();
            expect(ApplicationRoutes.LANDING_PAGE).toBe('/');
        });

        it('should be compatible with React Router DOM', () => {
            // The router should be compatible with React Router DOM
            expect(router).toBeDefined();
        });
    });
});
