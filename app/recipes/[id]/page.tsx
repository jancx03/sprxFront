export const dynamic = "force-dynamic";

import CalorieCalculator from "@/components/CalorieCalculator";
import ScaledIngredients from "@/components/ScaledIngredients";
import FavoriteButton from "@/components/FavoriteButton";

// Define the shape of each ingredient
interface Ingredient {
  name: string;
  amount: string;
  unit?: string;
  nutrition?: {
    calories?: number;
  };
}

// Define the shape of total nutrition
interface TotalNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

// Define the full recipe structure
interface Recipe {
  id: string;
  title: string;
  description: string;
  servings: number;
  prepTime: string;
  cookTime: string;
  difficulty: string;
  tags: string[];
  instructions: string[];
  ingredients: Ingredient[];
  totalNutrition?: TotalNutrition;
}

// Define the type for the Next.js page props
interface RecipeDetailPageProps {
  params: {
    id: string;
  };
}

// (Optional) If you want to set dynamic metadata, you can define a generateMetadata function here
// export async function generateMetadata({ params }: RecipeDetailPageProps): Promise<Metadata> {
//   return { title: `Recipe #${params.id}` };
// }

export default async function RecipeDetailPage({
  params,
}: RecipeDetailPageProps) {
  const { id } = await params;

  // Fetch single recipe detail
  const res = await fetch(`http://localhost:8080/api/recipes/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch recipe detail");
  }

  const recipe: Recipe = await res.json();

  return (
    <div style={{ padding: "1rem" }}>
      <h1>{recipe.title}</h1>
      <p>
        <strong>Description:</strong> {recipe.description}
      </p>
      <p>
        <strong>Servings:</strong> {recipe.servings}
      </p>
      <p>
        <strong>Prep Time:</strong> {recipe.prepTime}
      </p>
      <p>
        <strong>Cook Time:</strong> {recipe.cookTime}
      </p>
      <p>
        <strong>Difficulty:</strong> {recipe.difficulty}
      </p>

      <h3>Tags</h3>
      <ul>
        {recipe.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>

      {/* Favorite button (client component) */}
      <FavoriteButton recipeId={recipe.id} />

      <h3>Ingredients</h3>
      <ul>
        {recipe.ingredients.map((ing, idx) => (
          <li key={idx}>
            <strong>{ing.name}:</strong> {ing.amount} {ing.unit}
            {ing.nutrition?.calories
              ? ` (~${Math.round(ing.nutrition.calories)} cal)`
              : ""}
          </li>
        ))}
      </ul>

      {/* Scale ingredient amounts (client component) */}
      <ScaledIngredients
        originalServings={recipe.servings}
        ingredients={recipe.ingredients}
      />

      {recipe.totalNutrition && (
        <>
          <h4>Total Nutrition (approx.)</h4>
          <ul>
            <li>Calories: {Math.round(recipe.totalNutrition.calories)}</li>
            <li>Protein: {Math.round(recipe.totalNutrition.protein)} g</li>
            <li>Carbs: {Math.round(recipe.totalNutrition.carbs)} g</li>
            <li>Fat: {Math.round(recipe.totalNutrition.fat)} g</li>
          </ul>
        </>
      )}

      {/* Calorie calculator (client component) */}
      {recipe.totalNutrition && (
        <CalorieCalculator
          initialServings={recipe.servings}
          totalCalories={recipe.totalNutrition.calories}
        />
      )}

      <h3>Instructions</h3>
      <ol>
        {recipe.instructions.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>
    </div>
  );
}
