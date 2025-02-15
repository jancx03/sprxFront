"use client";
import { useState, ChangeEvent, FC } from "react";

interface CalorieCalculatorProps {
  initialServings: number;
  totalCalories: number;
}

const CalorieCalculator: FC<CalorieCalculatorProps> = ({
  initialServings,
  totalCalories,
}) => {
  const [servings, setServings] = useState<number>(initialServings);

  const baseCaloriesPerServing = totalCalories / initialServings;
  const newTotalCalories = baseCaloriesPerServing * servings;
  const newPerServing = newTotalCalories / servings;

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const val = parseInt(e.target.value, 10);
    setServings(val > 0 ? val : 1);
  }

  return (
    <div style={{ margin: "1rem 0" }}>
      <h3>Calorie Calculator</h3>

      <p>
        <strong>Original Servings:</strong> {initialServings}
      </p>
      <p>
        <strong>Original Total Calories:</strong> {Math.round(totalCalories)}
      </p>

      <label>
        Desired Servings:{" "}
        <input type="number" value={servings} onChange={handleChange} />
      </label>

      <p>
        <strong>New Total Calories:</strong> {Math.round(newTotalCalories)}
      </p>
      <p>
        <strong>Calories per Serving:</strong> {Math.round(newPerServing)}
      </p>
    </div>
  );
};

export default CalorieCalculator;
