"use client";
import { useEffect, useState } from "react";

// Define a minimal Recipe interface based on what your API returns
interface Recipe {
  id: string;
  title: string;
  tags?: string[];
  // Add other fields as needed (e.g., servings, instructions, etc.)
}

export default function FavoritesPage() {
  // We store a list of recipe IDs from localStorage
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  // We store the actual recipe objects after fetching them
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  // 1) On mount, read from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) {
      const parsed = JSON.parse(saved) as string[];
      setFavoriteIds(parsed);
    }
  }, []);

  // 2) Whenever favoriteIds changes, fetch each recipe from our backend
  useEffect(() => {
    async function fetchFavorites() {
      if (favoriteIds.length === 0) {
        setRecipes([]);
        return;
      }

      const fetched: Recipe[] = [];
      for (const id of favoriteIds) {
        const res = await fetch(`http://localhost:8080/api/recipes/${id}`);
        if (res.ok) {
          const data: Recipe = await res.json();
          fetched.push(data);
        }
      }
      setRecipes(fetched);
    }

    fetchFavorites();
  }, [favoriteIds]);

  return (
    <div style={{ padding: "1rem" }}>
      <h1>My Favorite Recipes</h1>
      {favoriteIds.length === 0 ? (
        <p>You have no favorites yet.</p>
      ) : (
        <ul>
          {recipes.map((r) => (
            <li key={r.id}>
              <a href={`/recipes/${r.id}`}>
                {r.title}
                {r.tags && ` – ${r.tags.join(", ")}`}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
