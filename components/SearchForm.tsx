"use client";
import { useState, FormEvent, ChangeEvent, FC } from "react";
import { useRouter } from "next/navigation";

interface SearchFormProps {
  initialName?: string;
  initialTag?: string;
  initialIngredient?: string;
  initialDietary?: string;
  initialSort?: string;
}

const SearchForm: FC<SearchFormProps> = ({
  initialName,
  initialTag,
  initialIngredient,
  initialDietary,
  initialSort,
}) => {
  const router = useRouter();

  // Prepopulate from existing search params
  const [name, setName] = useState(initialName || "");
  const [tag, setTag] = useState(initialTag || "");
  const [ingredient, setIngredient] = useState(initialIngredient || "");
  const [dietary, setDietary] = useState(initialDietary || "");
  const [sort, setSort] = useState(initialSort || "");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Build query
    const params = new URLSearchParams();
    if (name) params.set("name", name);
    if (tag) params.set("tag", tag);
    if (ingredient) params.set("ingredient", ingredient);
    if (dietary) params.set("dietary", dietary);
    if (sort) params.set("sort", sort);

    router.push(`/recipes?${params.toString()}`);
  };

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    setter: (val: string) => void
  ) {
    setter(e.target.value);
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
      <input
        type="text"
        placeholder="Name..."
        value={name}
        onChange={(e) => handleChange(e, setName)}
      />
      <input
        type="text"
        placeholder="Tag..."
        value={tag}
        onChange={(e) => handleChange(e, setTag)}
      />
      <input
        type="text"
        placeholder="Ingredient..."
        value={ingredient}
        onChange={(e) => handleChange(e, setIngredient)}
      />

      <select value={dietary} onChange={(e) => handleChange(e, setDietary)}>
        <option value="">--Any Diet--</option>
        <option value="vegetarian">Vegetarian</option>
        <option value="vegan">Vegan</option>
        <option value="gluten-free">Gluten-Free</option>
      </select>

      <select value={sort} onChange={(e) => handleChange(e, setSort)}>
        <option value="">--No Sort--</option>
        <option value="prepTime">Prep Time</option>
        <option value="cookTime">Cook Time</option>
        <option value="difficulty">Difficulty</option>
        <option value="dateAdded">Date Added</option>
        <option value="title">Title (A–Z)</option>
      </select>

      <button type="submit">Search</button>
    </form>
  );
};

export default SearchForm;
