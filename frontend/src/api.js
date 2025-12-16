const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
async function j(res){ if(!res.ok){ const msg=(await res.json().catch(()=>null))?.message||"Request failed"; throw new Error(msg);} return res.json(); }

export const fetchProducts = () => fetch(`${API_BASE}/api/products`).then(j);
export const fetchProductById = (id) => fetch(`${API_BASE}/api/products/${id}`).then(j);

export const registerUser = (payload) => fetch(`${API_BASE}/api/auth/register`, { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(payload) }).then(j);
export const loginUser = (payload) => fetch(`${API_BASE}/api/auth/login`, { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(payload) }).then(j);
export const me = (token) => fetch(`${API_BASE}/api/auth/me`, { headers:{ Authorization:`Bearer ${token}` } }).then(j);

// Guest cart
export const guestCreateCart = () => fetch(`${API_BASE}/api/cart/guest/create`, { method:"POST" }).then(j);
export const guestFetchCart = (cartId) => fetch(`${API_BASE}/api/cart/guest/${cartId}`).then(j);
export const guestAddItem = (cartId, payload) => fetch(`${API_BASE}/api/cart/guest/${cartId}/items`, { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(payload) }).then(j);
export const guestUpdateQty = (cartId, itemId, qty) => fetch(`${API_BASE}/api/cart/guest/${cartId}/items/${itemId}`, { method:"PATCH", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ qty }) }).then(j);
export const guestRemoveItem = (cartId, itemId) => fetch(`${API_BASE}/api/cart/guest/${cartId}/items/${itemId}`, { method:"DELETE" }).then(j);
export const guestClear = (cartId) => fetch(`${API_BASE}/api/cart/guest/${cartId}/clear`, { method:"POST" }).then(j);

// User cart
export const userFetchCart = (token) => fetch(`${API_BASE}/api/cart`, { headers:{ Authorization:`Bearer ${token}` } }).then(j);
export const userAddItem = (token, payload) => fetch(`${API_BASE}/api/cart/items`, { method:"POST", headers:{ "Content-Type":"application/json", Authorization:`Bearer ${token}` }, body: JSON.stringify(payload) }).then(j);
export const userUpdateQty = (token, itemId, qty) => fetch(`${API_BASE}/api/cart/items/${itemId}`, { method:"PATCH", headers:{ "Content-Type":"application/json", Authorization:`Bearer ${token}` }, body: JSON.stringify({ qty }) }).then(j);
export const userRemoveItem = (token, itemId) => fetch(`${API_BASE}/api/cart/items/${itemId}`, { method:"DELETE", headers:{ Authorization:`Bearer ${token}` } }).then(j);
export const userClear = (token) => fetch(`${API_BASE}/api/cart/clear`, { method:"POST", headers:{ Authorization:`Bearer ${token}` } }).then(j);

// Orders
export const createCODOrder = (token, shippingAddress) => fetch(`${API_BASE}/api/orders/cod`, {
  method:"POST", headers:{ "Content-Type":"application/json", Authorization:`Bearer ${token}` }, body: JSON.stringify({ shippingAddress })
}).then(j);

export const createStripeSession = (token, shippingAddress) => fetch(`${API_BASE}/api/orders/stripe/create-session`, {
  method:"POST", headers:{ "Content-Type":"application/json", Authorization:`Bearer ${token}` }, body: JSON.stringify({ shippingAddress })
}).then(j);

export const confirmStripe = (token, sessionId) => fetch(`${API_BASE}/api/orders/stripe/confirm`, {
  method:"POST", headers:{ "Content-Type":"application/json", Authorization:`Bearer ${token}` }, body: JSON.stringify({ sessionId })
}).then(j);

export const listOrders = (token) => fetch(`${API_BASE}/api/orders`, { headers:{ Authorization:`Bearer ${token}` } }).then(j);
export const getOrder = (token, id) => fetch(`${API_BASE}/api/orders/${id}`, { headers:{ Authorization:`Bearer ${token}` } }).then(j);

// ================== WISHLIST ==================

export const getWishlist = (token) =>
  fetch(`${API_BASE}/api/wishlist`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(j);

export const addToWishlist = (token, productId) =>
  fetch(`${API_BASE}/api/wishlist/${productId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(j);

export const removeFromWishlist = (token, productId) =>
  fetch(`${API_BASE}/api/wishlist/${productId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(j);

// ================== REVIEWS ==================

export const getReviews = (productId) =>
  fetch(`${API_BASE}/api/reviews/${productId}`).then(j);

export const submitReview = (token, productId, payload) =>
  fetch(`${API_BASE}/api/reviews/${productId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  }).then(j);
  