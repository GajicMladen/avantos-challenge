import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { type Edge, type Node } from "@xyflow/react";

export type GraphState = {
    nodes: Node[];
    edges: Edge[];
    globalData: GlobalData;
};

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
interface InitStatePayload extends Partial<GraphState> { }

interface UpdateFormFieldMappingPayload {
    nodeId: string;
    fieldName: string;
    mapping: any;
}

interface RemoveFormFieldMappingPayload {
    nodeId: string;
    fieldName: string;
}

const initialState: GraphState = {
    nodes: [],
    edges: [],
    globalData: {
        actionProperties: {
            name: "",
            category: "",
            tenant_id: ""
        },
        clientOrganizationProperties: {
            organization_name: "",
            organization_email: "",
            primary_contact: ""
        }
    }
}

export const GraphSlice = createSlice({
    name: "graph",
    initialState: initialState,
    reducers: {
        // Replaces current state with payload
        setGraph: (state, action: PayloadAction<InitStatePayload>) => {
            return { ...state, ...action.payload };
        },

        // Adds or updates mapping for a specific field in a node
        updateFormFieldMapping: (
            state,
            action: PayloadAction<UpdateFormFieldMappingPayload>
        ) => {
            const { nodeId, fieldName, mapping } = action.payload;
            const node = state.nodes.find((n) => n.id === nodeId);
            if (node) {
                node.data.fieldMappings = {
                    ...(node.data.fieldMappings || {}),
                    [fieldName]: mapping,
                };
            }
        },

        // Removes a specific field mapping from a node
        removeFormFieldMapping: (
            state,
            action: PayloadAction<RemoveFormFieldMappingPayload>
        ) => {
            const { nodeId, fieldName } = action.payload;
            const node = state.nodes.find((n) => n.id === nodeId);
            if (node && node.data.fieldMappings) {
                delete (node.data.fieldMappings as Record<string, any>)[fieldName];
            }
        },
    }
});


export const {
    setGraph,
    updateFormFieldMapping,
    removeFormFieldMapping,
} = GraphSlice.actions;

export default GraphSlice.reducer;