"use client";

import { FC, useState, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";

interface CalorieCalculatorProps {
  initialServings: number;
  totalCalories: number;
}

const CalorieCalculator: FC<CalorieCalculatorProps> = ({
  initialServings,
  totalCalories,
}) => {
  const [servings, setServings] = useState<number>(initialServings);

  // Base cals per serving
  const baseCaloriesPerServing = totalCalories / initialServings;
  const newTotalCalories = baseCaloriesPerServing * servings;
  const newPerServing = newTotalCalories / servings;

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const val = parseInt(e.target.value, 10);
    setServings(val > 0 ? val : 1);
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Calorie Calculator</h3>

      <div className="text-sm text-gray-200 space-y-1">
        <p>
          <strong>Original Servings:</strong> {initialServings}
        </p>
        <p>
          <strong>Original Total Calories:</strong> {Math.round(totalCalories)}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-400" htmlFor="desiredServings">
          Desired Servings:
        </label>
        <Input
          id="desiredServings"
          type="number"
          value={servings}
          onChange={handleChange}
          className="bg-gray-700/50 text-white border-gray-600 w-24"
        />
      </div>

      <div className="text-sm text-gray-200 space-y-1">
        <p>
          <strong>New Total Calories:</strong> {Math.round(newTotalCalories)}
        </p>
        <p>
          <strong>Calories per Serving:</strong> {Math.round(newPerServing)}
        </p>
      </div>
    </div>
  );
};

export default CalorieCalculator;
