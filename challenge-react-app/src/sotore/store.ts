import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { avantosApiSlice } from "./avantos-api-slice";
import { GraphSlice } from "./graph-slice";



const rootReducer = combineReducers({
    [avantosApiSlice.reducerPath]: avantosApiSlice.reducer,
    graph: GraphSlice.reducer
});



export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }).concat(avantosApiSlice.middleware),
});
// Infer the `RootState` and `AppDispatch` types from the store itself

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;