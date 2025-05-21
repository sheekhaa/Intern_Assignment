import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';  

const SignupService = createApi({
  reducerPath: 'signupService',
  baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:3000'}),
  endpoints: (build) => ({
    addData: build.mutation({
      query: (userData) =>({
        url: '/signup',
        method: 'POST',
        body: userData,
      }),
    }),
  }),  
});
export const { useAddDataMutation} = SignupService
export default SignupService;
