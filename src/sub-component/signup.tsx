import React, { useState } from "react";
import { EuiFlexGroup, EuiFlexItem, EuiText,  EuiLink,  } from "@elastic/eui";
import { useNavigate } from "react-router-dom";
import { useAddDataMutation } from "../services/signupService";
import { CommomButton } from "./button/commonButton";
import { CommonFieldText } from "./fieldtext/commonFieldText";


const SignUp:React.FC = () =>{
  const [username, setUsername] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [AddSignup] = useAddDataMutation();
  


   const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    
    if (value.length < 8) {
      setError("Password must be 8 letters");
    } else {
      setError("");
    }
  };
  
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return(
    <>
   <EuiFlexGroup className="signup-container">
    <EuiFlexItem className="signup-box">  
      
    <EuiFlexGroup justifyContent="center">
      <EuiFlexItem grow = {false}>
        <EuiText className="signup-font">Sign Up</EuiText>
      </EuiFlexItem>
    </EuiFlexGroup>

    <EuiFlexGroup alignItems="center">
      <EuiFlexItem grow = {false}>
        <EuiText className="form-label">Name:</EuiText>
      </EuiFlexItem>
      <EuiFlexItem>
        <CommonFieldText placeholder="Enter Username" value={username} onChange={(e: { target: { value: React.SetStateAction<string>; }; })=> setUsername(e.target.value)}/>
      </EuiFlexItem>
    </EuiFlexGroup>

    <EuiFlexGroup alignItems="center">
      <EuiFlexItem grow = {false}>
        <EuiText className="form-label">Email:</EuiText>
      </EuiFlexItem>
      <EuiFlexItem>
        <CommonFieldText placeholder="Enter email" value={email}
        
        onChange={(e: { target: { value: React.SetStateAction<string>; }; })=> setEmail(e.target.value)}/>
      </EuiFlexItem>
    </EuiFlexGroup>

    <EuiFlexGroup alignItems="center">
      <EuiFlexItem grow = {false}>
        <EuiText className="form-label">Password:</EuiText>
      </EuiFlexItem>
      <EuiFlexItem>
        <CommonFieldText placeholder="Enter password" value={password} type = {showPassword ? "text" : "password"} onChange={handlePasswordChange} />
        {error && <EuiText color="danger" size="xs">{error}</EuiText>}
          <button 
          type="button" onClick={togglePasswordVisibility}></button>
      </EuiFlexItem>
    </EuiFlexGroup>

    <EuiFlexGroup>
      <EuiFlexItem>
        <EuiText className="signup-text">Already have an account?
          <EuiLink onClick={()=> navigate('/login')}>Login</EuiLink>
        </EuiText>
      </EuiFlexItem>
    </EuiFlexGroup>

    <EuiFlexGroup>
      <EuiFlexItem className = "signup-button"grow = {false}>
        <CommomButton  title="Signup" onClick={handleSignup}/>
      </EuiFlexItem>      
    </EuiFlexGroup>  
    </EuiFlexItem>  
    </EuiFlexGroup>
    
    </>
  )
}
export default SignUp;