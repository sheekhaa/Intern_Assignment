import { configureStore } from "@reduxjs/toolkit";
import SignupService from "./services/signupService";
import LoginService from "./services/loginService";
import bookApi from "./services/bookApi";
import cartReducer from "./slices/cartSlice"


const store = configureStore({
  reducer: {
    [SignupService.reducerPath]: SignupService.reducer,
    [LoginService.reducerPath]: LoginService.reducer,
    [bookApi.reducerPath]: bookApi.reducer,
    cart:cartReducer, 
  },
  middleware: (getDefaultMiddleware)=>getDefaultMiddleware().concat(
    SignupService.middleware, LoginService.middleware, bookApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;