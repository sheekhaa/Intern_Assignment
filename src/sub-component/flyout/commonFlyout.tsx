import { EuiFlyout } from "@elastic/eui";
import React, { ReactNode } from "react";
interface CommonFlyoutProps{
  onClose: any;
  ownFocus: boolean;
  size: 'l' | 'm'| 's';
  arialabelledby?: any;
  children: ReactNode
}
export const CommonFlyout:React.FC<CommonFlyoutProps>=({
  onClose,
  ownFocus,
  size,
  arialabelledby,
  children

})=>{
  return(
    <>
    <EuiFlyout onClose = {onClose} ownFocus = {ownFocus} size = {size} aria-labelledby = {arialabelledby}>
      {children}
    </EuiFlyout>
    </>
  )
}