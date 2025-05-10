import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MealPlan } from "@/types";

interface MealPlanState {
  mealPlans: MealPlan[];
  currentMealPlan: MealPlan | null;
  isLoading: boolean;
  error: string | null;
  setCurrentMealPlan: (mealPlan: MealPlan | null) => void;
  addMealPlan: (mealPlan: MealPlan) => void;
  removeMealPlan: (mealPlanId: string) => void;
  clearError: () => void;
}

export const useMealPlanStore = create<MealPlanState>()(
  persist(
    (set) => ({
      mealPlans: [],
      currentMealPlan: null,
      isLoading: false,
      error: null,

      setCurrentMealPlan: (mealPlan) => {
        set({ currentMealPlan: mealPlan });
      },

      addMealPlan: (mealPlan) => {
        set((state) => ({
          mealPlans: [mealPlan, ...state.mealPlans],
        }));
      },

      removeMealPlan: (mealPlanId) => {
        set((state) => ({
          mealPlans: state.mealPlans.filter((mp) => mp.id !== mealPlanId),
        }));
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "meal-plan-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
