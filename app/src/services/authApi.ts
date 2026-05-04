import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (data) => ({
        url: "/auth/signup",
        method: "POST",
        body: data,
      }),
    }),
    login: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),
    forgetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),
    verifyCode: builder.mutation<any, { token: string; code: string }>({
      query: ({ token, code }) => ({
        url: "/auth/verify-code",
        method: "POST",
        headers: {
          token: `Bearer ${token}`,
        },
        body: { code },
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useForgetPasswordMutation,
  useVerifyCodeMutation,
} = authApi;
