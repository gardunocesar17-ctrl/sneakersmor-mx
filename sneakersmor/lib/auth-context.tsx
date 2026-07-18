"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Order {
  id: string;
  date: string;
  items: any[];
  total: number;
  status: string;
  metodoPago: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  age: string;
  password?: string;
}

interface AuthContextType {
  user: User | null;
  orders: Order[];
  login: (email: string, password?: string) => boolean;
  register: (user: User) => boolean;
  logout: () => void;
  addOrder: (order: Order) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("auth_user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        const allOrdersStr = localStorage.getItem("auth_orders") || "{}";
        const allOrders = JSON.parse(allOrdersStr);
        setOrders(allOrders[parsedUser.email] || []);
      }
    } catch (e) {
      console.error("Error parsing auth state", e);
    }
  }, []);

  const login = (email: string, password?: string) => {
    try {
      const usersStr = localStorage.getItem("auth_users") || "[]";
      const users: User[] = JSON.parse(usersStr);
      
      const found = users.find(u => u.email === email && u.password === password);
      if (found) {
        setUser(found);
        localStorage.setItem("auth_user", JSON.stringify(found));
        
        const allOrdersStr = localStorage.getItem("auth_orders") || "{}";
        const allOrders = JSON.parse(allOrdersStr);
        setOrders(allOrders[found.email] || []);
        
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const register = (newUser: User) => {
    try {
      const usersStr = localStorage.getItem("auth_users") || "[]";
      const users: User[] = JSON.parse(usersStr);
      
      if (users.some(u => u.email === newUser.email)) {
        return false; // Email ya existe
      }
      
      const updatedUsers = [...users, newUser];
      localStorage.setItem("auth_users", JSON.stringify(updatedUsers));
      
      setUser(newUser);
      localStorage.setItem("auth_user", JSON.stringify(newUser));
      setOrders([]);
      
      return true;
    } catch (e) {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setOrders([]);
    localStorage.removeItem("auth_user");
  };

  const addOrder = (order: Order) => {
    if (!user) return;
    
    const newOrders = [order, ...orders];
    setOrders(newOrders);
    
    try {
      const allOrdersStr = localStorage.getItem("auth_orders") || "{}";
      const allOrders = JSON.parse(allOrdersStr);
      
      allOrders[user.email] = newOrders;
      localStorage.setItem("auth_orders", JSON.stringify(allOrders));
    } catch (e) {
      console.error("Error guardando orden", e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, orders, login, register, logout, addOrder }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}
