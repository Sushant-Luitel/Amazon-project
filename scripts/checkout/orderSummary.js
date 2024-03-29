import { getProduct, products } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import {
  calculateCartQuantity,
  cart,
  deleteFromCart,
  updateDeliveryOption,
  updateQuantity,
} from "../../data/cart.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import deliveryOptions, {
  getDeliveryOption,
} from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";
import { renderCheckoutHeader } from "./checkoutheader.js";

export function renderOrderSummary() {
  let cartSummaryHTML = "";

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    const matchingProduct = getProduct(productId);

    // const deliveryOptionId = cartItem.deliveryOptionId;
    // let deliveryOption;

    // deliveryOptions.forEach((option) => {
    //   if (option.id === deliveryOptionId) {
    //     deliveryOption = option;
    //   }
    // });

    // const today = dayjs();

    // const deliveryDate = today.add(deliveryOption?.deliveryDays || "1", "day");
    // const dateString = deliveryDate.format("dddd, MMMM D");

    const deliveryId = cartItem.deliveryOptionId;
    const deliveryOption = getDeliveryOption(deliveryId);

    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
    const dateString = deliveryDate.format("dddd, MMMM D");

    cartSummaryHTML += `<div class="cart-item-container cart-item-container-${
      matchingProduct.id
    }">
<div class="delivery-date">Delivery date:${dateString} </div>

<div class="cart-item-details-grid">
  <img
    class="product-image"
    src="${matchingProduct.image}"
  />

  <div class="cart-item-details">
    <div class="product-name">
      ${matchingProduct.name}
    </div>
    <div class="product-price">$${formatCurrency(
      matchingProduct.priceCents
    )}</div>
    <div class="product-quantity">
      <span class="quantity-text"> Quantity: <span class="quantity-label js-quantity-label-${
        matchingProduct.id
      }">${cartItem.quantity}</span> </span>
      <span class="update-quantity-link link-primary js-update-quantity-link" data-product-id='${
        matchingProduct.id
      }'>
        Update
      </span><input class="quantity-input js-quantity-input-${
        matchingProduct.id
      }"></input><span class="save-quantity-link link-primary" data-product-id='${
      matchingProduct.id
    }'>Save</span>
      <span class="delete-quantity-link link-primary js-delete-link" data-product-id='${
        matchingProduct.id
      }'>
        Delete
      </span>
    </div>
  </div>

  <div class="delivery-options">
    <div class="delivery-options-title">
      Choose a delivery option:
    </div>
 ${deliveryOptionsHTML(matchingProduct, cartItem)}
  </div>
</div>
</div>`;
  });

  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = "";
    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today.add(deliveryOption.deliveryDays, "day");
      const dateString = deliveryDate.format("dddd, MMMM D");

      const priceString =
        deliveryOption.priceCents === 0
          ? "FREE"
          : "$" + formatCurrency(deliveryOption.priceCents);

      const isChecked =
        deliveryOption.id === cartItem.deliveryOptionId ? "checked" : "";

      html += `   <div class="delivery-option js-delivery-option" data-product-id="${matchingProduct.id}" 
    data-delivery-option-id="${deliveryOption.id}">
  <input
    type="radio"
  ${isChecked}
    class="delivery-option-input"
    name="delivery-option-${matchingProduct.id}"
  />
  <div>
    <div class="delivery-option-date">${dateString}</div>
    <div class="delivery-option-price">${priceString} Shipping</div>
  </div>
</div>`;
    });
    return html;
  }

  document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

  document.querySelectorAll(".js-delete-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      deleteFromCart(productId);
      renderCheckoutHeader();
      renderOrderSummary();
      renderPaymentSummary();
    });
  });

  document.querySelectorAll(".js-update-quantity-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      const container = document.querySelector(
        `.cart-item-container-${productId}`
      );
      container.classList.add("is-editing-quantity");
    });
  });

  document.querySelectorAll(".save-quantity-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      const container = document.querySelector(
        `.cart-item-container-${productId}`
      );
      container.classList.remove("is-editing-quantity");

      const inputElement = document.querySelector(
        `.js-quantity-input-${productId}`
      );
      const newQuantity = Number(inputElement.value);

      updateQuantityAndUI(productId, newQuantity);

      renderOrderSummary();
      renderPaymentSummary();
    });

    // Add keypress event listener to the input field
    const inputElement = document.querySelector(
      `.js-quantity-input-${link.dataset.productId}`
    );
    inputElement.addEventListener("keypress", (event) => {
      // Check if the pressed key is Enter (key code 13)
      if (event.key === "Enter") {
        const productId = link.dataset.productId;
        const newQuantity = Number(inputElement.value);
        const container = document.querySelector(
          `.cart-item-container-${productId}`
        );
        container.classList.remove("is-editing-quantity");
        updateQuantityAndUI(productId, newQuantity);

        renderOrderSummary();
        renderPaymentSummary();
      }
    });
  });

  function updateQuantityAndUI(productId, newQuantity) {
    if (newQuantity >= 0 && newQuantity <= 100) {
      updateQuantity(productId, newQuantity);
      renderCheckoutHeader();
    } else {
      alert("Value must be between 0-100");
    }
  }

  document.querySelectorAll(".js-delivery-option").forEach((element) => {
    element.addEventListener("click", () => {
      const { productId, deliveryOptionId } = element.dataset;

      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
}
