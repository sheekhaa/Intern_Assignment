import { configureStore } from "@reduxjs/toolkit";
import SignupService from "./services/signupService";
import LoginService from "./services/loginService";

const store = configureStore({
  reducer: {
    [SignupService.reducerPath]: SignupService.reducer,
    [LoginService.reducerPath]: LoginService.reducer
  },
  middleware: (getDefaultMiddleware)=>getDefaultMiddleware().concat(
    SignupService.middleware, LoginService.middleware)
})
export default store;