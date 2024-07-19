import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api", // optional
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3500" }),
  tagTypes: ["Post", "User"],
  endpoints: (builder) => ({}), // extended in postsSlice using injectEndpoints. Should be empty, leaving it brings an error though.
});
