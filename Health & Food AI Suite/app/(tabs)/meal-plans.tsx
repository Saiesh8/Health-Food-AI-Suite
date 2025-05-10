import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Plus } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import Button from "@/components/Button";
import Input from "@/components/Input";
import MealPlanCard from "@/components/MealPlanCard";
import LoadingOverlay from "@/components/LoadingOverlay";
import { useMealPlanStore } from "@/store/mealPlanStore";
import { MealPlan, Recipe } from "@/types";
import Colors from "@/constants/colors";
import {
  generateAIResponse,
  createMealPlanPrompt,
  parseMealPlanFromAI,
} from "@/utils/ai";

export default function MealPlansScreen() {
  const router = useRouter();
  const { mealPlans, addMealPlan, setCurrentMealPlan } = useMealPlanStore();

  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [goal, setGoal] = useState<"lose" | "maintain" | "gain">("maintain");
  const [dietType, setDietType] = useState<
    "vegetarian" | "vegan" | "non-vegetarian"
  >("non-vegetarian");
  const [restrictions, setRestrictions] = useState("");

  const handleMealPlanPress = (mealPlan: MealPlan) => {
    setCurrentMealPlan(mealPlan);
    router.push(`/meal-plan/${mealPlan.id}`);
  };

  const handleCreateMealPlan = async () => {
    try {
      setIsLoading(true);

      // Generate meal plan using AI
      const mealPlanPrompt = createMealPlanPrompt(goal, dietType, restrictions);
      const mealPlanResponse = await generateAIResponse(mealPlanPrompt);

      // Parse the AI response
      const parsedMealPlan = parseMealPlanFromAI(mealPlanResponse);

      // Create meal plan title based on goal and diet type
      let title = "";
      switch (goal) {
        case "lose":
          title = "Weight Loss";
          break;
        case "gain":
          title = "Weight Gain";
          break;
        case "maintain":
          title = "Weight Maintenance";
          break;
      }

      title += ` ${dietType.charAt(0).toUpperCase() + dietType.slice(1)} Plan`;

      // Create days with recipes
      const days = parsedMealPlan.days.map((day) => {
        return {
          day: day.day,
          meals: day.meals.map((meal) => {
            // Create a recipe for each meal
            const recipe: Recipe = {
              id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              title: meal.title,
              ingredients: [],
              instructions: [],
              healthBenefits: [],
              createdAt: Date.now(),
            };

            return {
              type: meal.type as "breakfast" | "lunch" | "dinner" | "snack",
              recipe,
            };
          }),
        };
      });

      // Create the meal plan
      const newMealPlan: MealPlan = {
        id: Date.now().toString(),
        title,
        goal,
        dietType,
        days,
        createdAt: Date.now(),
      };

      // Add the meal plan to the store
      addMealPlan(newMealPlan);

      // Navigate to the meal plan details
      setCurrentMealPlan(newMealPlan);
      router.push(`/meal-plan/${newMealPlan.id}`);

      // Reset form
      setShowForm(false);
      setRestrictions("");
    } catch (error) {
      console.error("Error generating meal plan:", error);
      Alert.alert(
        "Error",
        "An error occurred while generating the meal plan. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LoadingOverlay visible={isLoading} message="Generating meal plan..." />

      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientEnd]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>AI Meal Planner</Text>
        <Text style={styles.headerSubtitle}>
          Create personalized meal plans based on your goals and preferences
        </Text>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.createSection}>
          <Button
            title={showForm ? "Cancel" : "Create New Meal Plan"}
            onPress={() => setShowForm(!showForm)}
            variant={showForm ? "outline" : "primary"}
            icon={showForm ? undefined : <Plus size={20} color="#fff" />}
            style={styles.createButton}
          />

          {showForm && (
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>Customize Your Meal Plan</Text>

              <View style={styles.formSection}>
                <Text style={styles.sectionLabel}>Weight Goal:</Text>
                <View style={styles.optionsContainer}>
                  <Button
                    title="Lose Weight"
                    onPress={() => setGoal("lose")}
                    variant={goal === "lose" ? "primary" : "outline"}
                    size="small"
                    style={styles.optionButton}
                  />
                  <Button
                    title="Maintain"
                    onPress={() => setGoal("maintain")}
                    variant={goal === "maintain" ? "primary" : "outline"}
                    size="small"
                    style={styles.optionButton}
                  />
                  <Button
                    title="Gain Weight"
                    onPress={() => setGoal("gain")}
                    variant={goal === "gain" ? "primary" : "outline"}
                    size="small"
                    style={styles.optionButton}
                  />
                </View>
              </View>

              <View style={styles.formSection}>
                <Text style={styles.sectionLabel}>Diet Type:</Text>
                <View style={styles.optionsContainer}>
                  <Button
                    title="Non-Vegetarian"
                    onPress={() => setDietType("non-vegetarian")}
                    variant={
                      dietType === "non-vegetarian" ? "primary" : "outline"
                    }
                    size="small"
                    style={styles.optionButton}
                  />
                  <Button
                    title="Vegetarian"
                    onPress={() => setDietType("vegetarian")}
                    variant={dietType === "vegetarian" ? "primary" : "outline"}
                    size="small"
                    style={styles.optionButton}
                  />
                  <Button
                    title="Vegan"
                    onPress={() => setDietType("vegan")}
                    variant={dietType === "vegan" ? "primary" : "outline"}
                    size="small"
                    style={styles.optionButton}
                  />
                </View>
              </View>

              <View style={styles.formSection}>
                <Text style={styles.sectionLabel}>
                  Dietary Restrictions or Preferences:
                </Text>
                <Input
                  value={restrictions}
                  onChangeText={setRestrictions}
                  placeholder="e.g., gluten-free, low-carb, no nuts, etc."
                  multiline
                  numberOfLines={3}
                />
              </View>

              <Button
                title="Generate Meal Plan"
                onPress={handleCreateMealPlan}
                style={styles.generateButton}
              />
            </View>
          )}
        </View>

        {mealPlans.length > 0 ? (
          <View style={styles.mealPlansSection}>
            <Text style={styles.sectionTitle}>Your Meal Plans</Text>
            {mealPlans.map((mealPlan) => (
              <MealPlanCard
                key={mealPlan.id}
                mealPlan={mealPlan}
                onPress={() => handleMealPlanPress(mealPlan)}
              />
            ))}
          </View>
        ) : (
          !showForm && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>No Meal Plans Yet</Text>
              <Text style={styles.emptyStateText}>
                Create your first personalized meal plan based on your dietary
                preferences and weight goals.
              </Text>
            </View>
          )
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  createSection: {
    marginBottom: 24,
  },
  createButton: {
    marginBottom: 16,
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 16,
  },
  formSection: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  optionButton: {
    flex: 1,
    minWidth: 100,
  },
  generateButton: {
    marginTop: 8,
  },
  mealPlansSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 16,
  },
  emptyState: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: "center",
    lineHeight: 20,
  },
});
