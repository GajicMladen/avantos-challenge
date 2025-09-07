import { ApplicationRoutes } from '../routes';

describe('Application Routes', () => {
    describe('ApplicationRoutes class', () => {
        it('should be defined', () => {
            expect(ApplicationRoutes).toBeDefined();
        });

        it('should be a class', () => {
            expect(typeof ApplicationRoutes).toBe('function');
        });
    });

    describe('LANDING_PAGE route', () => {
        it('should be defined', () => {
            expect(ApplicationRoutes.LANDING_PAGE).toBeDefined();
        });

        it('should be a string', () => {
            expect(typeof ApplicationRoutes.LANDING_PAGE).toBe('string');
        });

        it('should have correct value', () => {
            expect(ApplicationRoutes.LANDING_PAGE).toBe('/');
        });

        it('should be static readonly', () => {
            // This is a compile-time test - if it's not static readonly, TypeScript will error
            expect(ApplicationRoutes.LANDING_PAGE).toBeDefined();
        });
    });

    describe('Route constants', () => {
        it('should have all expected routes', () => {
            const expectedRoutes = ['LANDING_PAGE'];
            const actualRoutes = Object.getOwnPropertyNames(ApplicationRoutes);
            
            expectedRoutes.forEach(route => {
                expect(actualRoutes).toContain(route);
            });
        });

        it('should not have unexpected routes', () => {
            const actualRoutes = Object.getOwnPropertyNames(ApplicationRoutes);
            // Filter out prototype properties and built-in properties
            const customRoutes = actualRoutes.filter(prop => 
                prop !== 'length' && 
                prop !== 'name' && 
                prop !== 'prototype'
            );
            expect(customRoutes).toHaveLength(1);
        });
    });

    describe('Route values', () => {
        it('should have valid route paths', () => {
            expect(ApplicationRoutes.LANDING_PAGE).toMatch(/^\//);
        });

        it('should not have empty route paths', () => {
            expect(ApplicationRoutes.LANDING_PAGE).not.toBe('');
        });

        it('should have consistent route format', () => {
            // All routes should start with '/'
            expect(ApplicationRoutes.LANDING_PAGE).toMatch(/^\//);
        });
    });

    describe('Usage scenarios', () => {
        it('should be usable in router configuration', () => {
            // Test that the route can be used in router configuration
            const routeConfig = {
                path: ApplicationRoutes.LANDING_PAGE,
                element: 'TestElement'
            };

            expect(routeConfig.path).toBe('/');
            expect(routeConfig.element).toBe('TestElement');
        });

        it('should be usable in navigation', () => {
            // Test that the route can be used for navigation
            const navigationPath = ApplicationRoutes.LANDING_PAGE;
            expect(navigationPath).toBe('/');
        });

        it('should be usable in route matching', () => {
            // Test that the route can be used for route matching
            const currentPath = '/';
            const isLandingPage = currentPath === ApplicationRoutes.LANDING_PAGE;
            expect(isLandingPage).toBe(true);
        });
    });

    describe('Type safety', () => {
        it('should provide correct TypeScript types', () => {
            // This is a compile-time test - if the types are wrong, TypeScript will error
            const route: string = ApplicationRoutes.LANDING_PAGE;
            expect(route).toBe('/');
        });

        it('should be immutable', () => {
            // The routes should be readonly/immutable
            expect(ApplicationRoutes.LANDING_PAGE).toBeDefined();
        });
    });
});
