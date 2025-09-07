import { GlobalData, DataOption, GraphNodeData, DataSection, DataSectionType } from '../fieldSelection';
import { FieldMapping, DependencyData } from '../graph';

describe('Field Selection Types', () => {
    describe('GlobalData', () => {
        it('should have correct structure for actionProperties', () => {
            const globalData: GlobalData = {
                actionProperties: {
                    name: 'Test Action',
                    category: 'Test Category',
                    tenant_id: 'tenant123'
                },
                clientOrganizationProperties: {
                    organization_name: 'Test Org',
                    organization_email: 'test@org.com',
                    primary_contact: 'John Doe'
                }
            };

            expect(globalData.actionProperties).toHaveProperty('name');
            expect(globalData.actionProperties).toHaveProperty('category');
            expect(globalData.actionProperties).toHaveProperty('tenant_id');
            expect(typeof globalData.actionProperties.name).toBe('string');
            expect(typeof globalData.actionProperties.category).toBe('string');
            expect(typeof globalData.actionProperties.tenant_id).toBe('string');
        });

        it('should have correct structure for clientOrganizationProperties', () => {
            const globalData: GlobalData = {
                actionProperties: {
                    name: 'Test Action',
                    category: 'Test Category',
                    tenant_id: 'tenant123'
                },
                clientOrganizationProperties: {
                    organization_name: 'Test Org',
                    organization_email: 'test@org.com',
                    primary_contact: 'John Doe'
                }
            };

            expect(globalData.clientOrganizationProperties).toHaveProperty('organization_name');
            expect(globalData.clientOrganizationProperties).toHaveProperty('organization_email');
            expect(globalData.clientOrganizationProperties).toHaveProperty('primary_contact');
            expect(typeof globalData.clientOrganizationProperties.organization_name).toBe('string');
            expect(typeof globalData.clientOrganizationProperties.organization_email).toBe('string');
            expect(typeof globalData.clientOrganizationProperties.primary_contact).toBe('string');
        });
    });

    describe('DataOption', () => {
        it('should be an alias for FieldMapping', () => {
            const fieldMapping: FieldMapping = {
                label: 'Test Label',
                value: 'test.value',
                source: 'Test Source'
            };

            const dataOption: DataOption = fieldMapping;

            expect(dataOption).toEqual(fieldMapping);
            expect(dataOption.label).toBe('Test Label');
            expect(dataOption.value).toBe('test.value');
            expect(dataOption.source).toBe('Test Source');
        });
    });

    describe('GraphNodeData', () => {
        it('should have correct structure', () => {
            const dependencyData: DependencyData = {
                directDependencies: [],
                transitiveDependencies: []
            };

            const fieldMappings: Record<string, FieldMapping> = {
                'field1': {
                    label: 'Field 1',
                    value: 'field1.value',
                    source: 'Source 1'
                }
            };

            const graphNodeData: GraphNodeData = {
                label: 'Test Node',
                formFields: ['field1', 'field2'],
                dependencyData: dependencyData,
                fieldMappings: fieldMappings
            };

            expect(graphNodeData.label).toBe('Test Node');
            expect(graphNodeData.formFields).toEqual(['field1', 'field2']);
            expect(graphNodeData.dependencyData).toEqual(dependencyData);
            expect(graphNodeData.fieldMappings).toEqual(fieldMappings);
        });
    });

    describe('DataSection', () => {
        it('should have correct structure', () => {
            const dataOptions: DataOption[] = [
                {
                    label: 'Option 1',
                    value: 'option1.value',
                    source: 'Source 1'
                },
                {
                    label: 'Option 2',
                    value: 'option2.value',
                    source: 'Source 2'
                }
            ];

            const dataSection: DataSection = {
                title: 'Test Section',
                type: DataSectionType.GLOBAL,
                options: dataOptions
            };

            expect(dataSection.title).toBe('Test Section');
            expect(dataSection.type).toBe(DataSectionType.GLOBAL);
            expect(dataSection.options).toEqual(dataOptions);
        });
    });

    describe('DataSectionType', () => {
        it('should have correct enum values', () => {
            expect(DataSectionType.GLOBAL).toBe('global');
            expect(DataSectionType.DIRECT).toBe('direct');
            expect(DataSectionType.TRANSITIVE).toBe('transitive');
        });

        it('should have all expected enum values', () => {
            const expectedValues = ['global', 'direct', 'transitive'];
            const actualValues = Object.values(DataSectionType);
            
            expectedValues.forEach(value => {
                expect(actualValues).toContain(value);
            });
            
            expect(actualValues).toHaveLength(3);
        });
    });

    describe('Type Integration', () => {
        it('should work together in a complete scenario', () => {
            const globalData: GlobalData = {
                actionProperties: {
                    name: 'Test Action',
                    category: 'Test Category',
                    tenant_id: 'tenant123'
                },
                clientOrganizationProperties: {
                    organization_name: 'Test Org',
                    organization_email: 'test@org.com',
                    primary_contact: 'John Doe'
                }
            };

            const dependencyData: DependencyData = {
                directDependencies: [],
                transitiveDependencies: []
            };

            const fieldMappings: Record<string, FieldMapping> = {
                'field1': {
                    label: 'Field 1',
                    value: 'field1.value',
                    source: 'Source 1'
                }
            };

            const graphNodeData: GraphNodeData = {
                label: 'Test Node',
                formFields: ['field1', 'field2'],
                dependencyData: dependencyData,
                fieldMappings: fieldMappings
            };

            const dataOptions: DataOption[] = [
                {
                    label: 'Option 1',
                    value: 'option1.value',
                    source: 'Source 1'
                }
            ];

            const dataSection: DataSection = {
                title: 'Test Section',
                type: DataSectionType.GLOBAL,
                options: dataOptions
            };

            // Verify all types work together
            expect(globalData).toBeDefined();
            expect(graphNodeData).toBeDefined();
            expect(dataSection).toBeDefined();
            expect(dataSection.options[0]).toEqual(dataOptions[0]);
        });
    });
});

