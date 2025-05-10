export interface User {
  id: string;
  email: string;
  name: string;
  preferences?: {
    dietType?: "vegetarian" | "vegan" | "non-vegetarian";
    weightGoal?: "lose" | "maintain" | "gain";
    allergies?: string[];
    healthConditions?: string[];
  };
}

export interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  healthBenefits?: string[];
  imageUri?: string;
  createdAt: number;
}

export interface MealPlan {
  id: string;
  title: string;
  goal: "lose" | "maintain" | "gain";
  dietType: "vegetarian" | "vegan" | "non-vegetarian";
  days: {
    day: string;
    meals: {
      type: "breakfast" | "lunch" | "dinner" | "snack";
      recipe: Recipe;
    }[];
  }[];
  createdAt: number;
}

export interface HealthAnalysis {
  id: string;
  type: "xray" | "mri" | "ct" | "report";
  imageUri?: string;
  findings: string;
  recommendations: string[];
  dietRecommendations?: string[];
  createdAt: number;
}

export type AIMessage = {
  role: "system" | "user" | "assistant";
  content: string | Array<ContentPart>;
};

export type ContentPart =
  | { type: "text"; text: string }
  | { type: "image"; image: string };
