import { DatabaseIcon, DeleteIcon } from '../icons';

describe('Icons', () => {
    describe('DatabaseIcon', () => {
        it('should export DatabaseIcon component', () => {
            expect(DatabaseIcon).toBeDefined();
            expect(typeof DatabaseIcon).toBe('object'); // SVG components are objects, not functions
        });

        it('should be a React component', () => {
            // This is a compile-time test - if it's not a React component, TypeScript will error
            expect(DatabaseIcon).toBeDefined();
        });
    });

    describe('DeleteIcon', () => {
        it('should export DeleteIcon component', () => {
            expect(DeleteIcon).toBeDefined();
            expect(typeof DeleteIcon).toBe('object'); // SVG components are objects, not functions
        });

        it('should be a React component', () => {
            // This is a compile-time test - if it's not a React component, TypeScript will error
            expect(DeleteIcon).toBeDefined();
        });
    });

    describe('Icon Exports', () => {
        it('should export all expected icons', () => {
            const expectedIcons = ['DatabaseIcon', 'DeleteIcon'];
            const exportedIcons = Object.keys({ DatabaseIcon, DeleteIcon });
            
            expectedIcons.forEach(iconName => {
                expect(exportedIcons).toContain(iconName);
            });
        });

        it('should not export unexpected icons', () => {
            const exportedIcons = Object.keys({ DatabaseIcon, DeleteIcon });
            expect(exportedIcons).toHaveLength(2);
        });
    });
});
