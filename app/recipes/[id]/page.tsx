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
  const domain = process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : "http://localhost:3000"; // fallback for local dev
  const res = await fetch(
    `https://sprx-front.vercel.app/api/proxy?endpoint=recipes&id=${id}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch recipe detail");
  }

  const recipe: Recipe = await res.json();

  return <RecipeDetailUI recipe={recipe} />;
}
