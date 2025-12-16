const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
async function j(res){ if(!res.ok){ const msg=(await res.json().catch(()=>null))?.message||"Request failed"; throw new Error(msg);} return res.json(); }

export const fetchProducts = () => fetch(`${API_BASE}/api/products`).then(j);
export const fetchProductById = (id) => fetch(`${API_BASE}/api/products/${id}`).then(j);

// Cart
export const createCart = () => fetch(`${API_BASE}/api/cart/create`, { method:"POST" }).then(j);
export const fetchCart = (cartId) => fetch(`${API_BASE}/api/cart/${cartId}`).then(j);
export const addCartItem = (cartId, payload) => fetch(`${API_BASE}/api/cart/${cartId}/items`, { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(payload) }).then(j);
export const updateCartItemQty = (cartId, itemId, qty) => fetch(`${API_BASE}/api/cart/${cartId}/items/${itemId}`, { method:"PATCH", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ qty }) }).then(j);
export const removeCartItem = (cartId, itemId) => fetch(`${API_BASE}/api/cart/${cartId}/items/${itemId}`, { method:"DELETE" }).then(j);
export const clearCart = (cartId) => fetch(`${API_BASE}/api/cart/${cartId}/clear`, { method:"POST" }).then(j);
