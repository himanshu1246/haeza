// Shopping Cart Logic for Haeza

let cart = JSON.parse(localStorage.getItem('haeza_cart')) || [];

function saveCart() {
  localStorage.setItem('haeza_cart', JSON.stringify(cart));
  updateCartBadge();
  renderCartDrawer();
}

function addToCart(product) {
  const existingItem = cart.find(item => item.id === product.id && (item.size || null) === (product.size || null));
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart();
  openCartDrawer();
}

function removeFromCart(productId, size) {
  cart = cart.filter(item => !(item.id === productId && (item.size || null) === (size || null)));
  saveCart();
}

function updateQuantity(productId, size, delta) {
  const item = cart.find(item => item.id === productId && (item.size || null) === (size || null));
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(productId, size);
    } else {
      saveCart();
    }
  }
}

function updateCartBadge() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const badge = document.querySelector('.cart-badge');
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

function renderCartDrawer() {
  const cartItemsContainer = document.querySelector('.cart-items');
  const cartTotal = document.querySelector('.cart-total-amount');
  
  if (!cartItemsContainer) return;

  cartItemsContainer.innerHTML = '';

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is empty.</p>';
    if (cartTotal) cartTotal.textContent = '₹0.00';
    return;
  }

  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;
    const sizeStr = item.size ? ` (Size: ${item.size})` : '';

    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    itemEl.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-details">
        <h4>${item.name}${sizeStr}</h4>
        <p>₹${item.price.toFixed(2)}</p>
        <div class="cart-item-actions">
          <button class="qty-btn minus" data-id="${item.id}" data-size="${item.size || ''}">-</button>
          <span>${item.quantity}</span>
          <button class="qty-btn plus" data-id="${item.id}" data-size="${item.size || ''}">+</button>
          <button class="remove-btn" data-id="${item.id}" data-size="${item.size || ''}">Remove</button>
        </div>
      </div>
    `;
    cartItemsContainer.appendChild(itemEl);
  });

  if (cartTotal) {
    cartTotal.textContent = '₹' + total.toFixed(2);
  }

  // Attach event listeners for dynamically created buttons
  document.querySelectorAll('.qty-btn.minus').forEach(btn => {
    btn.addEventListener('click', (e) => updateQuantity(e.target.dataset.id, e.target.dataset.size || null, -1));
  });
  document.querySelectorAll('.qty-btn.plus').forEach(btn => {
    btn.addEventListener('click', (e) => updateQuantity(e.target.dataset.id, e.target.dataset.size || null, 1));
  });
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => removeFromCart(e.target.dataset.id, e.target.dataset.size || null));
  });
}

function openCartDrawer() {
  document.querySelector('.cart-drawer').classList.add('open');
  document.querySelector('.cart-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
  document.querySelector('.cart-drawer').classList.remove('open');
  document.querySelector('.cart-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

function proceedToEnquiry() {
  if (cart.length === 0) return;
  
  let enquiryText = "Hi, I am interested in the following items:\\n\\n";
  cart.forEach(item => {
    const sizeStr = item.size ? ` [Size: ${item.size}]` : '';
    enquiryText += `- ${item.quantity}x ${item.name}${sizeStr} (₹${item.price.toFixed(2)} each)\\n`;
  });
  
  // Store the message temporarily in sessionStorage so the contact page can grab it
  sessionStorage.setItem('haeza_cart_enquiry', enquiryText);
  window.location.href = 'contact.html';
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  renderCartDrawer();

  // Attach Add to Cart listeners
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const product = {
        id: btn.dataset.id,
        name: btn.dataset.name,
        price: parseFloat(btn.dataset.price),
        image: btn.dataset.image
      };
      addToCart(product);
    });
  });

  // Cart Drawer toggles
  const cartIcon = document.querySelector('.cart-icon-wrapper');
  if (cartIcon) {
    cartIcon.addEventListener('click', (e) => {
      e.preventDefault();
      openCartDrawer();
    });
  }

  const cartCloseBtn = document.querySelector('.cart-close-btn');
  if (cartCloseBtn) {
    cartCloseBtn.addEventListener('click', closeCartDrawer);
  }

  const cartOverlay = document.querySelector('.cart-overlay');
  if (cartOverlay) {
    cartOverlay.addEventListener('click', closeCartDrawer);
  }

  const checkoutBtn = document.querySelector('.checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', proceedToEnquiry);
  }
});
