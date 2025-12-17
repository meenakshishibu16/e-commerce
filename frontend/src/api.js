const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

async function safeRead(res) {
  const text = await res.text(); // <-- read as text first (safe)
  if (!text) return { data: null, text: "" };
  try {
    return { data: JSON.parse(text), text };
  } catch {
    return { data: null, text };
  }
}

async function j(res, friendlyError = "Request failed") {
  const { data } = await safeRead(res);

  if (!res.ok) {
    const msg = data?.message || data?.error || friendlyError;
    throw new Error(msg);
  }

  return data;
}

// Products
export const fetchProducts = () => fetch(`${API_BASE}/api/products`).then((r) => j(r));
export const fetchProductById = (id) => fetch(`${API_BASE}/api/products/${id}`).then((r) => j(r));

// Auth
export const registerUser = (payload) =>
  fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then((r) => j(r, "Registration failed. Please try again."));

export const loginUser = (payload) =>
  fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then((r) => j(r, "Login failed. Please check your credentials."));

export const me = (token) =>
  fetch(`${API_BASE}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => j(r));

// Guest cart
export const guestCreateCart = () => fetch(`${API_BASE}/api/cart/guest/create`, { method: "POST" }).then((r) => j(r));
export const guestFetchCart = (cartId) => fetch(`${API_BASE}/api/cart/guest/${cartId}`).then((r) => j(r));
export const guestAddItem = (cartId, payload) =>
  fetch(`${API_BASE}/api/cart/guest/${cartId}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then((r) => j(r));
export const guestUpdateQty = (cartId, itemId, qty) =>
  fetch(`${API_BASE}/api/cart/guest/${cartId}/items/${itemId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ qty }),
  }).then((r) => j(r));
export const guestRemoveItem = (cartId, itemId) => fetch(`${API_BASE}/api/cart/guest/${cartId}/items/${itemId}`, { method: "DELETE" }).then((r) => j(r));
export const guestClear = (cartId) => fetch(`${API_BASE}/api/cart/guest/${cartId}/clear`, { method: "POST" }).then((r) => j(r));

// User cart
export const userFetchCart = (token) => fetch(`${API_BASE}/api/cart`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => j(r));
export const userAddItem = (token, payload) =>
  fetch(`${API_BASE}/api/cart/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  }).then((r) => j(r));
export const userUpdateQty = (token, itemId, qty) =>
  fetch(`${API_BASE}/api/cart/items/${itemId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ qty }),
  }).then((r) => j(r));
export const userRemoveItem = (token, itemId) => fetch(`${API_BASE}/api/cart/items/${itemId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }).then((r) => j(r));
export const userClear = (token) => fetch(`${API_BASE}/api/cart/clear`, { method: "POST", headers: { Authorization: `Bearer ${token}` } }).then((r) => j(r));

// Orders
export const createCODOrder = (token, shippingAddress) =>
  fetch(`${API_BASE}/api/orders/cod`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ shippingAddress }),
  }).then((r) => j(r));

export const createStripeSession = (token, shippingAddress) =>
  fetch(`${API_BASE}/api/orders/stripe/create-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ shippingAddress }),
  }).then((r) => j(r));

export const confirmStripe = (token, sessionId) =>
  fetch(`${API_BASE}/api/orders/stripe/confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ sessionId }),
  }).then((r) => j(r));

export const listOrders = (token) => fetch(`${API_BASE}/api/orders`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => j(r));
export const getOrder = (token, id) => fetch(`${API_BASE}/api/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => j(r));

// Wishlist
export const getWishlist = (token) => fetch(`${API_BASE}/api/wishlist`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => j(r));
export const addToWishlist = (token, productId) => fetch(`${API_BASE}/api/wishlist/${productId}`, { method: "POST", headers: { Authorization: `Bearer ${token}` } }).then((r) => j(r));
export const removeFromWishlist = (token, productId) => fetch(`${API_BASE}/api/wishlist/${productId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }).then((r) => j(r));

// Reviews
export const getReviews = (productId) => fetch(`${API_BASE}/api/reviews/${productId}`).then((r) => j(r));
export const submitReview = (token, productId, payload) =>
  fetch(`${API_BASE}/api/reviews/${productId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  }).then((r) => j(r));
