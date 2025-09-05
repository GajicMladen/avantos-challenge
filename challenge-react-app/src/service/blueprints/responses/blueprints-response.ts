export interface BlueprintResponse {
    id: string;
    tenant_id: string;
    name: string;
    description: string;
    category: string;
    nodes: NodeItem[];
    edges: EdgeItem[];
    forms: FormItem[];
    branches: any[];
    triggers: any[];
}

export interface NodeItem {
    id: string;
    type: string;
    position: { x: number; y: number };
    data: {
        id: string;
        component_key: string;
        component_type: string;
        component_id: string;
        name: string;
        prerequisites: string[];
        permitted_roles: string[];
        input_mapping: Record<string, any>;
        sla_duration: { number: number; unit: string };
        approval_required: boolean;
        approval_roles: string[];
    };
}

export interface EdgeItem {
    source: string;
    target: string;
}

export interface FormItem {
    id: string;
    name: string;
    description: string;
    is_reusable: boolean;
    field_schema: Record<string, any>;
    ui_schema: Record<string, any>;
    dynamic_field_config: Record<string, any>;
}