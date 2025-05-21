import React from "react";
import { EuiProvider } from "@elastic/eui";
import Login from './sub-component/login';
import SignUp from "./sub-component/signup";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App (){
  return(
     <EuiProvider colorMode="light">
      <Router>
    <Routes>           
       <Route path="/" element = {<SignUp/>}></Route> 
       <Route path="/login" element = {<Login/>}></Route>   
    </Routes>
    </Router>
     </EuiProvider>
  )
}
export default App;