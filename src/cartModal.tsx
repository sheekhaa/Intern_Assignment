import React from "react";
import {EuiModal, EuiModalHeader, EuiModalBody, EuiText, } from "@elastic/eui";
import { useSelector, TypedUseSelectorHook } from "react-redux";
import { RootState } from "./Store";

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

const CartModal = ({ onClose }: { onClose: () => void }) => {
  const cartItems = useAppSelector((state) => state.cart.items);

  return (
    <EuiModal onClose={onClose}>
      <EuiModalHeader>
        <EuiText><h2>Your Cart</h2></EuiText>
      </EuiModalHeader>

      <EuiModalBody>
        {cartItems.length === 0 ? (
          <EuiText><p>Your cart is empty.</p></EuiText>
        ) : (
          <EuiText>
            
              {cartItems.map((item) => (
                <li key={item.id}>
                  {item.title} {item.quantity} pcs
                </li>
              ))}
           
          </EuiText>
        )}
      </EuiModalBody>

     
    </EuiModal>
  );
};

export default CartModal;
