
import { avantosApiSlice } from "../../sotore/avantos-api-slice";
import { BlueprintResponse } from "./responses/blueprints-response";

const blueprintEndpoints = avantosApiSlice.injectEndpoints({

    endpoints: builder => ({
        getBlueprints: builder.query<BlueprintResponse, { tenantId: string, blueprintId: string }>({
            providesTags: ["Blueprints"],
            query: (params) => ({
                url: `/${params.tenantId}/actions/blueprints/${params.blueprintId}/graph`,
                method: "GET"
            })
        })
    })
});

export const {
    useLazyGetBlueprintsQuery
} = blueprintEndpoints;