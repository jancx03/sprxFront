"use client";
import { useState, FC, ChangeEvent } from "react";

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

  const scale = desiredServings / originalServings;

  // For each ingredient, multiply its "amount" by scale
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
    <div>
      <h3>Scale Ingredients</h3>
      <label>
        Desired Servings:{" "}
        <input type="number" value={desiredServings} onChange={handleChange} />
      </label>
      <ul style={{ marginTop: "1rem" }}>
        {scaled.map((ing, i) => (
          <li key={i}>
            {ing.name}: {ing.scaledAmount.toFixed(2)} {ing.unit || ""}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScaledIngredients;
