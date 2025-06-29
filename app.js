/**
 * Main Application Script
 * Enhanced with login section in top-right corner
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded, initializing script...');
  console.log('Current page:', window.location.pathname);

  // Initialize cart, user, orders, address, and payment options
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
  let userOrders = JSON.parse(localStorage.getItem('userOrders')) || [];
  let userAddress = JSON.parse(localStorage.getItem('userAddress')) || null;
  let savedPayments = JSON.parse(localStorage.getItem('savedPayments')) || [];

  // Initialize Stripe (only for checkout.html)
  const stripe = typeof Stripe !== 'undefined' ? Stripe('pk_test_51J9Z5zK1m2X3Y4Z5W6A7B8C9D0E1F2G3H4I5J6K7L8M9N0O1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4C5D6E7F8G9H0I') : null;
  const elements = stripe ? stripe.elements() : null;
  const cardElement = elements ? elements.create('card') : null;

  // Update cart count in navbar
  const updateCartCount = () => {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    console.log(`Updating cart count: ${cartCount}`);
    const cartLinks = document.querySelectorAll('.nav-link[href="cart.html"]');
    cartLinks.forEach(link => {
      link.innerHTML = `Cart (${cartCount})`;
    });
  };

  // Save cart to localStorage
  const saveCart = () => {
    console.log('Saving cart to localStorage:', cart);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
  };

  // Add item to cart
  const addToCart = (productName, price) => {
    console.log(`Adding to cart: ${productName}, Price: ${price}`);
    const existingItem = cart.find(item => item.name === productName);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ name: productName, price: price, quantity: 1 });
    }
    saveCart();
    showNotification(`${productName} added to cart!`);
  };

  // Remove item from cart
  const removeFromCart = (productName) => {
    console.log(`Removing from cart: ${productName}`);
    cart = cart.filter(item => item.name !== productName);
    saveCart();
    displayCart();
  };

  // Update item quantity
  const updateCartItemQuantity = (productName, change) => {
    console.log(`Updating quantity for ${productName} by ${change}`);
    const item = cart.find(item => item.name === productName);
    if (item) {
      item.quantity += change;
      if (item.quantity <= 0) {
        removeFromCart(productName);
      } else {
        saveCart();
        displayCart();
      }
    }
  };

  // Clear entire cart
  const clearCart = () => {
    console.log('Clearing cart');
    cart = [];
    saveCart();
    displayCart();
  };

  // Display cart items (for cart.html)
  const displayCart = () => {
    const cartContainer = document.querySelector('.cart-container');
    if (!cartContainer) {
      console.log('Cart container not found, likely not on cart.html');
      return;
    }

   if (cart.length === 0) {
  cartContainer.innerHTML = `
    <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 50vh;
      text-align: center;
    ">
      <div>
        <h2 style="font-size: 2rem; margin-bottom: 1rem; color: #4d3951;">Your Cart</h2>
        <p style="font-size: 1.3rem; margin-bottom: 1rem; color: #7d657e;">Your cart is empty.</p>
        <button class="btn clear-cart-btn" style="margin: 0.5rem;">Clear Cart</button>
      </div>
    </div>
  `;


      const checkoutBtn = document.querySelector('.checkout-btn');
      if (checkoutBtn) checkoutBtn.style.display = 'none';
      return;
    }

    let total = 0;
    cartContainer.innerHTML = `
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 1rem;">
        <thead>
          <tr>
            <th style="padding: 0.75rem; text-align: left;">Product</th>
            <th style="padding: 0.75rem; text-align: left;">Price</th>
            <th style="padding: 0.75rem; text-align: left;">Quantity</th>
            <th style="padding: 0.75rem; text-align: left;">Total</th>
            <th style="padding: 0.75rem; text-align: left;">Action</th>
          </tr>
        </thead>
        <tbody>
          ${cart.map(item => {
            const itemTotal = (item.price * item.quantity).toFixed(2);
            total += parseFloat(itemTotal);
            return `
              <tr>
                <td style="padding: 0.75rem;">${item.name}</td>
                <td style="padding: 0.75rem;">$${item.price.toFixed(2)}</td>
                <td style="padding: 0.75rem;">
                  <button class="btn quantity-btn minus-btn" data-name="${item.name}" aria-label="Decrease quantity of ${item.name}">-</button>
                  ${item.quantity}
                  <button class="btn quantity-btn plus-btn" data-name="${item.name}" aria-label="Increase quantity of ${item.name}">+</button>
                </td>
                <td style="padding: 0.75rem;">$${itemTotal}</td>
                <td style="padding: 0.75rem;">
                  <button class="btn remove-btn" data-name="${item.name}" aria-label="Remove ${item.name} from cart">Remove</button>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" style="padding: 0.75rem; text-align: right; font-weight: 600;">Total:</td>
            <td style="padding: 0.75rem;">$${total.toFixed(2)}</td>
            <td style="padding: 0.75rem;"></td>
          </tr>
        </tfoot>
      </table>
    `;
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) checkoutBtn.style.display = 'inline-block';

    document.querySelectorAll('.remove-btn').forEach(button => {
      button.addEventListener('click', () => {
        const productName = button.getAttribute('data-name');
        console.log(`Remove button clicked for: ${productName}`);
        removeFromCart(productName);
      });
    });

    document.querySelectorAll('.plus-btn').forEach(button => {
      button.addEventListener('click', () => {
        const productName = button.getAttribute('data-name');
        console.log(`Plus button clicked for: ${productName}`);
        updateCartItemQuantity(productName, 1);
      });
    });

    document.querySelectorAll('.minus-btn').forEach(button => {
      button.addEventListener('click', () => {
        const productName = button.getAttribute('data-name');
        console.log(`Minus button clicked for: ${productName}`);
        updateCartItemQuantity(productName, -1);
      });
    });
  };

  // Display cart summary (for checkout.html)
  const displayCartSummary = () => {
    const summaryContainer = document.querySelector('#cart-summary-content');
    if (!summaryContainer) {
      console.log('Cart summary container not found, likely not on checkout.html');
      return;
    }

    if (cart.length === 0) {
  cartContainer.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 300px; text-align: center;">
      <p style="font-size: 1.3rem; margin-bottom: 1rem; color: #7d657e;">Your cart is empty.</p>
      <button class="btn clear-cart-btn" style="margin: 0.5rem;">Clear Cart</button>
      <button class="btn checkout-btn" style="margin: 0.5rem;">Proceed to Checkout</button>
    </div>
  `;

  // Rebind event listeners for the buttons
  document.querySelector('.clear-cart-btn')?.addEventListener('click', clearCart);
  document.querySelector('.checkout-btn')?.addEventListener('click', handleCheckout);

  return;
}


    let total = 0;
    summaryContainer.innerHTML = `
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 1rem;">
        <thead>
          <tr>
            <th style="padding: 0.75rem; text-align: left;">Product</th>
            <th style="padding: 0.75rem; text-align: left;">Price</th>
            <th style="padding: 0.75rem; text-align: left;">Quantity</th>
            <th style="padding: 0.75rem; text-align: left;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${cart.map(item => {
            const itemTotal = (item.price * item.quantity).toFixed(2);
            total += parseFloat(itemTotal);
            return `
              <tr>
                <td style="padding: 0.75rem;">${item.name}</td>
                <td style="padding: 0.75rem;">$${item.price.toFixed(2)}</td>
                <td style="padding: 0.75rem;">${item.quantity}</td>
                <td style="padding: 0.75rem;">$${itemTotal}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" style="padding: 0.75rem; text-align: right; font-weight: 600;">Total:</td>
            <td style="padding: 0.75rem;">$${total.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
    `;
  };

  // Show notification
  const showNotification = (message) => {
    console.log('Showing notification:', message);
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  // Product descriptions
  const productDescriptions = {
    'CACAO LUXE': 'Indulge in the rich, velvety essence of our premium cacao blend, crafted for true chocolate lovers.',
    'MAJESTIC HORIZON': 'A refreshing fragrance inspired by open skies and serene landscapes, perfect for any occasion.',
    'NIOR ESSENCE': 'A bold and sophisticated scent with notes of amber and spice, designed for the modern individual.',
    'SYLVAN GRACE': 'A delicate, floral aroma that captures the elegance of nature in every spritz.'
  };

  // Show product modal
  const showProductModal = (productName) => {
    console.log(`Showing modal for: ${productName}`);
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-btn" aria-label="Close modal">×</span>
        <strong>${productName}</strong>
        <p>${productDescriptions[productName] || 'No description available.'}</p>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('.close-btn').addEventListener('click', () => {
      modal.classList.add('hidden');
      setTimeout(() => modal.remove(), 300);
    });
  };

  // Show profile modal
  const showProfileModal = () => {
    console.log('Showing profile modal');
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-btn" aria-label="Close modal">×</span>
        <h3>Your Profile</h3>
        <p><strong>Name:</strong> ${currentUser.name || 'N/A'}</p>
        <p><strong>Email:</strong> ${currentUser.email}</p>
      </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('.close-btn').addEventListener('click', () => {
      modal.classList.add('hidden');
      setTimeout(() => modal.remove(), 300);
    });
  };

  // Show orders modal
  const showOrdersModal = () => {
    console.log('Showing orders modal');
    const modal = document.createElement('div');
    modal.className = 'modal';
    let ordersHtml = userOrders.length > 0 ? `
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 1rem;">
        <thead>
          <tr>
            <th style="padding: 0.75rem; text-align: left;">Order ID</th>
            <th style="padding: 0.75rem; text-align: left;">Items</th>
            <th style="padding: 0.75rem; text-align: left;">Total</th>
            <th style="padding: 0.75rem; text-align: left;">Date</th>
          </tr>
        </thead>
        <tbody>
          ${userOrders.map(order => `
            <tr>
              <td style="padding: 0.75rem;">${order.id}</td>
              <td style="padding: 0.75rem;">${order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}</td>
              <td style="padding: 0.75rem;">$${order.total.toFixed(2)}</td>
              <td style="padding: 0.75rem;">${order.date}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    ` : '<p>No orders found.</p>';
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-btn" aria-label="Close modal">×</span>
        <h3>Your Orders</h3>
        ${ordersHtml}
      </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('.close-btn').addEventListener('click', () => {
      modal.classList.add('hidden');
      setTimeout(() => modal.remove(), 300);
    });
  };

  // Show manage address modal
  const showAddressModal = () => {
    console.log('Showing address modal');
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-btn" aria-label="Close modal">×</span>
        <h3>Manage Address</h3>
        <form id="address-form">
          <label for="address">Address:</label>
          <textarea id="address" name="address" rows="4" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 8px;">${userAddress ? userAddress.address : ''}</textarea>
          <button type="submit" class="btn">Save Address</button>
        </form>
      </div>
    `;
    document.body.appendChild(modal);
    const addressForm = modal.querySelector('#address-form');
    addressForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const address = addressForm.querySelector('#address').value.trim();
      if (address) {
        userAddress = { address };
        localStorage.setItem('userAddress', JSON.stringify(userAddress));
        showNotification('Address saved successfully!');
        modal.classList.add('hidden');
        setTimeout(() => modal.remove(), 300);
      } else {
        showNotification('Please enter a valid address.');
      }
    });
    modal.querySelector('.close-btn').addEventListener('click', () => {
      modal.classList.add('hidden');
      setTimeout(() => modal.remove(), 300);
    });
  };

  // Show saved payment options modal
  const showPaymentsModal = () => {
    console.log('Showing payments modal');
    const modal = document.createElement('div');
    modal.className = 'modal';
    let paymentsHtml = savedPayments.length > 0 ? `
      <ul style="list-style: none; padding: 0;">
        ${savedPayments.map(payment => `
          <li style="padding: 0.5rem 0;">Card ending in ${payment.cardNumber} (Expires: ${payment.expiry})</li>
        `).join('')}
      </ul>
    ` : '<p>No saved payment options.</p>';
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-btn" aria-label="Close modal">×</span>
        <h3>Saved Payment Options</h3>
        ${paymentsHtml}
      </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('.close-btn').addEventListener('click', () => {
      modal.classList.add('hidden');
      setTimeout(() => modal.remove(), 300);
    });
  };

  // Update login section
  const updateLoginSection = () => {
    const loginSections = document.querySelectorAll('.login-section');
    loginSections.forEach(section => {
      console.log('Updating login section, user:', currentUser ? 'Logged in' : 'Logged out');
      if (currentUser) {
        section.innerHTML = `
          <div class="dropdown">
            <button class="btn login-btn">Hi, ${currentUser.name || currentUser.email}</button>
            <div class="dropdown-content">
              <a href="#" class="dropdown-item profile-btn">Your Profile</a>
              <a href="#" class="dropdown-item orders-btn">Your Orders</a>
              <a href="#" class="dropdown-item address-btn">Manage Address</a>
              <a href="#" class="dropdown-item payments-btn">Saved Payment Options</a>
              <a href="#logout" class="dropdown-item logout-btn">Logout</a>
            </div>
          </div>
        `;
        section.querySelector('.profile-btn').addEventListener('click', (e) => {
          e.preventDefault();
          showProfileModal();
        });
        section.querySelector('.orders-btn').addEventListener('click', (e) => {
          e.preventDefault();
          showOrdersModal();
        });
        section.querySelector('.address-btn').addEventListener('click', (e) => {
          e.preventDefault();
          showAddressModal();
        });
        section.querySelector('.payments-btn').addEventListener('click', (e) => {
          e.preventDefault();
          showPaymentsModal();
        });
        section.querySelector('.logout-btn').addEventListener('click', handleLogout);
      } else {
  section.innerHTML = `
    <div class="dropdown">
      <button class="btn login-btn">Login / Register</button>
      <div class="dropdown-content">
        <a href="login.html" class="dropdown-item">Login</a>
        <a href="register.html" class="dropdown-item">Register</a>
      </div>
    </div>
  `;
}
    });
  };

  // Handle login form
  const handleLogin = (e) => {
    e.preventDefault();
    const email = document.querySelector('#login-email')?.value.trim();
    const password = document.querySelector('#login-password')?.value.trim();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      showNotification('Please enter a valid email.');
      return;
    }
    if (!password || password.length < 6) {
      showNotification('Password must be at least 6 characters.');
      return;
    }

    currentUser = { email };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    showNotification('Login successful!');
    updateLoginSection();
    setTimeout(() => window.location.href = 'index.html', 1000);
  };

  // Handle registration form
  const handleRegister = (e) => {
    e.preventDefault();
    const name = document.querySelector('#register-name')?.value.trim();
    const email = document.querySelector('#register-email')?.value.trim();
    const password = document.querySelector('#register-password')?.value.trim();

    if (!name) {
      showNotification('Please enter your name.');
      return;
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      showNotification('Please enter a valid email.');
      return;
    }
    if (!password || password.length < 6) {
      showNotification('Password must be at least 6 characters.');
      return;
    }

    currentUser = { name, email };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    showNotification('Registration successful!');
    updateLoginSection();
    setTimeout(() => window.location.href = 'index.html', 1000);
  };

  // Handle logout
  const handleLogout = () => {
    console.log('Logging out');
    currentUser = null;
    localStorage.removeItem('currentUser');
    showNotification('Logged out successfully!');
    updateLoginSection();
    setTimeout(() => window.location.href = 'index.html', 1000);
  };

  // Handle checkout with mock order creation
  const handleCheckout = () => {
    console.log('Proceed to checkout clicked');
    if (cart.length === 0) {
      showNotification('Your cart is empty.');
      return;
    }
    if (!currentUser) {
      showNotification('Please log in to proceed to checkout.');
      setTimeout(() => window.location.href = 'login.html', 1000);
      return;
    }
    window.location.href = 'checkout.html';
  };

  // Initialize payment form
  const initializePaymentForm = () => {
    const paymentForm = document.querySelector('#payment-form');
    if (!paymentForm || !cardElement) {
      console.log('Payment form or card element not found');
      return;
    }

    cardElement.mount('#card-element');
    console.log('Stripe card element mounted');

    paymentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      console.log('Payment form submitted');

      if (!currentUser) {
        showNotification('Please log in to complete payment.');
        setTimeout(() => window.location.href = 'login.html', 1000);
        return;
      }

      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
      userOrders.push({
        id: `ORD${Date.now()}`,
        items: [...cart],
        total: parseFloat(total),
        date: new Date().toLocaleDateString()
      });
      savedPayments.push({
        cardNumber: '**** **** **** 1234',
        expiry: '12/26'
      });
      localStorage.setItem('userOrders', JSON.stringify(userOrders));
      localStorage.setItem('savedPayments', JSON.stringify(savedPayments));
      showNotification(`Processing payment of $${total}...`);

      // Mock payment success
      setTimeout(() => {
        showNotification('Payment successful! Order placed.');
        clearCart();
        setTimeout(() => window.location.href = 'index.html', 2000);
      }, 2000);
    });

    cardElement.on('change', (event) => {
      const displayError = document.getElementById('card-errors');
      if (displayError) {
        displayError.textContent = event.error ? event.error.message : '';
      }
    });
  };

  // Initialize button event listeners with retry
  const initializeButtons = (attempt = 1, maxAttempts = 15) => {
    if (!window.location.pathname.includes('products.html')) {
      console.log('Not on products.html, skipping button initialization');
      return;
    }

    console.log(`Attempt ${attempt} to initialize buttons...`);
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    console.log(`Found ${addToCartButtons.length} Add to Cart buttons`);

    if (addToCartButtons.length > 0) {
      addToCartButtons.forEach((button, index) => {
        const parent = button.parentElement;
        console.log(`Add to Cart button ${index + 1} parent:`, parent.className);
      });
    }

    if (addToCartButtons.length === 0 && attempt < maxAttempts) {
      console.warn(`No .add-to-cart buttons found, retrying (${attempt}/${maxAttempts})...`);
      setTimeout(() => initializeButtons(attempt + 1, maxAttempts), 1500);
      return;
    }

    if (addToCartButtons.length === 0) {
      console.error('Error: No .add-to-cart buttons found after all retries');
      showNotification('Error: Add to Cart buttons not found. Please check the page.');
      return;
    }

    addToCartButtons.forEach((button, index) => {
      console.log(`Binding event listener to Add to Cart button ${index + 1}`);
      button.addEventListener('click', () => {
        console.log(`Add to Cart button ${index + 1} clicked`);
        const productCard = button.closest('.product-card');
        if (!productCard) {
          console.error(`Error: Product card not found for button ${index + 1}`);
          showNotification('Error: Unable to add item to cart.');
          return;
        }
        const productName = productCard.querySelector('h3')?.textContent;
        const priceText = productCard.querySelector('p')?.textContent.replace('$', '');
        if (!productName || !priceText) {
          console.error('Error: Product name or price not found in product card');
          showNotification('Error: Unable to add item to cart.');
          return;
        }
        const price = parseFloat(priceText);
        if (isNaN(price)) {
          console.error('Error: Invalid price format:', priceText);
          showNotification('Error: Invalid price format.');
          return;
        }
        addToCart(productName, price);
      });
    });

    const viewProductButtons = document.querySelectorAll('.view-product');
    console.log(`Found ${viewProductButtons.length} View Product buttons`);
    viewProductButtons.forEach((button, index) => {
      console.log(`Binding event listener to View Product button ${index + 1}`);
      button.addEventListener('click', () => {
        console.log(`View Product button ${index + 1} clicked`);
        const productCard = button.closest('.product-card');
        const productName = productCard.querySelector('h3')?.textContent;
        if (productName) {
          showProductModal(productName);
        } else {
          console.error('Error: Product name not found for View button');
          showNotification('Error: Unable to view product details.');
        }
      });
    });
  };

  // MutationObserver to detect dynamic DOM changes
  const observeDOM = () => {
    if (!window.location.pathname.includes('products.html')) {
      console.log('Not on products.html, skipping MutationObserver');
      return;
    }
    const targetNode = document.querySelector('.product-grid') || document.body;
    const observer = new MutationObserver((mutations) => {
      console.log('DOM change detected, re-initializing buttons...');
      initializeButtons();
    });
    observer.observe(targetNode, { childList: true, subtree: true });
    console.log('MutationObserver started for .product-grid or body');
  };

  // Clear Cart button
  const clearCartBtn = document.querySelector('.clear-cart-btn');
  if (clearCartBtn) {
    console.log('Binding event listener to Clear Cart button');
    clearCartBtn.addEventListener('click', () => {
      console.log('Clear Cart button clicked');
      clearCart();
    });
  }

  // Checkout button
  const checkoutBtn = document.querySelector('.checkout-btn');
  if (checkoutBtn) {
    console.log('Binding event listener to Checkout button');
    checkoutBtn.addEventListener('click', () => {
      console.log('Checkout button clicked');
      handleCheckout();
    });
  }

  // Login form
  const loginForm = document.querySelector('#login-form');
  if (loginForm) {
    console.log('Binding event listener to Login form');
    loginForm.addEventListener('submit', handleLogin);
  }

  // Register form
  const registerForm = document.querySelector('#register-form');
  if (registerForm) {
    console.log('Binding event listener to Register form');
    registerForm.addEventListener('submit', handleRegister);
  }

  // Initialize
  console.log('Initializing cart, login section, nav, and payment form');
  initializeButtons();
  observeDOM();
  displayCart();
  displayCartSummary();
  updateCartCount();
  updateLoginSection();
  initializePaymentForm();
});
