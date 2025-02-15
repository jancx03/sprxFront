"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// 1) Define the shape of our context value
interface ShoppingListContextValue {
  selectedRecipes: string[];
  addRecipe: (id: string) => void;
  removeRecipe: (id: string) => void;
  clearList: () => void;
}

// 2) Create the context with a default of undefined
const ShoppingListContext = createContext<ShoppingListContextValue | undefined>(
  undefined
);

// 3) Define props for our provider (accepts children)
interface ShoppingListProviderProps {
  children: ReactNode;
}

// 4) Implement the provider
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

// 5) Hook to consume the context
export function useShoppingList() {
  const context = useContext(ShoppingListContext);
  if (!context) {
    throw new Error(
      "useShoppingList must be used within a ShoppingListProvider"
    );
  }
  return context;
}
