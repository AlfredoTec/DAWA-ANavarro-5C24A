"use client";

import { createContext, useContext, useState, useEffect, useRef, ReactNode, useCallback } from "react";
import type { AuthState } from "@/types/user";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (nombre: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, token: null, loading: true });
  const mounted = useRef(true);

  const setTokenCookie = (token: string) => {
    document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
  };

  const removeTokenCookie = () => {
    document.cookie = "token=; path=/; max-age=0";
  };

  useEffect(() => {
    mounted.current = true;
    const token = localStorage.getItem("token");
    if (token) {
      setTokenCookie(token);
      fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((user) => {
          if (!mounted.current) return;
          if (user) {
            setState({ user, token, loading: false });
          } else {
            localStorage.removeItem("token");
            removeTokenCookie();
            setState({ user: null, token: null, loading: false });
          }
        })
        .catch(() => {
          if (!mounted.current) return;
          localStorage.removeItem("token");
          removeTokenCookie();
          setState({ user: null, token: null, loading: false });
        });
    } else if (mounted.current) {
      setState({ user: null, token: null, loading: false });
    }
    return () => {
      mounted.current = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Error al iniciar sesion");
    }
    const data = await res.json();
    localStorage.setItem("token", data.token);
    setTokenCookie(data.token);
    setState({ user: data.user, token: data.token, loading: false });
  }, []);

  const register = useCallback(async (nombre: string, email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Error al registrarse");
    }
    const data = await res.json();
    localStorage.setItem("token", data.token);
    setTokenCookie(data.token);
    setState({ user: data.user, token: data.token, loading: false });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    removeTokenCookie();
    setState({ user: null, token: null, loading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
