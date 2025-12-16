import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loginUser, me, registerUser } from "../api.js";
const AuthContext=createContext(null);
const TOKEN_KEY="phase4_token";
export function AuthProvider({children}){
  const [token,setToken]=useState(()=>localStorage.getItem(TOKEN_KEY)||"");
  const [user,setUser]=useState(null);
  const [loading,setLoading]=useState(false);

  useEffect(()=>{let mounted=true;(async()=>{if(!token) return; setLoading(true);
    try{const data=await me(token); if(!mounted) return; setUser(data.user);}
    catch{localStorage.removeItem(TOKEN_KEY); if(!mounted) return; setToken(""); setUser(null);}
    finally{if(mounted) setLoading(false);}
  })(); return ()=>{mounted=false};},[token]);

  async function register(payload){setLoading(true); try{const data=await registerUser(payload);
    localStorage.setItem(TOKEN_KEY,data.token); setToken(data.token); setUser(data.user); return data;
  } finally{setLoading(false)}}

  async function login(payload){setLoading(true); try{const data=await loginUser(payload);
    localStorage.setItem(TOKEN_KEY,data.token); setToken(data.token); setUser(data.user); return data;
  } finally{setLoading(false)}}

  function logout(){localStorage.removeItem(TOKEN_KEY); setToken(""); setUser(null);}

  const value=useMemo(()=>({token,user,loading,register,login,logout}),[token,user,loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth(){const ctx=useContext(AuthContext); if(!ctx) throw new Error("useAuth must be used within AuthProvider"); return ctx;}
