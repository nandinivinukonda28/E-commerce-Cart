const app = document.getElementById('app');

let users = {};
let currentUser = null;
let products = [
  { id: 1, name: 'Laptop', price: 19990, stock: 5 },
  { id: 2, name: 'Phone', price: 5099, stock: 10 },
  { id: 3, name: 'Running Shoes - Nike', price: 899, stock: 8 },
  { id: 4, name: 'Casual Sneakers - Adidas', price: 675, stock: 2 },
  { id: 5, name: 'Wrist Watch - Fossil', price: 1129, stock: 16 },
  { id: 6, name: 'Electric Kettle', price: 537, stock: 7 },
  { id: 7, name: 'Bluetooth Speaker', price: 729, stock: 12 },
  { id: 8, name: 'Yoga Mat', price: 439, stock: 10 },
  { id: 9, name: 'Backpack - Wildcraft', price: 1214, stock: 7 },
  { id: 10, name: 'Scented Candles Set', price: 218, stock: 18 },
  { id: 11, name: 'Table Lamp', price: 335, stock: 5 },
];
let cart = [];
let balances = { credit: 25000, debit: 15000 };

function renderLogin() {
  app.innerHTML = `
    <div class="container">
      <h2>Login / Register</h2>
      <input type="text" id="username" placeholder="Username" />
      <input type="password" id="password" placeholder="Password" />
      <br>
      <button onclick="register()">Register</button>
      <button onclick="login()">Login</button>
    </div>
  `;
}

function register() {
  const user = document.getElementById('username').value;
  const pass = document.getElementById('password').value;
  if (users[user]) {
    alert('User already exists');
  } else {
    users[user] = pass;
    alert('Registered successfully');
  }
}

function login() {
  const user = document.getElementById('username').value;
  const pass = document.getElementById('password').value;
  if (users[user] && users[user] === pass) {
    currentUser = user;
    renderProducts();
  } else {
    alert('Invalid credentials');
  }
}

function renderProducts() {
  app.innerHTML = `
    <div class="container">
      <h2>Welcome, ${currentUser}</h2>
      <div id="product-list"></div>
      <br><br>
      <button onclick="renderCart()">View Cart</button>
    </div>
  `;
  // Ensure product list renders after DOM is available
  setTimeout(() => showProducts(products), 0);
}

function showProducts(list) {
  const listEl = document.getElementById('product-list');
  listEl.innerHTML = '<div class="product-grid"></div>';
  const grid = listEl.querySelector('.product-grid');

  list.forEach(p => {
    grid.innerHTML += `
      <div class="product">
        <strong>${p.name}</strong><br>
        ₹${p.price} (Stock: ${p.stock})<br><br>
        <button onclick="addToCart(${p.id})">Add to Cart</button>
      </div>
    `;
  });
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (product.stock > 0) {
    const cartItem = cart.find(item => item.id === id);
    if (cartItem) {
      cartItem.quantity++;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    product.stock--;
    alert(`${product.name} added to cart`);
    renderProducts();
  } else {
    alert('Out of stock');
  }
}

function renderCart() {
  let html = `<div class="container"><h2>Your Cart</h2>`;
  if (!cart.length) {
    html += '<p>Cart is empty</p>';
  } else {
    cart.forEach((p, index) => {
      html += `<p>${p.name} x ${p.quantity} - ₹${p.price * p.quantity} <button onclick="removeFromCart(${index})">Remove</button></p>`;
    });
    const total = cart.reduce((sum, p) => sum + p.price * p.quantity, 0);
    html += `<p><strong>Total: ₹${total}</strong></p>`;
    html += `<input placeholder="Payment Method (credit/debit)" id="method" />`;
    html += `<button onclick="placeOrder(${total})">Place Order</button>`;
  }
  html += `<br><br><button onclick="renderProducts()">Back</button></div>`;
  app.innerHTML = html;
}

function removeFromCart(index) {
  const product = cart[index];
  const original = products.find(p => p.id === product.id);

  if (product.quantity > 1) {
    product.quantity--;
    if (original) original.stock++;
  } else {
    if (original) original.stock++;
    cart.splice(index, 1);
  }

  renderCart();
}


function placeOrder(total) {
  const method = document.getElementById('method').value.toLowerCase();
  if (!balances[method]) {
    alert('Invalid payment method');
    return;
  }
  if (balances[method] < total) {
    alert('Insufficient funds');
    return;
  }
  balances[method] -= total;
  cart = [];
  renderThankYou();
}

function renderThankYou() {
  app.innerHTML = `
    <div class="container">
      <h2>✅ Order Placed!!! <br>Thank you for shopping, ${currentUser}!</h2>
      <button onclick="renderLogin()">Logout</button>
    </div>
  `;
}

renderLogin();
