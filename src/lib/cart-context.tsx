'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';

// ── Types ───────────────────────────────────────────────────────────
export interface CartItem {
  id: number;
  title: string;
  slug: string;
  category: string;
  price: number;
  quantity: number;
}

export interface PurchaseRecord {
  id: string;
  documentId: number;
  title: string;
  slug: string;
  category: string;
  price: number;
  date: string;
  status: 'Completed' | 'Pending' | 'Failed';
  phone: string;
  transactionId: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  itemCount: number;
  total: number;
  purchases: PurchaseRecord[];
  addPurchase: (purchase: Omit<PurchaseRecord, 'id' | 'date' | 'transactionId'>) => PurchaseRecord;
  totalSpent: number;
  /** True once client-side hydration is complete */
  hydrated: boolean;
}

const CartContext = createContext<CartContextType | null>(null);

const CART_KEY = 'nyaera-cart';
const PURCHASES_KEY = 'nyaera-purchases';

function generateId(): string {
  return `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  // Start with empty arrays to match server render
  const [items, setItems] = useState<CartItem[]>([]);
  const [purchases, setPurchases] = useState<PurchaseRecord[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const loaded = useRef(false);

  // Load from localStorage only after mount (client-side only)
  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;

    const savedItems = loadFromStorage<CartItem[]>(CART_KEY, []);
    const savedPurchases = loadFromStorage<PurchaseRecord[]>(PURCHASES_KEY, []);

    setItems(savedItems);
    setPurchases(savedPurchases);
    setHydrated(true);
  }, []);

  // Persist cart to localStorage whenever it changes (only after hydration)
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  // Persist purchases to localStorage whenever they change (only after hydration)
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(PURCHASES_KEY, JSON.stringify(purchases));
  }, [purchases, hydrated]);

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const addPurchase = useCallback(
    (purchase: Omit<PurchaseRecord, 'id' | 'date' | 'transactionId'>) => {
      const record: PurchaseRecord = {
        ...purchase,
        id: generateId(),
        date: new Date().toISOString(),
        transactionId: generateId(),
      };
      setPurchases((prev) => [record, ...prev]);
      return record;
    },
    []
  );

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalSpent = purchases
    .filter((p) => p.status === 'Completed')
    .reduce((sum, p) => sum + p.price, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearCart,
        itemCount,
        total,
        purchases,
        addPurchase,
        totalSpent,
        hydrated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
