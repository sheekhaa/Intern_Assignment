import React, { useState } from "react";
import { EuiFlexGroup, EuiFlexItem, EuiText, EuiFieldText, EuiButton, EuiLink } from "@elastic/eui";
import { useNavigate } from "react-router-dom";
import { useAddDataMutation } from "../services/signupService";

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
   
    <EuiFlexItem className="header">  
    <EuiFlexGroup className="sign-up">
      <EuiFlexItem>
        <EuiText>Sign Up</EuiText>
      </EuiFlexItem>
    </EuiFlexGroup>
    <EuiFlexGroup>
      <EuiFlexItem grow = {false}>
        <EuiText>Name:</EuiText>
      </EuiFlexItem>
      <EuiFlexItem>
        <EuiFieldText placeholder="Enter Username" value={username} onChange={(e)=> setUsername(e.target.value)}></EuiFieldText>
      </EuiFlexItem>
    </EuiFlexGroup>

    <EuiFlexGroup>
      <EuiFlexItem grow = {false}>
        <EuiText>Email:</EuiText>
      </EuiFlexItem>
      <EuiFlexItem>
        <EuiFieldText placeholder="Enter email" value={email} onChange={(e)=> setEmail(e.target.value)}></EuiFieldText>
      </EuiFlexItem>
    </EuiFlexGroup>

    <EuiFlexGroup>
      <EuiFlexItem grow = {false}>
        <EuiText>Password:</EuiText>
      </EuiFlexItem>
      <EuiFlexItem>
        <EuiFieldText placeholder="Enter password" value={password} onChange={(e)=> setPassword(e.target.value)} required></EuiFieldText>
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
        <EuiButton onClick={handleSignup}>Signup</EuiButton>
      </EuiFlexItem>      
    </EuiFlexGroup>  
    </EuiFlexItem>  
    
    </>
  )
}
export default SignUp;