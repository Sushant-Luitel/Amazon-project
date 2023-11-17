import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
import {
  calculateCartQuantity,
  cart,
  deleteFromCart,
  updateQuantity,
} from "../data/cart.js";

let cartSummaryHTML = "";

cart.forEach((cartItem) => {
  const productId = cartItem.productId;

  let matchingProduct;
  products.forEach((product) => {
    if (product.id === cartItem.productId) {
      matchingProduct = product;
    }
  });

  cartSummaryHTML += `<div class="cart-item-container cart-item-container-${
    matchingProduct.id
  }">
<div class="delivery-date">Delivery date: Tuesday, June 21</div>

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
    <div class="delivery-option">
      <input
        type="radio"
        checked
        class="delivery-option-input"
        name="delivery-option-${matchingProduct.id}"
      />
      <div>
        <div class="delivery-option-date">Tuesday, June 21</div>
        <div class="delivery-option-price">FREE Shipping</div>
      </div>
    </div>
    <div class="delivery-option">
      <input
        type="radio"
        class="delivery-option-input"
        name="delivery-option-${matchingProduct.id}"
      />
      <div>
        <div class="delivery-option-date">Wednesday, June 15</div>
        <div class="delivery-option-price">$4.99 - Shipping</div>
      </div>
    </div>
    <div class="delivery-option">
      <input
        type="radio"
        class="delivery-option-input"
        name="delivery-option-${matchingProduct.id}"
      />
      <div>
        <div class="delivery-option-date">Monday, June 13</div>
        <div class="delivery-option-price">$9.99 - Shipping</div>
      </div>
    </div>
  </div>
</div>
</div>`;
});

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

// document.querySelectorAll(".save-quantity-link").forEach((link) => {
//   link.addEventListener("click", () => {
//     const productId = link.dataset.productId;
//     const container = document.querySelector(
//       `.cart-item-container-${productId}`
//     );
//     container.classList.remove("is-editing-quantity");
//     const inputElement = document.querySelector(
//       `.js-quantity-input-${productId}`
//     );

//     const newQuantity = Number(inputElement.value);

//     if (newQuantity >= 0 && newQuantity <= 100) {
//       updateQuantity(productId, newQuantity);

//       const quantityLabel = document.querySelector(
//         `.js-quantity-label-${productId}`
//       );
//       quantityLabel.innerHTML = newQuantity;
//       updateCartQuantity();
//     } else {
//       alert("!!Value must be between 0-100");
//     }
//   });
// });

function updateCartQuantity() {
  // let cartQuantity = 0;
  // cart.forEach((cartItem) => {
  //   cartQuantity += cartItem.quantity;
  // });
  const cartQuantity = calculateCartQuantity();
  document.querySelector(
    ".js-return-to-home-link"
  ).innerHTML = `${cartQuantity} items`;
}
updateCartQuantity();
