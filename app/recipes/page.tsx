export const dynamic = "force-dynamic";

import SearchForm from "@/components/SearchForm";
import RecipeList from "@/components/RecipeList";

interface RecipesPageProps {
  searchParams?: Promise<{
    name?: string;
    tag?: string;
    ingredient?: string;
    dietary?: string;
    sort?: string;
  }>;
}

interface Recipe {
  id: string;
  title: string;
  description?: string;
  prepTime?: string;
  cookTime?: string;
  difficulty?: string;
  tags: string[];
  dateAdded?: string;
}

export default async function RecipesPage(props: RecipesPageProps) {
  const searchParams = (await props.searchParams) || {};
  const name = searchParams.name;
  const tag = searchParams.tag;
  const ingredient = searchParams.ingredient;
  const dietary = searchParams.dietary;
  const sort = searchParams.sort;

  const query = new URLSearchParams();
  if (name) query.set("name", name);
  if (tag) query.set("tag", tag);
  if (ingredient) query.set("ingredient", ingredient);
  if (dietary) query.set("dietary", dietary);
  if (sort) query.set("sort", sort);

  const res = await fetch(`http://88.80.187.193:8080/api/recipes?${query}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch recipes");
  }

  const recipes: Recipe[] = await res.json();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Recipes</h1>
          <p className="text-gray-400">
            Discover and manage your favorite recipes
          </p>
        </header>

        {/* Our new SearchForm (with sheet) */}
        <SearchForm
          initialName={name}
          initialTag={tag}
          initialIngredient={ingredient}
          initialDietary={dietary}
          initialSort={sort}
        />

        <RecipeList recipes={recipes} />
      </div>
    </div>
  );
}
