import React from "react";
import { EuiFieldText, IconType } from "@elastic/eui";

interface CommonFieldTextProps{
  placeholder?: string ;
  icon?: IconType;
  onChange: any;
  value: string | number ; 
  

}
export const CommonFieldText: React.FC<CommonFieldTextProps>=({
  placeholder,
  icon,
  onChange,
  value,

})=>{
  return(
    <>
      <EuiFieldText placeholder = {placeholder} icon = {icon} onChange = {onChange} value = {value}>
        </EuiFieldText> 
    </>
  )
}