import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Calendar, Utensils, User } from "lucide-react-native";
import { MealPlan } from "@/types";
import Colors from "@/constants/colors";

interface MealPlanCardProps {
  mealPlan: MealPlan;
  onPress: () => void;
}

const MealPlanCard: React.FC<MealPlanCardProps> = ({ mealPlan, onPress }) => {
  const { title, goal, dietType, days } = mealPlan;

  const getGoalText = () => {
    switch (goal) {
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
    switch (dietType) {
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
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={[styles.badge, { backgroundColor: getGoalColor(goal) }]}>
          <Text style={styles.badgeText}>{getGoalText()}</Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Calendar size={16} color={Colors.textLight} />
          <Text style={styles.infoText}>{days.length} days</Text>
        </View>

        <View style={styles.infoItem}>
          <Utensils size={16} color={Colors.textLight} />
          <Text style={styles.infoText}>{getDietTypeText()}</Text>
        </View>

        <View style={styles.infoItem}>
          <User size={16} color={Colors.textLight} />
          <Text style={styles.infoText}>1 person</Text>
        </View>
      </View>

      <View style={styles.previewContainer}>
        <Text style={styles.previewTitle}>Preview:</Text>
        {days.length > 0 && days[0].meals.length > 0 && (
          <View style={styles.mealsPreview}>
            {days[0].meals.slice(0, 3).map((meal, index) => (
              <Text key={index} style={styles.mealText}>
                <Text style={styles.mealType}>
                  {capitalizeFirstLetter(meal.type)}:{" "}
                </Text>
                {meal.recipe.title}
              </Text>
            ))}
            {days[0].meals.length > 3 && (
              <Text style={styles.moreText}>
                + {days[0].meals.length - 3} more meals
              </Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const getGoalColor = (goal: string) => {
  switch (goal) {
    case "lose":
      return "#E3F2FD"; // Light blue
    case "gain":
      return "#E8F5E9"; // Light green
    case "maintain":
      return "#FFF3E0"; // Light orange
    default:
      return "#F5F5F5"; // Light gray
  }
};

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    flexWrap: "wrap",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    flex: 1,
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: Colors.highlight,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.primary,
  },
  infoContainer: {
    flexDirection: "row",
    marginBottom: 16,
    flexWrap: "wrap",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textLight,
    marginLeft: 4,
  },
  previewContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  mealsPreview: {
    gap: 4,
  },
  mealText: {
    fontSize: 14,
    color: Colors.textLight,
  },
  mealType: {
    fontWeight: "600",
    color: Colors.text,
  },
  moreText: {
    fontSize: 12,
    color: Colors.primary,
    marginTop: 4,
  },
});

export default MealPlanCard;
