"use client";
import { FC } from "react";
import { useShoppingList } from "@/app/context/ShoppingListContext";

// Same interface from above or keep it in a shared file
interface Recipe {
  id: string;
  title: string;
  tags: string[];
  prepTime?: string;
  cookTime?: string;
}

// Props for the RecipeList component
interface RecipeListProps {
  recipes: Recipe[];
}

const RecipeList: FC<RecipeListProps> = ({ recipes }) => {
  const { selectedRecipes, addRecipe, removeRecipe } = useShoppingList();

  // If no recipes or empty array, show a message
  if (!recipes || recipes.length === 0) {
    return <p>No recipes found.</p>;
  }

  // Toggle function to add/remove recipe from the shopping list
  function toggleRecipe(recipeId: string) {
    if (selectedRecipes.includes(recipeId)) {
      removeRecipe(recipeId);
    } else {
      addRecipe(recipeId);
    }
  }

  return (
    <ul>
      {recipes.map((recipe) => {
        const isSelected = selectedRecipes.includes(recipe.id);

        return (
          <li key={recipe.id} style={{ marginBottom: "0.5rem" }}>
            <a href={`/recipes/${recipe.id}`}>
              {recipe.title} — {recipe.tags.join(", ")}
              {recipe.prepTime && ` | Prep: ${recipe.prepTime}`}
              {recipe.cookTime && ` | Cook: ${recipe.cookTime}`}
            </a>
            <button
              onClick={() => toggleRecipe(recipe.id)}
              style={{ marginLeft: "1rem" }}
            >
              {isSelected ? "Remove from List" : "Add to List"}
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default RecipeList;
