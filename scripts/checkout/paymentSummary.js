import { cart } from "../../data/cart.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import { getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
export function renderPaymentSummary() {
  let productsPrice = 0;
  let shippingPrice = 0;
  let cartQuantity = 0;
  cart.forEach((cartItem) => {
    const product = getProduct(cartItem.productId);
    productsPrice += product.priceCents * cartItem.quantity;

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    shippingPrice += deliveryOption.priceCents;
    cartQuantity += cartItem.quantity;
  });

  const totalBeforeTax = productsPrice + shippingPrice;
  const taxAmount = totalBeforeTax * 0.1;
  const orderTotal = totalBeforeTax + taxAmount;
  let paymentSummaryHTML = "";
  paymentSummaryHTML += `<div class="payment-summary-title">Order Summary</div>

  <div class="payment-summary-row">
    <div>Items (${cartQuantity}):</div>
    <div class="payment-summary-money">$${formatCurrency(productsPrice)}</div>
  </div>

  <div class="payment-summary-row">
    <div>Shipping &amp; handling:</div>
    <div class="payment-summary-money">$${formatCurrency(shippingPrice)}</div>
  </div>

  <div class="payment-summary-row subtotal-row">
    <div>Total before tax:</div>
    <div class="payment-summary-money">$${formatCurrency(totalBeforeTax)}</div>
  </div>

  <div class="payment-summary-row">
    <div>Estimated tax (10%):</div>
    <div class="payment-summary-money">$${formatCurrency(taxAmount)}</div>
  </div>

  <div class="payment-summary-row total-row">
    <div>Order total:</div>
    <div class="payment-summary-money">$${formatCurrency(orderTotal)}</div>
  </div>

  <button class="place-order-button button-primary">
    Place your order
  </button>`;

  document.querySelector(".js-payment-summary").innerHTML = paymentSummaryHTML;
}
