"use client";

import { useState, FormEvent, FC } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Search, SlidersHorizontal } from "lucide-react";

interface SearchFormProps {
  initialName?: string;
  initialTag?: string;
  initialIngredient?: string;
  initialDietary?: string;
  initialSort?: string;
}

const SearchForm: FC<SearchFormProps> = ({
  initialName = "",
  initialTag = "",
  initialIngredient = "",
  initialDietary = "any",
  initialSort = "none",
}) => {
  const router = useRouter();

  // Main text search (for recipe name)
  const [name, setName] = useState(initialName);

  // Advanced filters in the sheet
  const [tag, setTag] = useState(initialTag);
  const [ingredient, setIngredient] = useState(initialIngredient);
  const [dietary, setDietary] = useState(initialDietary);
  const [sort, setSort] = useState(initialSort);

  const [open, setOpen] = useState(false);

  function doSearch() {
    const params = new URLSearchParams();
    if (name) params.set("name", name);
    if (tag) params.set("tag", tag);
    if (ingredient) params.set("ingredient", ingredient);
    if (dietary && dietary !== "any") {
      params.set("dietary", dietary);
    }
    if (sort && sort !== "none") {
      params.set("sort", sort);
    }

    router.push(`/recipes?${params.toString()}`);
  }

  function handleSearchClick(e?: FormEvent) {
    // If triggered by form submit, prevent default page reload
    if (e) e.preventDefault();
    doSearch();
  }

  return (
    // We wrap the main input + search button in a form
    <form
      onSubmit={handleSearchClick}
      className="flex flex-col md:flex-row gap-4 items-center"
    >
      {/* MAIN TEXT INPUT for "Search by recipe name" */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
        <Input
          placeholder="Search by recipe name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="pl-9 bg-gray-800/50 border-gray-700 text-white"
        />
      </div>

      {/* Buttons row */}
      <div className="flex gap-2">
        {/* Sheet for advanced filters */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="bg-gray-800 border-gray-700 text-white w-[300px] sm:w-[400px]"
          >
            <SheetHeader>
              <SheetTitle className="text-white">Search Filters</SheetTitle>
              <SheetDescription>
                Refine your recipe search with these filters
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-6 mt-6">
              {/* Tag */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Tags</label>
                <Input
                  placeholder="e.g. vegetarian, dinner..."
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="bg-gray-700/50 border-gray-600"
                />
              </div>

              {/* Ingredient */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Ingredients</label>
                <Input
                  placeholder="e.g. chicken, tomatoes..."
                  value={ingredient}
                  onChange={(e) => setIngredient(e.target.value)}
                  className="bg-gray-700/50 border-gray-600"
                />
              </div>

              {/* Dietary */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Dietary Preferences
                </label>
                <Select value={dietary} onValueChange={setDietary}>
                  <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                    <SelectValue placeholder="Any Diet" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-black">
                    <SelectItem
                      value="any"
                      className="hover:bg-gray-100 focus:bg-gray-200"
                    >
                      Any Diet
                    </SelectItem>
                    <SelectItem
                      value="vegetarian"
                      className="hover:bg-gray-100 focus:bg-gray-200"
                    >
                      Vegetarian
                    </SelectItem>
                    <SelectItem
                      value="vegan"
                      className="hover:bg-gray-100 focus:bg-gray-200"
                    >
                      Vegan
                    </SelectItem>
                    <SelectItem
                      value="gluten-free"
                      className="hover:bg-gray-100 focus:bg-gray-200"
                    >
                      Gluten-free
                    </SelectItem>
                    <SelectItem
                      value="keto"
                      className="hover:bg-gray-100 focus:bg-gray-200"
                    >
                      Keto
                    </SelectItem>
                    <SelectItem
                      value="paleo"
                      className="hover:bg-gray-100 focus:bg-gray-200"
                    >
                      Paleo
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Sort By</label>
                <Select value={sort} onValueChange={setSort}>
                  <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                    <SelectValue placeholder="Most Relevant" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-black">
                    <SelectItem
                      value="none"
                      className="hover:bg-gray-100 focus:bg-gray-200"
                    >
                      No Sort
                    </SelectItem>
                    <SelectItem
                      value="prepTime"
                      className="hover:bg-gray-100 focus:bg-gray-200"
                    >
                      Prep Time
                    </SelectItem>
                    <SelectItem
                      value="cookTime"
                      className="hover:bg-gray-100 focus:bg-gray-200"
                    >
                      Cook Time
                    </SelectItem>
                    <SelectItem
                      value="difficulty"
                      className="hover:bg-gray-100 focus:bg-gray-200"
                    >
                      Difficulty
                    </SelectItem>
                    <SelectItem
                      value="dateAdded"
                      className="hover:bg-gray-100 focus:bg-gray-200"
                    >
                      Date Added
                    </SelectItem>
                    <SelectItem
                      value="title"
                      className="hover:bg-gray-100 focus:bg-gray-200"
                    >
                      Title (A–Z)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Apply Filters button */}
              <Button
                variant="outline"
                className="w-full border border-gray-600 text-white hover:bg-gray-700 font-semibold"
                onClick={() => {
                  setOpen(false);
                  doSearch();
                }}
              >
                Apply Filters
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* MAIN SEARCH button */}
        <Button type="submit">Search</Button>
      </div>
    </form>
  );
};

export default SearchForm;
