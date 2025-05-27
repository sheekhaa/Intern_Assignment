import React, { useState } from "react";
import { EuiFlexGroup, EuiFlexItem, EuiText,  EuiLink } from "@elastic/eui";
import { useNavigate } from "react-router-dom";
import { useAddDataMutation } from "../services/signupService";
import { CommomButton } from "./button/commonButton";
import { CommonFieldText } from "./fieldtext/commonFieldText";


const SignUp:React.FC = () =>{
  const [username, setUsername] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [AddSignup] = useAddDataMutation();


  const handleSignup = async(e:React.FormEvent)=>{
    e.preventDefault();

    try{
      const userData = {
        username: username.trim(),
        email: email.trim(),
        password: password.trim()
    };

      const response = await AddSignup(userData).unwrap(); //make API call
      console.log("signup done", response);
      setUsername('');
      setEmail('');
      setPassword('');
      navigate('/login');
    }catch (error){
      console.error("signup failed.", error);
    }   
  };


  return(
    <>
   <EuiFlexGroup className="signup-container">
    <EuiFlexItem className="signup-box">  
      
    <EuiFlexGroup justifyContent="center">
      <EuiFlexItem grow = {false}>
        <EuiText className="font">Sign Up</EuiText>
      </EuiFlexItem>
    </EuiFlexGroup>

    <EuiFlexGroup className="form-group" >
      <EuiFlexItem grow = {false}>
        <EuiText>Name:</EuiText>
      </EuiFlexItem>
      <EuiFlexItem>
        <CommonFieldText placeholder="Enter Username" value={username} onChange={(e: { target: { value: React.SetStateAction<string>; }; })=> setUsername(e.target.value)}/>
      </EuiFlexItem>
    </EuiFlexGroup>

    <EuiFlexGroup>
      <EuiFlexItem grow = {false}>
        <EuiText>Email:</EuiText>
      </EuiFlexItem>
      <EuiFlexItem>
        <CommonFieldText placeholder="Enter email" value={email} onChange={(e: { target: { value: React.SetStateAction<string>; }; })=> setEmail(e.target.value)}/>
      </EuiFlexItem>
    </EuiFlexGroup>

    <EuiFlexGroup>
      <EuiFlexItem grow = {false}>
        <EuiText>Password:</EuiText>
      </EuiFlexItem>
      <EuiFlexItem>
        <CommonFieldText placeholder="Enter password" value={password} onChange={(e: { target: { value: React.SetStateAction<string>; }; })=> setPassword(e.target.value)} />
      </EuiFlexItem>
    </EuiFlexGroup>

    <EuiFlexGroup>
      <EuiFlexItem>
        <EuiText>Already have an account?
          <EuiLink onClick={()=> navigate('/login')}>Login</EuiLink>
        </EuiText>
      </EuiFlexItem>
    </EuiFlexGroup>

    <EuiFlexGroup>
      <EuiFlexItem grow = {false}>
        <CommomButton  title="Signup" onClick={handleSignup}/>
      </EuiFlexItem>      
    </EuiFlexGroup>  
    </EuiFlexItem>  
    </EuiFlexGroup>
    
    </>
  )
}
export default SignUp;