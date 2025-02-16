"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface ShoppingListContextValue {
  selectedRecipes: string[];
  addRecipe: (id: string) => void;
  removeRecipe: (id: string) => void;
  clearList: () => void;
}

const ShoppingListContext = createContext<ShoppingListContextValue | undefined>(
  undefined
);

interface ShoppingListProviderProps {
  children: ReactNode;
}

export function ShoppingListProvider({ children }: ShoppingListProviderProps) {
  const [selectedRecipes, setSelectedRecipes] = useState<string[]>([]);

  // On mount, load from localStorage if available
  useEffect(() => {
    const saved = localStorage.getItem("shoppingList");
    if (saved) {
      setSelectedRecipes(JSON.parse(saved));
    }
  }, []);

  // Whenever selectedRecipes changes, save to localStorage
  useEffect(() => {
    localStorage.setItem("shoppingList", JSON.stringify(selectedRecipes));
  }, [selectedRecipes]);

  function addRecipe(id: string) {
    setSelectedRecipes((prev) => {
      if (prev.includes(id)) return prev; // already in list
      return [...prev, id];
    });
  }

  function removeRecipe(id: string) {
    setSelectedRecipes((prev) => prev.filter((r) => r !== id));
  }

  function clearList() {
    setSelectedRecipes([]);
  }

  const value: ShoppingListContextValue = {
    selectedRecipes,
    addRecipe,
    removeRecipe,
    clearList,
  };

  return (
    <ShoppingListContext.Provider value={value}>
      {children}
    </ShoppingListContext.Provider>
  );
}

export function useShoppingList() {
  const context = useContext(ShoppingListContext);
  if (!context) {
    throw new Error(
      "useShoppingList must be used within a ShoppingListProvider"
    );
  }
  return context;
}
