import { formatFieldLabel, getDataSections } from '../util';
import { DataSectionType } from '../../model/fieldSelection';
import { DependencyData } from '../../model/graph';

describe('formatFieldLabel', () => {
    it('should format snake_case to Title Case', () => {
        expect(formatFieldLabel('user_name')).toBe('User Name');
        expect(formatFieldLabel('first_name')).toBe('First Name');
        expect(formatFieldLabel('last_name')).toBe('Last Name');
    });

    it('should handle single words', () => {
        expect(formatFieldLabel('name')).toBe('Name');
        expect(formatFieldLabel('email')).toBe('Email');
        expect(formatFieldLabel('id')).toBe('Id');
    });

    it('should handle multiple underscores', () => {
        expect(formatFieldLabel('user_first_name')).toBe('User First Name');
        expect(formatFieldLabel('client_organization_properties')).toBe('Client Organization Properties');
    });

    it('should handle empty string', () => {
        expect(formatFieldLabel('')).toBe('');
    });

    it('should handle strings with no underscores', () => {
        expect(formatFieldLabel('username')).toBe('Username');
        expect(formatFieldLabel('emailaddress')).toBe('Emailaddress');
    });

    it('should handle strings starting with underscore', () => {
        expect(formatFieldLabel('_private_field')).toBe(' Private Field');
    });

    it('should handle strings ending with underscore', () => {
        expect(formatFieldLabel('field_')).toBe('Field ');
    });

    it('should handle consecutive underscores', () => {
        expect(formatFieldLabel('field__name')).toBe('Field  Name');
    });
});

describe('getDataSections', () => {
    const mockDependencyData: DependencyData = {
        directDependencies: [
            {
                nodeId: 'form1',
                nodeName: 'User Registration Form',
                formId: 'user_reg_form',
                formFields: ['username', 'email', 'password']
            },
            {
                nodeId: 'form2',
                nodeName: 'Profile Form',
                formId: 'profile_form',
                formFields: ['first_name', 'last_name', 'phone_number']
            }
        ],
        transitiveDependencies: [
            {
                nodeId: 'form3',
                nodeName: 'Address Form',
                formId: 'address_form',
                formFields: ['street_address', 'city', 'postal_code']
            }
        ]
    };

    const emptyDependencyData: DependencyData = {
        directDependencies: [],
        transitiveDependencies: []
    };

    it('should return global data sections when no dependencies', () => {
        const result = getDataSections(emptyDependencyData);
        
        expect(result).toHaveLength(2);
        
        // Check Action Properties section
        expect(result[0]).toEqual({
            title: 'Action Properties',
            type: DataSectionType.GLOBAL,
            options: [
                { label: 'Name', value: 'action.name', source: 'Action Properties' },
                { label: 'Category', value: 'action.category', source: 'Action Properties' },
                { label: 'Tenant Id', value: 'action.tenant_id', source: 'Action Properties' }
            ]
        });

        // Check Client Organization Properties section
        expect(result[1]).toEqual({
            title: 'Client Organization Properties',
            type: DataSectionType.GLOBAL,
            options: [
                { label: 'Organization Name', value: 'organization.organization_name', source: 'Client Organization Properties' },
                { label: 'Organization Email', value: 'organization.organization_email', source: 'Client Organization Properties' },
                { label: 'Primary Contact', value: 'organization.primary_contact', source: 'Client Organization Properties' }
            ]
        });
    });

    it('should include direct dependencies when present', () => {
        const result = getDataSections(mockDependencyData);
        
        expect(result).toHaveLength(5); // 2 global + 2 direct + 1 transitive
        
        // Check first direct dependency
        expect(result[2]).toEqual({
            title: 'User Registration Form',
            type: DataSectionType.DIRECT,
            options: [
                { label: 'username', value: 'form1.username', source: 'User Registration Form' },
                { label: 'email', value: 'form1.email', source: 'User Registration Form' },
                { label: 'password', value: 'form1.password', source: 'User Registration Form' }
            ]
        });

        // Check second direct dependency
        expect(result[3]).toEqual({
            title: 'Profile Form',
            type: DataSectionType.DIRECT,
            options: [
                { label: 'first_name', value: 'form2.first_name', source: 'Profile Form' },
                { label: 'last_name', value: 'form2.last_name', source: 'Profile Form' },
                { label: 'phone_number', value: 'form2.phone_number', source: 'Profile Form' }
            ]
        });
    });

    it('should include transitive dependencies when present', () => {
        const result = getDataSections(mockDependencyData);
        
        // Check transitive dependency
        expect(result[4]).toEqual({
            title: 'Address Form',
            type: DataSectionType.TRANSITIVE,
            options: [
                { label: 'street_address', value: 'form3.street_address', source: 'Address Form' },
                { label: 'city', value: 'form3.city', source: 'Address Form' },
                { label: 'postal_code', value: 'form3.postal_code', source: 'Address Form' }
            ]
        });
    });

    it('should handle empty form fields in dependencies', () => {
        const dependencyDataWithEmptyFields: DependencyData = {
            directDependencies: [
                {
                    nodeId: 'empty_form',
                    nodeName: 'Empty Form',
                    formId: 'empty_form_id',
                    formFields: []
                }
            ],
            transitiveDependencies: []
        };

        const result = getDataSections(dependencyDataWithEmptyFields);
        
        expect(result).toHaveLength(3); // 2 global + 1 direct with empty fields
        
        expect(result[2]).toEqual({
            title: 'Empty Form',
            type: DataSectionType.DIRECT,
            options: []
        });
    });

    it('should handle only direct dependencies', () => {
        const onlyDirectDependencies: DependencyData = {
            directDependencies: [
                {
                    nodeId: 'direct_form',
                    nodeName: 'Direct Form',
                    formId: 'direct_form_id',
                    formFields: ['field1', 'field2']
                }
            ],
            transitiveDependencies: []
        };

        const result = getDataSections(onlyDirectDependencies);
        
        expect(result).toHaveLength(3); // 2 global + 1 direct
        
        expect(result[2]).toEqual({
            title: 'Direct Form',
            type: DataSectionType.DIRECT,
            options: [
                { label: 'field1', value: 'direct_form.field1', source: 'Direct Form' },
                { label: 'field2', value: 'direct_form.field2', source: 'Direct Form' }
            ]
        });
    });

    it('should handle only transitive dependencies', () => {
        const onlyTransitiveDependencies: DependencyData = {
            directDependencies: [],
            transitiveDependencies: [
                {
                    nodeId: 'transitive_form',
                    nodeName: 'Transitive Form',
                    formId: 'transitive_form_id',
                    formFields: ['field1', 'field2']
                }
            ]
        };

        const result = getDataSections(onlyTransitiveDependencies);
        
        expect(result).toHaveLength(3); // 2 global + 1 transitive
        
        expect(result[2]).toEqual({
            title: 'Transitive Form',
            type: DataSectionType.TRANSITIVE,
            options: [
                { label: 'field1', value: 'transitive_form.field1', source: 'Transitive Form' },
                { label: 'field2', value: 'transitive_form.field2', source: 'Transitive Form' }
            ]
        });
    });

    it('should maintain correct order: global, direct, then transitive', () => {
        const result = getDataSections(mockDependencyData);
        
        expect(result[0].type).toBe(DataSectionType.GLOBAL);
        expect(result[1].type).toBe(DataSectionType.GLOBAL);
        expect(result[2].type).toBe(DataSectionType.DIRECT);
        expect(result[3].type).toBe(DataSectionType.DIRECT);
        expect(result[4].type).toBe(DataSectionType.TRANSITIVE);
    });
});
