import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://nestjs-sanay3y-app.vercel.app",
  }),
  endpoints: () => ({}),
});
