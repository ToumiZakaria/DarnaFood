import { create } from 'zustand';

export interface CartItem {
  dishId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
  image?: string;
}

interface CartState {
  items: CartItem[];
  cookId: string | null;
  cookName: string | null;
  addItem: (item: CartItem, itemCookId: string, itemCookName?: string) => void;
  removeItem: (dishId: string) => void;
  updateQuantity: (dishId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  cookId: null,
  cookName: null,
  
  addItem: (item, itemCookId, itemCookName = "Fatima B.") => set((state) => {
    if (state.cookId && state.cookId !== itemCookId) {
      // Must not add items from different cooks
      alert("Vous ne pouvez commander que chez un seul cuisinier à la fois. Veuillez vider votre panier pour changer de cuisinier.");
      return state;
    }

    const existingItem = state.items.find((i) => i.dishId === item.dishId);
    
    if (existingItem) {
      return {
        ...state,
        items: state.items.map((i) => 
          i.dishId === item.dishId 
            ? { ...i, quantity: i.quantity + item.quantity } 
            : i
        )
      };
    }

    return {
      cookId: itemCookId,
      cookName: itemCookName,
      items: [...state.items, item]
    };
  }),

  removeItem: (dishId) => set((state) => {
    const newItems = state.items.filter((i) => i.dishId !== dishId);
    return {
      items: newItems,
      cookId: newItems.length === 0 ? null : state.cookId,
      cookName: newItems.length === 0 ? null : state.cookName,
    };
  }),

  updateQuantity: (dishId, quantity) => set((state) => {
    if (quantity <= 0) {
      const newItems = state.items.filter((i) => i.dishId !== dishId);
      return {
        items: newItems,
        cookId: newItems.length === 0 ? null : state.cookId,
        cookName: newItems.length === 0 ? null : state.cookName,
      };
    }

    return {
      ...state,
      items: state.items.map((i) => 
        i.dishId === dishId ? { ...i, quantity } : i
      )
    };
  }),

  clearCart: () => set({ items: [], cookId: null, cookName: null }),
}));
