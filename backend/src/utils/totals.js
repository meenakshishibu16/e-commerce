export function computeTotals(cart){const subtotal=cart.items.reduce((s,it)=>s+it.priceAtAdd*it.qty,0);const itemCount=cart.items.reduce((s,it)=>s+it.qty,0);return{subtotal,itemCount};}
