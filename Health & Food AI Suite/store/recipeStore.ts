import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Recipe } from "@/types";

interface RecipeState {
  recipes: Recipe[];
  savedRecipes: Recipe[];
  currentRecipe: Recipe | null;
  isLoading: boolean;
  error: string | null;
  setCurrentRecipe: (recipe: Recipe | null) => void;
  addRecipe: (recipe: Recipe) => void;
  saveRecipe: (recipe: Recipe) => void;
  removeSavedRecipe: (recipeId: string) => void;
  clearError: () => void;
}

export const useRecipeStore = create<RecipeState>()(
  persist(
    (set) => ({
      recipes: [],
      savedRecipes: [],
      currentRecipe: null,
      isLoading: false,
      error: null,

      setCurrentRecipe: (recipe) => {
        set({ currentRecipe: recipe });
      },

      addRecipe: (recipe) => {
        set((state) => ({
          recipes: [recipe, ...state.recipes],
        }));
      },

      saveRecipe: (recipe) => {
        set((state) => {
          // Check if recipe already exists in savedRecipes
          const exists = state.savedRecipes.some((r) => r.id === recipe.id);
          if (exists) return state;

          return {
            savedRecipes: [recipe, ...state.savedRecipes],
          };
        });
      },

      removeSavedRecipe: (recipeId) => {
        set((state) => ({
          savedRecipes: state.savedRecipes.filter((r) => r.id !== recipeId),
        }));
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "recipe-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
