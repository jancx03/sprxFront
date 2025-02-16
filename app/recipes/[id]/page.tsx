import RecipeDetailUI from "./RecipeDetailUI";

export const dynamic = "force-dynamic";

interface Ingredient {
  name: string;
  amount: string;
  unit?: string;
  nutrition?: {
    calories?: number;
  };
}

interface TotalNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

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

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await fetch(`http://88.80.187.193:8080/api/recipes/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch recipe detail");
  }

  const recipe: Recipe = await res.json();

  return <RecipeDetailUI recipe={recipe} />;
}
