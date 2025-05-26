import React from "react";
import { EuiProvider } from "@elastic/eui";
import Login from './sub-component/login';
import SignUp from "./sub-component/signup";
import HomePage from "./complex-component/homepage";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

function App (){
   const PrivateRoute = ({children}: {children: React.ReactNode})=>{
      const token = localStorage.getItem("token");
      return token ? <>{children}</>: <Navigate to = "/login" replace/>;
   }
  return(
     <EuiProvider colorMode="light">
      <Router>
    <Routes>           
       <Route path="/" element = {<SignUp/>}></Route> 
       <Route path="/login" element = {<Login/>}></Route>   
       <Route path="/home" element = {
         <PrivateRoute>
         <HomePage/>
         </PrivateRoute>
         }>
         </Route>
    </Routes>
    </Router>
     </EuiProvider>
  );
}
export default App;