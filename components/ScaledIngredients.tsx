"use client";

import { FC, ChangeEvent, useState } from "react";
import { Input } from "@/components/ui/input";

interface Ingredient {
  name: string;
  amount: string;
  unit?: string;
}

interface ScaledIngredientsProps {
  originalServings: number;
  ingredients: Ingredient[];
}

const ScaledIngredients: FC<ScaledIngredientsProps> = ({
  originalServings,
  ingredients,
}) => {
  const [desiredServings, setDesiredServings] =
    useState<number>(originalServings);

  // Scale factor
  const scale = desiredServings / originalServings;

  // Scale each ingredient
  const scaled = ingredients.map((ing) => {
    const baseAmount = parseFloat(ing.amount) || 0;
    const scaledAmount = baseAmount * scale;
    return { ...ing, scaledAmount };
  });

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const val = parseInt(e.target.value, 10);
    setDesiredServings(val > 0 ? val : 1);
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Scale Ingredients</h3>

      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-400" htmlFor="desiredServings">
          Desired Servings:
        </label>
        <Input
          id="desiredServings"
          type="number"
          value={desiredServings}
          onChange={handleChange}
          className="bg-gray-700/50 text-white border-gray-600 w-24"
        />
      </div>

      <ul className="list-disc list-inside space-y-1 text-sm text-gray-200 mt-4">
        {scaled.map((ing, i) => (
          <li key={i}>
            <strong>{ing.name}:</strong> {ing.scaledAmount.toFixed(2)}{" "}
            {ing.unit || ""}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScaledIngredients;
