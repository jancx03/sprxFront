"use client";
import { FC, useEffect, useState } from "react";

interface FavoriteButtonProps {
  recipeId: string;
}

const FavoriteButton: FC<FavoriteButtonProps> = ({ recipeId }) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) {
      const parsed = JSON.parse(saved) as string[];
      setFavorites(parsed);
      setIsFavorited(parsed.includes(recipeId));
    }
  }, [recipeId]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
    setIsFavorited(favorites.includes(recipeId));
  }, [favorites, recipeId]);

  function toggleFavorite() {
    setFavorites((prev) => {
      if (prev.includes(recipeId)) {
        return prev.filter((id) => id !== recipeId);
      } else {
        return [...prev, recipeId];
      }
    });
  }

  return (
    <button onClick={toggleFavorite} style={{ marginTop: "1rem" }}>
      {isFavorited ? "Unfavorite" : "Favorite"}
    </button>
  );
};

export default FavoriteButton;
