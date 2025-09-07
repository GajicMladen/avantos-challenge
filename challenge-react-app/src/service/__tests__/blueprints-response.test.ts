import { BlueprintResponse, NodeItem, EdgeItem, FormItem } from '../blueprints/responses/blueprints-response';

describe('Blueprints Response Types', () => {
    describe('BlueprintResponse', () => {
        it('should have correct structure', () => {
            const blueprintResponse: BlueprintResponse = {
                id: 'blueprint1',
                tenant_id: 'tenant1',
                name: 'Test Blueprint',
                description: 'Test Description',
                category: 'Test Category',
                nodes: [],
                edges: [],
                forms: [],
                branches: [],
                triggers: []
            };

            expect(blueprintResponse.id).toBe('blueprint1');
            expect(blueprintResponse.tenant_id).toBe('tenant1');
            expect(blueprintResponse.name).toBe('Test Blueprint');
            expect(blueprintResponse.description).toBe('Test Description');
            expect(blueprintResponse.category).toBe('Test Category');
            expect(blueprintResponse.nodes).toEqual([]);
            expect(blueprintResponse.edges).toEqual([]);
            expect(blueprintResponse.forms).toEqual([]);
            expect(blueprintResponse.branches).toEqual([]);
            expect(blueprintResponse.triggers).toEqual([]);
        });

        it('should handle empty arrays', () => {
            const blueprintResponse: BlueprintResponse = {
                id: 'blueprint1',
                tenant_id: 'tenant1',
                name: 'Test Blueprint',
                description: 'Test Description',
                category: 'Test Category',
                nodes: [],
                edges: [],
                forms: [],
                branches: [],
                triggers: []
            };

            expect(blueprintResponse.nodes).toHaveLength(0);
            expect(blueprintResponse.edges).toHaveLength(0);
            expect(blueprintResponse.forms).toHaveLength(0);
            expect(blueprintResponse.branches).toHaveLength(0);
            expect(blueprintResponse.triggers).toHaveLength(0);
        });
    });

    describe('NodeItem', () => {
        it('should have correct structure', () => {
            const nodeItem: NodeItem = {
                id: 'node1',
                type: 'form',
                position: { x: 100, y: 200 },
                data: {
                    id: 'node1',
                    component_key: 'form_component',
                    component_type: 'form',
                    component_id: 'form1',
                    name: 'Test Form',
                    prerequisites: ['node2', 'node3'],
                    permitted_roles: ['admin', 'user'],
                    input_mapping: { field1: 'value1' },
                    sla_duration: { number: 24, unit: 'hours' },
                    approval_required: true,
                    approval_roles: ['manager']
                }
            };

            expect(nodeItem.id).toBe('node1');
            expect(nodeItem.type).toBe('form');
            expect(nodeItem.position).toEqual({ x: 100, y: 200 });
            expect(nodeItem.data.id).toBe('node1');
            expect(nodeItem.data.component_key).toBe('form_component');
            expect(nodeItem.data.component_type).toBe('form');
            expect(nodeItem.data.component_id).toBe('form1');
            expect(nodeItem.data.name).toBe('Test Form');
            expect(nodeItem.data.prerequisites).toEqual(['node2', 'node3']);
            expect(nodeItem.data.permitted_roles).toEqual(['admin', 'user']);
            expect(nodeItem.data.input_mapping).toEqual({ field1: 'value1' });
            expect(nodeItem.data.sla_duration).toEqual({ number: 24, unit: 'hours' });
            expect(nodeItem.data.approval_required).toBe(true);
            expect(nodeItem.data.approval_roles).toEqual(['manager']);
        });

        it('should handle empty prerequisites', () => {
            const nodeItem: NodeItem = {
                id: 'node1',
                type: 'form',
                position: { x: 0, y: 0 },
                data: {
                    id: 'node1',
                    component_key: 'form_component',
                    component_type: 'form',
                    component_id: 'form1',
                    name: 'Test Form',
                    prerequisites: [],
                    permitted_roles: [],
                    input_mapping: {},
                    sla_duration: { number: 0, unit: 'hours' },
                    approval_required: false,
                    approval_roles: []
                }
            };

            expect(nodeItem.data.prerequisites).toEqual([]);
            expect(nodeItem.data.permitted_roles).toEqual([]);
            expect(nodeItem.data.input_mapping).toEqual({});
            expect(nodeItem.data.approval_roles).toEqual([]);
        });
    });

    describe('EdgeItem', () => {
        it('should have correct structure', () => {
            const edgeItem: EdgeItem = {
                source: 'node1',
                target: 'node2'
            };

            expect(edgeItem.source).toBe('node1');
            expect(edgeItem.target).toBe('node2');
        });

        it('should handle self-referencing edges', () => {
            const edgeItem: EdgeItem = {
                source: 'node1',
                target: 'node1'
            };

            expect(edgeItem.source).toBe('node1');
            expect(edgeItem.target).toBe('node1');
        });
    });

    describe('FormItem', () => {
        it('should have correct structure', () => {
            const formItem: FormItem = {
                id: 'form1',
                name: 'Test Form',
                description: 'Test Form Description',
                is_reusable: true,
                field_schema: {
                    properties: {
                        field1: { type: 'string' },
                        field2: { type: 'number' }
                    }
                },
                ui_schema: {
                    field1: { widget: 'text' },
                    field2: { widget: 'number' }
                },
                dynamic_field_config: {
                    conditional_fields: ['field2']
                }
            };

            expect(formItem.id).toBe('form1');
            expect(formItem.name).toBe('Test Form');
            expect(formItem.description).toBe('Test Form Description');
            expect(formItem.is_reusable).toBe(true);
            expect(formItem.field_schema).toEqual({
                properties: {
                    field1: { type: 'string' },
                    field2: { type: 'number' }
                }
            });
            expect(formItem.ui_schema).toEqual({
                field1: { widget: 'text' },
                field2: { widget: 'number' }
            });
            expect(formItem.dynamic_field_config).toEqual({
                conditional_fields: ['field2']
            });
        });

        it('should handle empty schemas', () => {
            const formItem: FormItem = {
                id: 'form1',
                name: 'Test Form',
                description: 'Test Form Description',
                is_reusable: false,
                field_schema: {},
                ui_schema: {},
                dynamic_field_config: {}
            };

            expect(formItem.is_reusable).toBe(false);
            expect(formItem.field_schema).toEqual({});
            expect(formItem.ui_schema).toEqual({});
            expect(formItem.dynamic_field_config).toEqual({});
        });
    });

    describe('Type Integration', () => {
        it('should work together in a complete BlueprintResponse', () => {
            const nodeItem: NodeItem = {
                id: 'node1',
                type: 'form',
                position: { x: 100, y: 200 },
                data: {
                    id: 'node1',
                    component_key: 'form_component',
                    component_type: 'form',
                    component_id: 'form1',
                    name: 'Test Form',
                    prerequisites: [],
                    permitted_roles: ['admin'],
                    input_mapping: {},
                    sla_duration: { number: 24, unit: 'hours' },
                    approval_required: false,
                    approval_roles: []
                }
            };

            const edgeItem: EdgeItem = {
                source: 'node1',
                target: 'node2'
            };

            const formItem: FormItem = {
                id: 'form1',
                name: 'Test Form',
                description: 'Test Form Description',
                is_reusable: true,
                field_schema: {
                    properties: {
                        field1: { type: 'string' }
                    }
                },
                ui_schema: {},
                dynamic_field_config: {}
            };

            const blueprintResponse: BlueprintResponse = {
                id: 'blueprint1',
                tenant_id: 'tenant1',
                name: 'Test Blueprint',
                description: 'Test Description',
                category: 'Test Category',
                nodes: [nodeItem],
                edges: [edgeItem],
                forms: [formItem],
                branches: [],
                triggers: []
            };

            expect(blueprintResponse.nodes).toHaveLength(1);
            expect(blueprintResponse.edges).toHaveLength(1);
            expect(blueprintResponse.forms).toHaveLength(1);
            expect(blueprintResponse.nodes[0]).toEqual(nodeItem);
            expect(blueprintResponse.edges[0]).toEqual(edgeItem);
            expect(blueprintResponse.forms[0]).toEqual(formItem);
        });
    });
});

