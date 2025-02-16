"use client";
import { useEffect, useState } from "react";
import { ChevronRight, Heart } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Recipe {
  id: string;
  title: string;
  tags?: string[];
}

export default function FavoritesPage() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  // On mount, read favorite IDs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) {
      const parsed = JSON.parse(saved) as string[];
      setFavoriteIds(parsed);
    }
  }, []);

  // Whenever favoriteIds changes, fetch each recipe from our backend
  useEffect(() => {
    async function fetchFavorites() {
      if (favoriteIds.length === 0) {
        setRecipes([]);
        return;
      }

      const fetched: Recipe[] = [];
      for (const id of favoriteIds) {
        const res = await fetch(`http://88.80.187.193:8080/api/recipes/${id}`);
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-400" fill="currentColor" />
            My Favorite Recipes
          </h1>
          <p className="text-gray-400">Your saved recipes collection</p>
        </div>

        {/* Favorite Recipes List */}
        {favoriteIds.length === 0 ? (
          <p className="text-gray-400">You have no favorites yet.</p>
        ) : (
          <div className="space-y-4">
            {recipes.map((r) => (
              <Card
                key={r.id}
                className="bg-gray-800/50 border-gray-700 transition-colors hover:bg-gray-800/70 cursor-pointer group"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-xl group-hover:text-primary-foreground transition-colors">
                        {/* Link to recipe detail page */}
                        <a href={`/recipes/${r.id}`}>{r.title}</a>
                      </CardTitle>
                      {r.tags && r.tags.length > 0 && (
                        <CardDescription>
                          <div className="flex flex-wrap gap-2">
                            {r.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="bg-gray-700/50"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </CardDescription>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-primary-foreground transition-colors" />
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
