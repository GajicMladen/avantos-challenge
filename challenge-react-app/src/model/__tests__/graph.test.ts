import { DependencyForm, DependencyData, FieldMapping } from '../graph';

describe('Graph Types', () => {
    describe('DependencyForm', () => {
        it('should have correct structure', () => {
            const dependencyForm: DependencyForm = {
                nodeId: 'node1',
                nodeName: 'Test Node',
                formId: 'form1',
                formFields: ['field1', 'field2', 'field3']
            };

            expect(dependencyForm.nodeId).toBe('node1');
            expect(dependencyForm.nodeName).toBe('Test Node');
            expect(dependencyForm.formId).toBe('form1');
            expect(dependencyForm.formFields).toEqual(['field1', 'field2', 'field3']);
        });

        it('should handle empty form fields', () => {
            const dependencyForm: DependencyForm = {
                nodeId: 'node1',
                nodeName: 'Test Node',
                formId: 'form1',
                formFields: []
            };

            expect(dependencyForm.formFields).toEqual([]);
            expect(dependencyForm.formFields).toHaveLength(0);
        });

        it('should handle single form field', () => {
            const dependencyForm: DependencyForm = {
                nodeId: 'node1',
                nodeName: 'Test Node',
                formId: 'form1',
                formFields: ['singleField']
            };

            expect(dependencyForm.formFields).toEqual(['singleField']);
            expect(dependencyForm.formFields).toHaveLength(1);
        });
    });

    describe('DependencyData', () => {
        it('should have correct structure with empty dependencies', () => {
            const dependencyData: DependencyData = {
                directDependencies: [],
                transitiveDependencies: []
            };

            expect(dependencyData.directDependencies).toEqual([]);
            expect(dependencyData.transitiveDependencies).toEqual([]);
        });

        it('should have correct structure with direct dependencies only', () => {
            const directDep: DependencyForm = {
                nodeId: 'node1',
                nodeName: 'Direct Node',
                formId: 'form1',
                formFields: ['field1', 'field2']
            };

            const dependencyData: DependencyData = {
                directDependencies: [directDep],
                transitiveDependencies: []
            };

            expect(dependencyData.directDependencies).toHaveLength(1);
            expect(dependencyData.directDependencies[0]).toEqual(directDep);
            expect(dependencyData.transitiveDependencies).toEqual([]);
        });

        it('should have correct structure with transitive dependencies only', () => {
            const transitiveDep: DependencyForm = {
                nodeId: 'node2',
                nodeName: 'Transitive Node',
                formId: 'form2',
                formFields: ['field3', 'field4']
            };

            const dependencyData: DependencyData = {
                directDependencies: [],
                transitiveDependencies: [transitiveDep]
            };

            expect(dependencyData.directDependencies).toEqual([]);
            expect(dependencyData.transitiveDependencies).toHaveLength(1);
            expect(dependencyData.transitiveDependencies[0]).toEqual(transitiveDep);
        });

        it('should have correct structure with both dependency types', () => {
            const directDep: DependencyForm = {
                nodeId: 'node1',
                nodeName: 'Direct Node',
                formId: 'form1',
                formFields: ['field1', 'field2']
            };

            const transitiveDep: DependencyForm = {
                nodeId: 'node2',
                nodeName: 'Transitive Node',
                formId: 'form2',
                formFields: ['field3', 'field4']
            };

            const dependencyData: DependencyData = {
                directDependencies: [directDep],
                transitiveDependencies: [transitiveDep]
            };

            expect(dependencyData.directDependencies).toHaveLength(1);
            expect(dependencyData.transitiveDependencies).toHaveLength(1);
            expect(dependencyData.directDependencies[0]).toEqual(directDep);
            expect(dependencyData.transitiveDependencies[0]).toEqual(transitiveDep);
        });

        it('should handle multiple dependencies of each type', () => {
            const directDep1: DependencyForm = {
                nodeId: 'node1',
                nodeName: 'Direct Node 1',
                formId: 'form1',
                formFields: ['field1']
            };

            const directDep2: DependencyForm = {
                nodeId: 'node2',
                nodeName: 'Direct Node 2',
                formId: 'form2',
                formFields: ['field2']
            };

            const transitiveDep1: DependencyForm = {
                nodeId: 'node3',
                nodeName: 'Transitive Node 1',
                formId: 'form3',
                formFields: ['field3']
            };

            const transitiveDep2: DependencyForm = {
                nodeId: 'node4',
                nodeName: 'Transitive Node 2',
                formId: 'form4',
                formFields: ['field4']
            };

            const dependencyData: DependencyData = {
                directDependencies: [directDep1, directDep2],
                transitiveDependencies: [transitiveDep1, transitiveDep2]
            };

            expect(dependencyData.directDependencies).toHaveLength(2);
            expect(dependencyData.transitiveDependencies).toHaveLength(2);
        });
    });

    describe('FieldMapping', () => {
        it('should have correct structure', () => {
            const fieldMapping: FieldMapping = {
                label: 'Test Field',
                value: 'test.field.value',
                source: 'Test Source'
            };

            expect(fieldMapping.label).toBe('Test Field');
            expect(fieldMapping.value).toBe('test.field.value');
            expect(fieldMapping.source).toBe('Test Source');
        });

        it('should handle empty strings', () => {
            const fieldMapping: FieldMapping = {
                label: '',
                value: '',
                source: ''
            };

            expect(fieldMapping.label).toBe('');
            expect(fieldMapping.value).toBe('');
            expect(fieldMapping.source).toBe('');
        });

        it('should handle complex values', () => {
            const fieldMapping: FieldMapping = {
                label: 'Complex Field Name',
                value: 'organization.complex.field.mapping',
                source: 'Complex Source Name'
            };

            expect(fieldMapping.label).toBe('Complex Field Name');
            expect(fieldMapping.value).toBe('organization.complex.field.mapping');
            expect(fieldMapping.source).toBe('Complex Source Name');
        });
    });

    describe('Type Integration', () => {
        it('should work together in a complete scenario', () => {
            const fieldMapping: FieldMapping = {
                label: 'Test Field',
                value: 'test.field.value',
                source: 'Test Source'
            };

            const directDep: DependencyForm = {
                nodeId: 'node1',
                nodeName: 'Direct Node',
                formId: 'form1',
                formFields: ['field1', 'field2']
            };

            const transitiveDep: DependencyForm = {
                nodeId: 'node2',
                nodeName: 'Transitive Node',
                formId: 'form2',
                formFields: ['field3', 'field4']
            };

            const dependencyData: DependencyData = {
                directDependencies: [directDep],
                transitiveDependencies: [transitiveDep]
            };

            // Verify all types work together
            expect(fieldMapping).toBeDefined();
            expect(dependencyData).toBeDefined();
            expect(dependencyData.directDependencies[0]).toEqual(directDep);
            expect(dependencyData.transitiveDependencies[0]).toEqual(transitiveDep);
        });

        it('should handle nested field mappings in dependency forms', () => {
            const fieldMappings: Record<string, FieldMapping> = {
                'field1': {
                    label: 'Field 1',
                    value: 'field1.value',
                    source: 'Source 1'
                },
                'field2': {
                    label: 'Field 2',
                    value: 'field2.value',
                    source: 'Source 2'
                }
            };

            const dependencyForm: DependencyForm = {
                nodeId: 'node1',
                nodeName: 'Test Node',
                formId: 'form1',
                formFields: Object.keys(fieldMappings)
            };

            expect(dependencyForm.formFields).toEqual(['field1', 'field2']);
            expect(fieldMappings['field1']).toEqual({
                label: 'Field 1',
                value: 'field1.value',
                source: 'Source 1'
            });
        });
    });
});

