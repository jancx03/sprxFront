"use client";
import { useEffect, useState } from "react";
import { useShoppingList } from "../context/ShoppingListContext";

// Example: minimal shape of a fetched recipe
interface FetchedRecipe {
  id: string;
  title: string;
  ingredients: Array<{
    ingredientId: string;
    name?: string;
    unit?: string;
    amount: string; // stored as string in the API
  }>;
}

// Shape of combined ingredient in final list
interface CombinedIngredient {
  ingredientId: string;
  name: string;
  unit: string;
  amount: number;
}

export default function ShoppingListPage() {
  const { selectedRecipes, clearList } = useShoppingList();

  const [combinedIngredients, setCombinedIngredients] = useState<
    CombinedIngredient[]
  >([]);
  const [selectedRecipeTitles, setSelectedRecipeTitles] = useState<string[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If no recipes selected, reset everything
    if (selectedRecipes.length === 0) {
      setCombinedIngredients([]);
      setSelectedRecipeTitles([]);
      return;
    }

    async function fetchAndCombine() {
      setLoading(true);

      try {
        const allIngs: FetchedRecipe["ingredients"] = [];
        const allTitles: string[] = [];

        // 1) For each selected recipe ID, fetch the recipe data
        for (const id of selectedRecipes) {
          const res = await fetch(`http://localhost:8080/api/recipes/${id}`);
          if (!res.ok) continue;

          const recipe: FetchedRecipe = await res.json();

          // Collect the recipe title
          allTitles.push(recipe.title);

          // Collect all ingredients
          allIngs.push(...recipe.ingredients);
        }

        setSelectedRecipeTitles(allTitles);

        // 2) Merge duplicates by (ingredientId + unit)
        const merged: Record<string, CombinedIngredient> = {};

        for (const ing of allIngs) {
          const key = ing.ingredientId + "||" + (ing.unit || "");
          const amountNum = parseFloat(ing.amount) || 0;

          if (!merged[key]) {
            merged[key] = {
              ingredientId: ing.ingredientId,
              name: ing.name || ing.ingredientId,
              unit: ing.unit || "",
              amount: 0,
            };
          }
          merged[key].amount += amountNum;
        }

        setCombinedIngredients(Object.values(merged));
      } catch (err) {
        console.error("Error fetching recipes:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAndCombine();
  }, [selectedRecipes]);

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Shopping List</h1>

      {selectedRecipes.length === 0 ? (
        <p>No recipes selected.</p>
      ) : loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p>Recipes Selected: {selectedRecipeTitles.join(", ")}</p>
          <button onClick={clearList}>Clear Shopping List</button>

          <ul style={{ marginTop: "1rem" }}>
            {combinedIngredients.map((ing, idx) => (
              <li key={idx}>
                {ing.name}: {ing.amount.toFixed(2)} {ing.unit}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
