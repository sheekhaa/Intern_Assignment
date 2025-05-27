import React, { useState } from "react";
import { EuiFlexGroup, EuiFlexItem, EuiText } from "@elastic/eui";
import { useAddDataMutation } from "../services/loginService";
import { useNavigate} from "react-router-dom";
import { CommomButton } from "./button/commonButton";
import { CommonFieldText } from "./fieldtext/commonFieldText";

const Login: React.FC=()=>{
  const [username, setUsername] = useState('');
  const[password, setPassword] = useState('');
  const [AddLogin] = useAddDataMutation();
  const navigate = useNavigate(); 

  // const handleLogin = async()=>{
  //   try{
  //     const response = await AddLogin({username, password}).unwrap();
  //     localStorage.setItem('token', response.token)//store token
  //   }catch (err){
  //     console.error("Login failed", err);
  //   }
  // }


    const handleSubmit = async(e: React.FormEvent) =>{
    e.preventDefault();

    try{
      const userData = {
        username: username.trim(),
        password: password.trim()
      };
      const response = await AddLogin(userData).unwrap();
      console.log("Login successfully", response);
      localStorage.setItem("token", response.token);
      setUsername('');
      setPassword('');  
      navigate('/home');
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
            <CommonFieldText
            placeholder="Enter username:"  value={username} onChange={(e: { target: { value: React.SetStateAction<string>; }; })=>setUsername(e.target.value)}/>
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiFlexGroup>
          <EuiFlexItem grow = {false}>
            <EuiText>Password:</EuiText>
          </EuiFlexItem>
          <EuiFlexItem>
          <CommonFieldText placeholder="Enter password" value={password} onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setPassword(e.target.value)}/>
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiFlexGroup >
          <EuiFlexItem grow = {false}>
            <CommomButton title="Login" onClick={handleSubmit}/>
          </EuiFlexItem>
        </EuiFlexGroup>
    </>
  )
}
export default Login;