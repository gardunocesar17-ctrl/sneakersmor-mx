"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  where 
} from "firebase/firestore";
import { auth, db } from "./firebase";

export interface Order {
  id: string;
  date: string;
  items: any[];
  total: number;
  status: string;
  metodoPago: string;
  userEmail?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  age: string;
}

interface AuthResult {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  orders: Order[];
  login: (email: string, password?: string) => Promise<AuthResult>;
  register: (user: User, password?: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  addOrder: (order: Order) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Obtener usuario
          const userQuery = query(collection(db, "users"), where("email", "==", firebaseUser.email));
          const userSnapshot = await getDocs(userQuery);
          
          if (!userSnapshot.empty) {
            setUser(userSnapshot.docs[0].data() as User);
          } else {
            setUser({ id: firebaseUser.uid, name: firebaseUser.displayName || "Usuario", email: firebaseUser.email!, age: "" });
          }

          // Obtener pedidos
          const ordersQuery = query(collection(db, "orders"), where("userEmail", "==", firebaseUser.email));
          const ordersSnapshot = await getDocs(ordersQuery);
          const userOrders = ordersSnapshot.docs.map(doc => doc.data() as Order);
          userOrders.sort((a, b) => Number(b.id) - Number(a.id));
          setOrders(userOrders);
        } catch (error) {
          console.error("Error cargando datos de Firebase", error);
        }
      } else {
        setUser(null);
        setOrders([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password?: string): Promise<AuthResult> => {
    try {
      if (!password) return { success: false, error: "Contraseña requerida" };
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (e: any) {
      console.error("Error en login:", e);
      return { success: false, error: e.message };
    }
  };

  const register = async (newUser: User, password?: string): Promise<AuthResult> => {
    try {
      if (!password) return { success: false, error: "Contraseña requerida" };
      const res = await createUserWithEmailAndPassword(auth, newUser.email, password);
      
      await setDoc(doc(db, "users", res.user.uid), {
        id: res.user.uid,
        name: newUser.name,
        email: newUser.email,
        age: newUser.age
      });
      
      return { success: true };
    } catch (e: any) {
      console.error("Error en registro:", e);
      return { success: false, error: e.message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error(e);
    }
  };

  const addOrder = async (order: Order) => {
    if (!user) return;
    
    const newOrder = { ...order, userEmail: user.email };
    setOrders(prev => [newOrder, ...prev]);
    
    try {
      await setDoc(doc(db, "orders", order.id), newOrder);
    } catch (e) {
      console.error("Error guardando orden en Firebase", e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, orders, login, register, logout, addOrder, loading }}>
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
