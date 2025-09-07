import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { type Edge, type Node } from "@xyflow/react";

export type GraphState = {
    nodes: Node[];
    edges: Edge[];
};

interface InitStatePayload extends Partial<GraphState> { }

interface UpdateFormFieldMappingPayload {
    nodeId: string;
    fieldName: string;
    mapping: any;
}

interface DeleteMappingPayload {
    nodeId: string;
    fieldName: string;
}

const initialState: GraphState = {
    nodes: [],
    edges: [],
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

        //Delete field maping
        deleteFromFileMapping: (
            state,
            action: PayloadAction<DeleteMappingPayload>
        ) => {
            const { nodeId, fieldName, } = action.payload;
            const node = state.nodes.find((n) => n.id === nodeId);
            if (node && node.data.fieldMappings) {
                delete (node.data.fieldMappings as Record<string, any>)[fieldName];
            }

        }


    }
});


export const {
    setGraph,
    updateFormFieldMapping,
    deleteFromFileMapping
} = GraphSlice.actions;

export default GraphSlice.reducer;