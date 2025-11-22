# TODO: Implement Checkout Flow on Cart Screen

- [ ] Convert CartScreen from StatelessWidget to StatefulWidget
- [ ] Add selectedPaymentMethod state variable (String?)
- [ ] Modify checkout button logic:
  - If selectedPaymentMethod is null, show "Proceed to Checkout" button
  - If selectedPaymentMethod is not null, show "Place Order" button
- [ ] Update _showPaymentOptionsDialog to set selectedPaymentMethod on selection
- [ ] Ensure Place Order logic only executes when payment method is selected
- [ ] Test the checkout flow
