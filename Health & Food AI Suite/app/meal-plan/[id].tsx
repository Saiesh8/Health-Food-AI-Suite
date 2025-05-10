import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Calendar,
  Utensils,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import Button from "@/components/Button";
import { useMealPlanStore } from "@/store/mealPlanStore";
import Colors from "@/constants/colors";

export default function MealPlanDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { mealPlans } = useMealPlanStore();

  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  const mealPlan = mealPlans.find((mp) => mp.id === id);

  if (!mealPlan) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Meal plan not found</Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  const toggleDay = (day: string) => {
    if (expandedDay === day) {
      setExpandedDay(null);
    } else {
      setExpandedDay(day);
    }
  };

  const getGoalText = () => {
    switch (mealPlan.goal) {
      case "lose":
        return "Weight Loss";
      case "gain":
        return "Weight Gain";
      case "maintain":
        return "Weight Maintenance";
      default:
        return "Custom Plan";
    }
  };

  const getDietTypeText = () => {
    switch (mealPlan.dietType) {
      case "vegetarian":
        return "Vegetarian";
      case "vegan":
        return "Vegan";
      case "non-vegetarian":
        return "Non-Vegetarian";
      default:
        return "Mixed Diet";
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: mealPlan.title,
          headerShown: false,
        }}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientEnd]}
          style={styles.header}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.title}>{mealPlan.title}</Text>

          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Calendar size={18} color="#fff" />
              <Text style={styles.infoText}>{mealPlan.days.length} days</Text>
            </View>

            <View style={styles.infoItem}>
              <Utensils size={18} color="#fff" />
              <Text style={styles.infoText}>{getDietTypeText()}</Text>
            </View>
          </View>

          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{getGoalText()}</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Your 7-Day Meal Plan</Text>
          <Text style={styles.sectionDescription}>
            Follow this personalized meal plan to achieve your {mealPlan.goal}{" "}
            weight goal with a {mealPlan.dietType} diet.
          </Text>

          {mealPlan.days.map((day, index) => (
            <View key={index} style={styles.dayContainer}>
              <TouchableOpacity
                style={[
                  styles.dayHeader,
                  expandedDay === day.day && styles.expandedDayHeader,
                ]}
                onPress={() => toggleDay(day.day)}
                activeOpacity={0.7}
              >
                <Text style={styles.dayTitle}>{day.day}</Text>
                {expandedDay === day.day ? (
                  <ChevronUp size={24} color={Colors.text} />
                ) : (
                  <ChevronDown size={24} color={Colors.text} />
                )}
              </TouchableOpacity>

              {expandedDay === day.day && (
                <View style={styles.mealsContainer}>
                  {day.meals.map((meal, mealIndex) => (
                    <View key={mealIndex} style={styles.mealCard}>
                      <View style={styles.mealTypeContainer}>
                        <Text style={styles.mealType}>
                          {meal.type.charAt(0).toUpperCase() +
                            meal.type.slice(1)}
                        </Text>
                      </View>

                      <View style={styles.mealContent}>
                        <Text style={styles.mealTitle}>
                          {meal.recipe.title}
                        </Text>

                        {meal.recipe.ingredients &&
                          meal.recipe.ingredients.length > 0 && (
                            <View style={styles.mealIngredients}>
                              <Text style={styles.ingredientsTitle}>
                                Ingredients:
                              </Text>
                              <Text style={styles.ingredientsText}>
                                {meal.recipe.ingredients.join(", ")}
                              </Text>
                            </View>
                          )}

                        {meal.recipe.instructions &&
                          meal.recipe.instructions.length > 0 && (
                            <View style={styles.mealInstructions}>
                              <Text style={styles.instructionsTitle}>
                                Instructions:
                              </Text>
                              {meal.recipe.instructions.map(
                                (instruction, i) => (
                                  <Text key={i} style={styles.instructionText}>
                                    • {instruction}
                                  </Text>
                                )
                              )}
                            </View>
                          )}
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  notFound: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  notFoundText: {
    fontSize: 18,
    marginBottom: 20,
    color: Colors.text,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  backButton: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },
  infoContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  infoText: {
    fontSize: 14,
    color: "#fff",
    marginLeft: 8,
  },
  badgeContainer: {
    flexDirection: "row",
  },
  badge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 24,
    lineHeight: 20,
  },
  dayContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  expandedDayHeader: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
  },
  mealsContainer: {
    padding: 16,
  },
  mealCard: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: Colors.background,
    borderRadius: 12,
    overflow: "hidden",
  },
  mealTypeContainer: {
    width: 100,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
  },
  mealType: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
  },
  mealContent: {
    flex: 1,
    padding: 12,
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  mealIngredients: {
    marginBottom: 8,
  },
  ingredientsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  ingredientsText: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
  },
  mealInstructions: {
    marginTop: 4,
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  instructionText: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
    marginBottom: 4,
  },
});
