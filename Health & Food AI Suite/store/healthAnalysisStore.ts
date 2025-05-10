import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HealthAnalysis } from "@/types";

interface HealthAnalysisState {
  analyses: HealthAnalysis[];
  currentAnalysis: HealthAnalysis | null;
  isLoading: boolean;
  error: string | null;
  setCurrentAnalysis: (analysis: HealthAnalysis | null) => void;
  addAnalysis: (analysis: HealthAnalysis) => void;
  removeAnalysis: (analysisId: string) => void;
  clearError: () => void;
}

export const useHealthAnalysisStore = create<HealthAnalysisState>()(
  persist(
    (set) => ({
      analyses: [],
      currentAnalysis: null,
      isLoading: false,
      error: null,

      setCurrentAnalysis: (analysis) => {
        set({ currentAnalysis: analysis });
      },

      addAnalysis: (analysis) => {
        set((state) => ({
          analyses: [analysis, ...state.analyses],
        }));
      },

      removeAnalysis: (analysisId) => {
        set((state) => ({
          analyses: state.analyses.filter((a) => a.id !== analysisId),
        }));
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "health-analysis-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
