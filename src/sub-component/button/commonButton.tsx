import { EuiButton } from "@elastic/eui";
import React from "react";

interface CommonButtonProps{
  type?: "button" | "reset" | "submit";
  color?: "primary" | "text" | "success" | "warning" | "neutral" | "risk";
  onClick?: any;
  title: string;
}
export const CommomButton:React.FC<CommonButtonProps>=({
  type,
  color,
  onClick, 
  title 

})=>{
  return(
    <div className="common-Button">
      <EuiButton color={color} onClick={onClick} type= {type} >{title}</EuiButton>
    </div>
  )
}