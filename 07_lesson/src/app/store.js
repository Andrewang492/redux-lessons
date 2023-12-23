import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from '../features/api/apiSlice';

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: getDefaultMiddleware => // just have this.
        getDefaultMiddleware().concat(apiSlice.middleware), // add the apiSlice middleware. Requried.
    devTools: true
})