import React from "react";
import { EuiFieldText, IconType } from "@elastic/eui";

interface CommonFieldTextProps{
  placeholder?: string ;
  icon?: IconType;
  onChange: any;
  value: string | number ; 
  type?: string
  isInvalid?: boolean;
  error?: string

}
export const CommonFieldText: React.FC<CommonFieldTextProps>=({
  placeholder,
  icon,
  onChange,
  value,
  type,
  isInvalid,
  error,

})=>{
  return(
    <>
      <EuiFieldText placeholder = {placeholder} icon = {icon} onChange = {onChange} value = {value} type={type}
      isInvalid = {isInvalid} >
        </EuiFieldText> 
    </>
  )
}