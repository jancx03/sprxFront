"use client";

import { FC } from "react";
import { useShoppingList } from "@/app/context/ShoppingListContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Plus, Minus } from "lucide-react";

interface Recipe {
  id: string;
  title: string;
  tags: string[];
  prepTime?: string;
  cookTime?: string;
}

interface RecipeListProps {
  recipes: Recipe[];
}

/**
 * A card-based recipe list. Each recipe can be toggled
 * "Add to List" or "Remove from List" via plus/minus icons.
 * Clicking the recipe title links to `/recipes/[id]`.
 */
const RecipeList: FC<RecipeListProps> = ({ recipes }) => {
  const { selectedRecipes, addRecipe, removeRecipe } = useShoppingList();

  if (!recipes || recipes.length === 0) {
    return <p className="text-gray-400">No recipes found.</p>;
  }

  function toggleRecipe(recipeId: string) {
    if (selectedRecipes.includes(recipeId)) {
      removeRecipe(recipeId);
    } else {
      addRecipe(recipeId);
    }
  }

  return (
    <div className="grid gap-4">
      {recipes.map((recipe) => {
        const isSelected = selectedRecipes.includes(recipe.id);

        return (
          <Card
            key={recipe.id}
            className="bg-gray-800/50 border border-gray-700 text-white"
          >
            <CardHeader>
              <CardTitle className="flex items-start justify-between">
                {/* Link to the recipe detail page */}
                <a
                  href={`/recipes/${recipe.id}`}
                  className="underline hover:text-gray-200"
                >
                  {recipe.title}
                </a>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={() => toggleRecipe(recipe.id)}
                >
                  {isSelected ? (
                    <Minus className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </Button>
              </CardTitle>
              {/* Tags as badges */}
              <CardDescription className="flex flex-wrap gap-2 mt-2">
                {recipe.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-gray-700/50"
                  >
                    {tag}
                  </Badge>
                ))}
              </CardDescription>
            </CardHeader>
            <CardFooter className="text-sm text-gray-400 flex gap-4">
              {recipe.prepTime && (
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Prep: {recipe.prepTime}
                </div>
              )}
              {recipe.cookTime && (
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Cook: {recipe.cookTime}
                </div>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default RecipeList;
