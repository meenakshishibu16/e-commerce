import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  guestAddItem, guestClear, guestCreateCart, guestFetchCart, guestRemoveItem, guestUpdateQty,
  userAddItem as apiUserAdd, userClear as apiUserClear, userFetchCart, userRemoveItem as apiUserRemove, userUpdateQty as apiUserUpdate
} from "../api.js";
import { useAuth } from "./AuthContext.jsx";

const CartContext=createContext(null);
const GUEST_CART_KEY="phase4_guestCartId";

export function CartProvider({children}){
  const {token}=useAuth();
  const [guestCartId,setGuestCartId]=useState(()=>localStorage.getItem(GUEST_CART_KEY)||"");
  const [cart,setCart]=useState(null);
  const [totals,setTotals]=useState({subtotal:0,itemCount:0});
  const [loading,setLoading]=useState(false);

  useEffect(()=>{let mounted=true;(async()=>{
    if(token) return;
    if(guestCartId) return;
    setLoading(true);
    try{const data=await guestCreateCart(); if(!mounted) return;
      localStorage.setItem(GUEST_CART_KEY,data.cartId); setGuestCartId(data.cartId); setCart(data.cart); setTotals(data.totals);
    } finally{if(mounted) setLoading(false)}
  })(); return ()=>{mounted=false};},[token,guestCartId]);

  useEffect(()=>{let mounted=true;(async()=>{
    setLoading(true);
    try{
      if(token){const data=await userFetchCart(token); if(!mounted) return; setCart(data.cart); setTotals(data.totals);}
      else if(guestCartId){const data=await guestFetchCart(guestCartId); if(!mounted) return; setCart(data.cart); setTotals(data.totals);}
      else { if(!mounted) return; setCart({items:[]}); setTotals({subtotal:0,itemCount:0}); }
    } finally{if(mounted) setLoading(false)}
  })(); return ()=>{mounted=false};},[token,guestCartId]);

  async function addItem(productId,size,qty=1){
    setLoading(true);
    try{
      if(token){const data=await apiUserAdd(token,{productId,size,qty}); setCart(data.cart); setTotals(data.totals);}
      else {const data=await guestAddItem(guestCartId,{productId,size,qty}); setCart(data.cart); setTotals(data.totals);}
    } finally{setLoading(false)}
  }
  async function setQty(itemId,qty){
    setLoading(true);
    try{
      if(token){const data=await apiUserUpdate(token,itemId,qty); setCart(data.cart); setTotals(data.totals);}
      else {const data=await guestUpdateQty(guestCartId,itemId,qty); setCart(data.cart); setTotals(data.totals);}
    } finally{setLoading(false)}
  }
  async function remove(itemId){
    setLoading(true);
    try{
      if(token){const data=await apiUserRemove(token,itemId); setCart(data.cart); setTotals(data.totals);}
      else {const data=await guestRemoveItem(guestCartId,itemId); setCart(data.cart); setTotals(data.totals);}
    } finally{setLoading(false)}
  }
  async function clear(){
    setLoading(true);
    try{
      if(token){const data=await apiUserClear(token); setCart(data.cart); setTotals(data.totals);}
      else {const data=await guestClear(guestCartId); setCart(data.cart); setTotals(data.totals);}
    } finally{setLoading(false)}
  }

  const value=useMemo(()=>({guestCartId,cart,totals,loading,addItem,setQty,remove,clear}),[guestCartId,cart,totals,loading]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart(){const ctx=useContext(CartContext); if(!ctx) throw new Error("useCart must be used within CartProvider"); return ctx;}
