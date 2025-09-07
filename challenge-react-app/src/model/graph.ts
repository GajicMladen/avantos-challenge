export interface DependencyForm {
    nodeId: string;
    nodeName: string;
    formId: string;
    formFields: string[];
}

export interface DependencyData {
    directDependencies: DependencyForm[];
    transitiveDependencies: DependencyForm[];
}

export interface FieldMapping {
    label: string;
    value: string;
    source: string;
}

