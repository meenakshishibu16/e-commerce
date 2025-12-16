import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { addCartItem, clearCart as apiClear, createCart, fetchCart, removeCartItem, updateCartItemQty } from "../api.js";

const CartContext = createContext(null);
const CART_ID_KEY = "phase2_cartId";

export function CartProvider({ children }) {
  const [cartId, setCartId] = useState(() => localStorage.getItem(CART_ID_KEY) || "");
  const [cart, setCart] = useState(null);
  const [totals, setTotals] = useState({ subtotal: 0, itemCount: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (cartId) return;
      setLoading(true);
      try {
        const data = await createCart();
        if (!mounted) return;
        localStorage.setItem(CART_ID_KEY, data.cartId);
        setCartId(data.cartId);
        setCart(data.cart);
        setTotals(data.totals);
      } finally { if (mounted) setLoading(false); }
    })();
    return () => { mounted = false; };
  }, [cartId]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!cartId) return;
      setLoading(true);
      try {
        const data = await fetchCart(cartId);
        if (!mounted) return;
        setCart(data.cart);
        setTotals(data.totals);
      } catch {
        const created = await createCart();
        if (!mounted) return;
        localStorage.setItem(CART_ID_KEY, created.cartId);
        setCartId(created.cartId);
        setCart(created.cart);
        setTotals(created.totals);
      } finally { if (mounted) setLoading(false); }
    })();
    return () => { mounted = false; };
  }, [cartId]);

  async function addItem(productId, size, qty=1){
    if(!cartId) return;
    setLoading(true);
    try{
      const data = await addCartItem(cartId, { productId, size, qty });
      setCart(data.cart); setTotals(data.totals);
    } finally { setLoading(false); }
  }

  async function setQty(itemId, qty){
    if(!cartId) return;
    setLoading(true);
    try{
      const data = await updateCartItemQty(cartId, itemId, qty);
      setCart(data.cart); setTotals(data.totals);
    } finally { setLoading(false); }
  }

  async function remove(itemId){
    if(!cartId) return;
    setLoading(true);
    try{
      const data = await removeCartItem(cartId, itemId);
      setCart(data.cart); setTotals(data.totals);
    } finally { setLoading(false); }
  }

  async function clear(){
    if(!cartId) return;
    setLoading(true);
    try{
      const data = await apiClear(cartId);
      setCart(data.cart); setTotals(data.totals);
    } finally { setLoading(false); }
  }

  const value = useMemo(() => ({ cartId, cart, totals, loading, addItem, setQty, remove, clear }), [cartId, cart, totals, loading]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(){
  const ctx = useContext(CartContext);
  if(!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
