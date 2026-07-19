"use client";

import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

export function useStock() {
  const [purchased, setPurchased] = useState<Record<string, number>>({});

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "store", "inventory"), (docSnap) => {
      if (docSnap.exists()) {
        setPurchased(docSnap.data() as Record<string, number>);
      } else {
        setPurchased({});
      }
    });
    return () => unsub();
  }, []);

  const getRealStock = (productId: string, talla: string, originalStock: number) => {
    return Math.max(0, originalStock - (purchased[`${productId}-${talla}`] || 0));
  };

  return { purchased, getRealStock };
}
