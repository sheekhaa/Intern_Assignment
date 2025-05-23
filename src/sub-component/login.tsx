import React, { useState } from "react";
import { EuiFlexGroup, EuiFlexItem, EuiText, EuiFieldText, EuiButton } from "@elastic/eui";
import { useAddDataMutation } from "../services/loginService";
const Login: React.FC=()=>{

  const [username, setUsername] = useState('');
  const[password, setPassword] = useState('');
  const [AddLogin] = useAddDataMutation();

  const handleLogin = async()=>{
    try{
      const response = await AddLogin({username, password}).unwrap();
      localStorage.setItem('token', response.token)//store token
    }catch (err){
      console.error("Login failed", err);
    }
  }


    const handleSubmit = async(e: React.FormEvent) =>{
    e.preventDefault();

    try{
      const userData = {
        username: username.trim(),
        password: password.trim()
      };
      const response = await AddLogin(userData).unwrap();
      console.log("Login successfully", response);
      setUsername('');
      setPassword('');  
    }catch(error){
      console.log("Login failed.", error);
    }   
  }
  return(
    <>
     <EuiFlexGroup>
          <EuiFlexItem grow = {false}>
            <EuiText>Name:</EuiText>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiFieldText
            placeholder="Enter username:"  value={username} onChange={(e)=>setUsername(e.target.value)}></EuiFieldText>
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiFlexGroup>
          <EuiFlexItem grow = {false}>
            <EuiText>Password:</EuiText>
          </EuiFlexItem>
          <EuiFlexItem>
          <EuiFieldText placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)}></EuiFieldText>
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiFlexGroup >
          <EuiFlexItem grow = {false}>
            <EuiButton onClick={handleSubmit}>Login</EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>
    </>
  )
}
export default Login;