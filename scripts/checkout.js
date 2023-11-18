import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
import {
  calculateCartQuantity,
  cart,
  deleteFromCart,
  updateQuantity,
} from "../data/cart.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { deliveryOptions } from "../data/deliveryOptions.js";

let cartSummaryHTML = "";

cart.forEach((cartItem) => {
  const productId = cartItem.productId;

  let matchingProduct;
  products.forEach((product) => {
    if (product.id === cartItem.productId) {
      matchingProduct = product;
    }
  });

  const deliveryOptionId = cartItem.deliveryOptionId;
  let DeliveryOption;
  deliveryOptions.forEach((option) => {
    if (option.deliveryId === deliveryOptionId) {
      DeliveryOption = option;
    }
  });

  const today = dayjs();
  const deliveryDate = today.add(DeliveryOption.deliveryDays, "day");
  const dateString = deliveryDate.format("dddd, MMMM D");

  cartSummaryHTML += `<div class="cart-item-container cart-item-container-${
    matchingProduct.id
  }">
<div class="delivery-date">Delivery date: ${dateString}</div>

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
      deliveryOption.deliveryId === cartItem.deliveryOptionId ? "checked" : "";

    html += `   <div class="delivery-option">
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
    const container = document.querySelector(
      `.cart-item-container-${productId}`
    );
    container.remove();
    updateCartQuantity();
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
    }
  });
});

function updateQuantityAndUI(productId, newQuantity) {
  if (newQuantity >= 0 && newQuantity <= 100) {
    updateQuantity(productId, newQuantity);

    const quantityLabel = document.querySelector(
      `.js-quantity-label-${productId}`
    );
    quantityLabel.innerHTML = newQuantity;

    updateCartQuantity();
  } else {
    alert("Value must be between 0-100");
  }
}

function updateCartQuantity() {
  const cartQuantity = calculateCartQuantity();
  document.querySelector(
    ".js-return-to-home-link"
  ).innerHTML = `${cartQuantity} items`;
}
updateCartQuantity();
