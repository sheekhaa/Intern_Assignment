import React from "react";
import {
  EuiModal,
  EuiModalHeader,
  EuiModalBody,
  EuiModalFooter,
  EuiButton,
  EuiText,
  EuiSpacer,
  EuiTable,
  EuiTableHeader,
  EuiTableHeaderCell,
  EuiTableBody,
  EuiTableRow,
  EuiTableRowCell,
  EuiFieldNumber,
} from "@elastic/eui";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { RootState, AppDispatch } from "./Store";
import { removeFromCart, updateQuantity } from "./slices/cart/cartSlice";


// Define typed hooks inline
const useAppDispatch: () => AppDispatch = useDispatch;
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

const CartModal = ({ onClose }: { onClose: () => void }) => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  const handleQuantityChange = (bookId: string, quantity: number) => {
    dispatch(updateQuantity({ id: bookId, quantity }));
  };

  const handleRemove = (bookId: string) => {
    dispatch(removeFromCart(bookId));
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <EuiModal onClose={onClose}>
      <EuiModalHeader>
        <EuiText><h2>Shopping Cart</h2></EuiText>
      </EuiModalHeader>

      <EuiModalBody>
        {cartItems.length === 0 ? (
          <EuiText><p>Your cart is empty.</p></EuiText>
        ) : (
          <>
            <EuiTable>
              <EuiTableHeader>
                <EuiTableHeaderCell>Title</EuiTableHeaderCell>
                <EuiTableHeaderCell>Author</EuiTableHeaderCell>
                <EuiTableHeaderCell>Price</EuiTableHeaderCell>
                <EuiTableHeaderCell>Qty</EuiTableHeaderCell>
                <EuiTableHeaderCell>Total</EuiTableHeaderCell>
                <EuiTableHeaderCell>Action</EuiTableHeaderCell>
              </EuiTableHeader>

              <EuiTableBody>
                {cartItems.map((item) => (
                  <EuiTableRow key={item.id}>
                    <EuiTableRowCell>{item.title}</EuiTableRowCell>
                    <EuiTableRowCell>{item.author}</EuiTableRowCell>
                    <EuiTableRowCell>${item.price.toFixed(2)}</EuiTableRowCell>
                    <EuiTableRowCell>
                      <EuiFieldNumber
                        value={item.quantity}
                        min={1}
                        onChange={(e) =>
                          handleQuantityChange(item.id, parseInt(e.target.value))
                        }
                      />
                    </EuiTableRowCell>
                    <EuiTableRowCell>
                      ${(item.price * item.quantity).toFixed(2)}
                    </EuiTableRowCell>
                    <EuiTableRowCell>
                      <EuiButton
                        size="s"
                        color="danger"
                        onClick={() => handleRemove(item.id)}
                      >
                        Remove
                      </EuiButton>
                    </EuiTableRowCell>
                  </EuiTableRow>
                ))}
              </EuiTableBody>
            </EuiTable>

            <EuiSpacer />
            <EuiText>
              <strong>Subtotal: ${totalPrice.toFixed(2)}</strong>
            </EuiText>
          </>
        )}
      </EuiModalBody>

      <EuiModalFooter>
        <EuiButton onClick={onClose}>Close</EuiButton>
        <EuiButton fill disabled={cartItems.length === 0}>
          Proceed to Checkout
        </EuiButton>
      </EuiModalFooter>
    </EuiModal>
  );
};

export default CartModal;
