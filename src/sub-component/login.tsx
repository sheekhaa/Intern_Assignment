import React, { useState } from "react";
import { EuiFlexGroup, EuiFlexItem, EuiLink, EuiText } from "@elastic/eui";
import { useAddDataMutation } from "../services/loginService";
import { useNavigate} from "react-router-dom";
import { CommomButton } from "./button/commonButton";
import { CommonFieldText } from "./fieldtext/commonFieldText";

const Login: React.FC=()=>{
  const [username, setUsername] = useState('');
  const[password, setPassword] = useState('');
  const [error, setError] = useState("");
   const [showPassword, setShowPassword] = useState(false);
  const [AddLogin] = useAddDataMutation();
  const navigate = useNavigate(); 

  
     const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);
        
        if (value.length < 8) {
          setError("Password must be 8 letters");
        } else {
          setError("");
        }
      };

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
  };

   const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return(
    <>
    <EuiFlexGroup className="login-container">
      <EuiFlexItem className="login-box">
        <EuiFlexGroup justifyContent="center">
              <EuiFlexItem grow = {false}>
                <EuiText className="login-font">Login</EuiText>
              </EuiFlexItem>
            </EuiFlexGroup>

     <EuiFlexGroup justifyContent="center">
          <EuiFlexItem grow = {false}>
            <EuiText className="form-label">Name:</EuiText>
          </EuiFlexItem>
          <EuiFlexItem>
            <CommonFieldText
            placeholder="Enter username:"  value={username} onChange={(e: { target: { value: React.SetStateAction<string>; }; })=>setUsername(e.target.value)}/>
          </EuiFlexItem>
        </EuiFlexGroup>

        <EuiFlexGroup justifyContent="center">
          <EuiFlexItem grow = {false}>
            <EuiText className="form-label">Password:</EuiText>
          </EuiFlexItem>
          <EuiFlexItem>
          <CommonFieldText placeholder="Enter password" value={password} type= {showPassword ? "text" : "password"} onChange={handlePasswordChange}/>
          {error && <EuiText color="danger" size="xs">{error}</EuiText>}
            <button type="button" onClick={togglePasswordVisibility}></button>
          </EuiFlexItem>
        </EuiFlexGroup>

          <EuiFlexGroup>
      <EuiFlexItem>
        <EuiText className="signup-text">Go back to register an account?   
          <EuiLink onClick={()=> navigate('/')}> Signup</EuiLink>
        </EuiText>
      </EuiFlexItem>
    </EuiFlexGroup>

        <EuiFlexGroup >
          <EuiFlexItem grow = {false} className="login-button">
            <CommomButton title="Login" onClick={handleSubmit}/>
          </EuiFlexItem>          
        </EuiFlexGroup>
        </EuiFlexItem>
        </EuiFlexGroup>
    </>
  )
}
export default Login;