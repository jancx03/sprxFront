"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import {
  Clock,
  Users,
  ChefHat,
  Scale,
  Flame,
  Bot,
  Send,
  User,
  Loader2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import FavoriteButton from "@/components/FavoriteButton";
import ScaledIngredients from "@/components/ScaledIngredients";
import CalorieCalculator from "@/components/CalorieCalculator";

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

interface RecipeDetailUIProps {
  recipe: Recipe;
}

export default function RecipeDetailUI({ recipe }: RecipeDetailUIProps) {
  const [isAiChefOpen, setIsAiChefOpen] = useState(false);

  // AI Chat from @ai-sdk/react
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
      initialMessages: [
        {
          id: "init-1",
          role: "assistant",
          content: `Hello! I'm your AI Chef assistant for ${recipe.title}. How can I help you?`,
        },
      ],
    });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Section */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <CardTitle className="text-3xl">{recipe.title}</CardTitle>
                <CardDescription>{recipe.description}</CardDescription>
              </div>
              <FavoriteButton recipeId={recipe.id} />
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {recipe.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-gray-700/50">
                  {tag}
                </Badge>
              ))}
              <Badge variant="outline">Difficulty: {recipe.difficulty}</Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Quick Info + AI Chef Card */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Prep Time */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="flex items-center gap-2 p-4">
              <Clock className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-400">Prep Time</p>
                <p className="font-medium">{recipe.prepTime}</p>
              </div>
            </CardContent>
          </Card>

          {/* Cook Time */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="flex items-center gap-2 p-4">
              <ChefHat className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-400">Cook Time</p>
                <p className="font-medium">{recipe.cookTime}</p>
              </div>
            </CardContent>
          </Card>

          {/* Servings */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="flex items-center gap-2 p-4">
              <Users className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-400">Servings</p>
                <p className="font-medium">{recipe.servings} servings</p>
              </div>
            </CardContent>
          </Card>

          {/* AI Chef Dialog Trigger */}
          <Dialog open={isAiChefOpen} onOpenChange={setIsAiChefOpen}>
            <DialogTrigger asChild>
              <Card className="bg-gray-800/50 border-gray-700 cursor-pointer hover:bg-gray-700/50 transition-colors">
                <CardContent className="flex items-center gap-2 p-4">
                  <Bot className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-gray-400">AI Chef</p>
                    <p className="font-medium">Get Help</p>
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>

            {/* The AI Chef Chat Dialog */}
            <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-primary" />
                  AI Chef Assistant
                </DialogTitle>
                <DialogDescription>
                  Ask about recipe modifications, substitutions, or cooking tips
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${
                          message.role === "assistant"
                            ? "flex-row"
                            : "flex-row-reverse"
                        }`}
                      >
                        <div className="flex-none">
                          {message.role === "assistant" ? (
                            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                              <Bot className="w-5 h-5 text-primary" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center">
                              <User className="w-5 h-5 text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div
                          className={`rounded-lg px-4 py-2 max-w-[85%] ${
                            message.role === "assistant"
                              ? "bg-gray-700/50"
                              : "bg-primary/20"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">
                            {message.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <form
                  onSubmit={handleSubmit}
                  className="mt-4 flex gap-2 items-end"
                >
                  <div className="flex-1">
                    <Input
                      value={input}
                      onChange={handleInputChange}
                      placeholder="Ask about this recipe..."
                      className="bg-gray-700/50 border-gray-600"
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    type="submit"
                    size="icon"
                    disabled={isLoading || !input.trim()}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </form>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabs for Ingredients, Instructions, Scaling, Nutrition */}
        <Tabs defaultValue="ingredients" className="space-y-4">
          <TabsList className="bg-gray-800/50 border-gray-700 w-full justify-start">
            <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
            <TabsTrigger value="instructions">Instructions</TabsTrigger>
            <TabsTrigger value="scaling">Scaling</TabsTrigger>
            {recipe.totalNutrition && (
              <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            )}
          </TabsList>

          {/* INGREDIENTS */}
          <TabsContent value="ingredients">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle>Ingredients</CardTitle>
                <CardDescription>
                  All ingredients needed for this recipe
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="list-disc list-inside space-y-2 text-sm text-gray-200">
                  {recipe.ingredients.map((ing, idx) => (
                    <li key={idx}>
                      <strong>{ing.name}:</strong> {ing.amount}
                      {ing.unit ? ` ${ing.unit}` : ""}
                      {ing.nutrition?.calories
                        ? ` (~${Math.round(ing.nutrition.calories)} cal)`
                        : ""}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* INSTRUCTIONS */}
          <TabsContent value="instructions">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
                <CardDescription>Step by step guide</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recipe.instructions.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-none w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                      {i + 1}
                    </div>
                    <p className="flex-1 pt-1">{step}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* SCALING */}
          <TabsContent value="scaling">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="w-5 h-5" />
                  Scale Recipe
                </CardTitle>
                <CardDescription>
                  Adjust ingredients for different serving sizes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScaledIngredients
                  originalServings={recipe.servings}
                  ingredients={recipe.ingredients}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* NUTRITION */}
          {recipe.totalNutrition && (
            <TabsContent value="nutrition">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Flame className="w-5 h-5" />
                    Nutrition Facts
                  </CardTitle>
                  <CardDescription>
                    Approx. per serving based on {recipe.servings} servings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between py-2 border-b border-gray-700">
                      <span>Calories</span>
                      <span className="font-medium">
                        {Math.round(recipe.totalNutrition.calories)}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-700">
                      <span>Protein</span>
                      <span>{Math.round(recipe.totalNutrition.protein)} g</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-700">
                      <span>Carbohydrates</span>
                      <span>{Math.round(recipe.totalNutrition.carbs)} g</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-700">
                      <span>Fat</span>
                      <span>{Math.round(recipe.totalNutrition.fat)} g</span>
                    </div>
                  </div>
                  {/* Optionally embed CalorieCalculator */}
                  <div className="mt-4">
                    <CalorieCalculator
                      initialServings={recipe.servings}
                      totalCalories={recipe.totalNutrition.calories}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
