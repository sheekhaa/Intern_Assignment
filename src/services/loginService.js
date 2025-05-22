import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'; 


const LoginService  = createApi({
  reducerPath: 'loginService',
  baseQuery: fetchBaseQuery({baseUrl:'http://localhost:3000'}),
  endpoints: (build)=>({
    addData: build.mutation({
      query: (userData)=>({
        url: '/login',
        method: 'POST',
        body: userData,
      }),
    }),
  }),   
});
export const {useAddDataMutation} = LoginService;
export default LoginService;