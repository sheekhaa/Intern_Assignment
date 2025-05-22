import { configureStore } from "@reduxjs/toolkit";
import SignupService from "./services/signupService";
import LoginService from "./services/loginService";
import bookApi from "./services/bookApi";


const store = configureStore({
  reducer: {
    [SignupService.reducerPath]: SignupService.reducer,
    [LoginService.reducerPath]: LoginService.reducer,
    [bookApi.reducerPath]: bookApi.reducer
  },
  middleware: (getDefaultMiddleware)=>getDefaultMiddleware().concat(
    SignupService.middleware, LoginService.middleware, bookApi.middleware)
})
export default store;