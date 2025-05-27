import { EuiConfirmModal } from "@elastic/eui";
import React, { ReactNode } from "react";
interface CommonModalProps{
  title: ReactNode;
  style?: any;
  children?: ReactNode;
  titleProps?: any;
  onConfirm: any;
  onCancel: any;
  cancelButtonText: ReactNode;
  confirmButtonText: ReactNode;
  defaultFocusedButton: "cancel" | "confirm"
  buttonColor? : "primary" | "text" | "accent" | "accentSecondary" | "success" | "warning" | "danger" | "neutral" | "risk"

}
export const CommonModal: React.FC<CommonModalProps>=({
  title,
  style,
  children,
  titleProps,
  onConfirm,
  onCancel,
  cancelButtonText,
  confirmButtonText,
  defaultFocusedButton,
  buttonColor

})=>{
  return(
    <>
    <EuiConfirmModal title = {title} style={style}  titleProps={titleProps} onConfirm={onConfirm} onCancel={onCancel} cancelButtonText = {cancelButtonText} confirmButtonText = {confirmButtonText} defaultFocusedButton = {defaultFocusedButton} buttonColor={buttonColor}>
    {children}
    </EuiConfirmModal>
    </>
  )
}