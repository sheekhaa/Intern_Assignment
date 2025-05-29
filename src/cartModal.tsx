import React from "react";
import {EuiModal, EuiModalBody, EuiText, } from "@elastic/eui";
import { useSelector, TypedUseSelectorHook } from "react-redux";
import { RootState } from "./Store";

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
const CartModal = ({ onClose }: { onClose: () => void }) => {
  const cartItems = useAppSelector((state) => state.cart.items);

  return (
    <EuiModal onClose={onClose}> 
      <EuiModalBody>
        {cartItems.length === 0 ? (
          <EuiText><p>Your cart is empty.</p></EuiText>
        ) : (
         <>
         </>
        )}
      </EuiModalBody>     
    </EuiModal>
  );
};

export default CartModal;
