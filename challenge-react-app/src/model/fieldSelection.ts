import { DependencyData, FieldMapping } from "./graph";

export interface GlobalData {
    actionProperties: {
        name: string;
        category: string;
        tenant_id: string;
    };
    clientOrganizationProperties: {
        organization_name: string;
        organization_email: string;
        primary_contact: string;
    };
}

export type DataOption = FieldMapping;

export interface GraphNodeData {

    label: string;
    formFields: string[];
    dependencyData: DependencyData;
    fieldMappings: Record<string, FieldMapping>;
}

export interface DataSection {
    title: string;
    type: DataSectionType;
    options: DataOption[];
}

export enum DataSectionType {
    GLOBAL = "global",
    DIRECT = "direct",
    TRANSITIVE = "transitive",
}
