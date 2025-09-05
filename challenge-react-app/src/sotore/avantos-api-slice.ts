import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const avantosApiSlice = createApi({
	reducerPath: "avantosApiSlice",
	baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/api/v1/" }),
	tagTypes: [
		"Blueprints",
	],
	endpoints: builder => ({}),
});