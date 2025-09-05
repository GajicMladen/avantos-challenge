import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { avantosApiSlice } from "./avantos-api-slice";


export type RootState = ReturnType<typeof rootReducer>;

const rootReducer = combineReducers({
    [avantosApiSlice.reducerPath]: avantosApiSlice.reducer,
});



export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }).concat(avantosApiSlice.middleware),
});
// Infer the `RootState` and `AppDispatch` types from the store itself

export type AppDispatch = typeof store.dispatch;