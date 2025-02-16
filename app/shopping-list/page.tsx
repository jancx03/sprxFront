"use client";

import { useEffect, useState } from "react";
import { useShoppingList } from "../context/ShoppingListContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FetchedRecipe {
  id: string;
  title: string;
  ingredients: Array<{
    ingredientId: string;
    name?: string;
    unit?: string;
    amount: string; // numeric string
  }>;
}

// Combined ingredient shape
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
    if (selectedRecipes.length === 0) {
      setCombinedIngredients([]);
      setSelectedRecipeTitles([]);
      return;
    }

    async function fetchAndCombine() {
      setLoading(true);
      const domain = process.env.NEXT_PUBLIC_VERCEL_URL
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
        : "http://localhost:3000"; // fallback for local dev
      try {
        const allIngs: FetchedRecipe["ingredients"] = [];
        const allTitles: string[] = [];

        for (const id of selectedRecipes) {
          const res = await fetch(
            `https://sprx-front.vercel.app/api/proxy?endpoint=recipes&id=${id}`
          );

          if (!res.ok) continue;

          const recipe: FetchedRecipe = await res.json();
          allTitles.push(recipe.title);
          allIngs.push(...recipe.ingredients);
        }

        setSelectedRecipeTitles(allTitles);

        // Merge duplicates by (ingredientId + unit)
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Shopping List</h1>
          <p className="text-gray-400">
            Your merged ingredients from selected recipes
          </p>
        </header>

        {selectedRecipes.length === 0 ? (
          <div className="space-y-2">
            <p className="text-gray-400">No recipes selected.</p>
          </div>
        ) : loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : (
          <>
            {/* Card for selected recipes + Clear button */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg">Recipes Selected</CardTitle>
                <CardDescription>
                  You have selected {selectedRecipes.length} recipe(s)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {selectedRecipeTitles.map((title, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="bg-gray-700/50"
                    >
                      {title}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" onClick={clearList}>
                    Clear Shopping List
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Card for merged ingredients */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg">Combined Ingredients</CardTitle>
                <CardDescription>All ingredients</CardDescription>
              </CardHeader>
              <CardContent>
                {combinedIngredients.length === 0 ? (
                  <p className="text-gray-400">No ingredients found.</p>
                ) : (
                  <ul className="list-disc list-inside space-y-2 text-sm text-gray-200">
                    {combinedIngredients.map((ing, idx) => (
                      <li key={idx}>
                        <strong>{ing.name}:</strong> {ing.amount.toFixed(2)}{" "}
                        {ing.unit}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
