export const dynamic = "force-dynamic";
// app/recipes/page.tsx
import SearchForm from "@/components/SearchForm";
import RecipeList from "@/components/RecipeList";

// Define the shape of searchParams
interface RecipesPageProps {
  searchParams?: {
    name?: string;
    tag?: string;
    ingredient?: string;
    dietary?: string;
    sort?: string;
  };
}

// Define the shape of a basic "recipe" from the /api/recipes endpoint
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
  const searchParams = props.searchParams || {};
  const name = searchParams.name;
  const tag = searchParams.tag;
  const ingredient = searchParams.ingredient;
  const dietary = searchParams.dietary;
  const sort = searchParams.sort;

  // Build query string for the external API
  const query = new URLSearchParams();
  if (name) query.set("name", name);
  if (tag) query.set("tag", tag);
  if (ingredient) query.set("ingredient", ingredient);
  if (dietary) query.set("dietary", dietary);
  if (sort) query.set("sort", sort);

  // Fetch from your Express backend
  const res = await fetch(`http://localhost:8080/api/recipes?${query}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch recipes");
  }

  // Parse as an array of Recipe objects
  const recipes: Recipe[] = await res.json();

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Recipes</h1>

      <SearchForm
        initialName={name}
        initialTag={tag}
        initialIngredient={ingredient}
        initialDietary={dietary}
        initialSort={sort}
      />

      <RecipeList recipes={recipes} />
    </div>
  );
}
