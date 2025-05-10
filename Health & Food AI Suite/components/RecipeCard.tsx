import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Clock, Heart, User, Bookmark } from "lucide-react-native";
import { Recipe } from "@/types";
import Colors from "@/constants/colors";

interface RecipeCardProps {
  recipe: Recipe;
  onPress: () => void;
  onSave?: () => void;
  isSaved?: boolean;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onPress,
  onSave,
  isSaved = false,
}) => {
  const { title, ingredients, nutritionalInfo, imageUri } = recipe;

  // Calculate estimated cooking time based on number of ingredients and instructions
  const estimatedTime = Math.max(15, ingredients.length * 5);

  // Default image if none provided
  const defaultImage =
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80";

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <Image
        source={{ uri: imageUri || defaultImage }}
        style={styles.image}
        resizeMode="cover"
      />

      {onSave && (
        <TouchableOpacity
          style={styles.saveButton}
          onPress={onSave}
          activeOpacity={0.8}
        >
          <Bookmark
            size={20}
            color={isSaved ? Colors.primary : "#fff"}
            fill={isSaved ? Colors.primary : "transparent"}
          />
        </TouchableOpacity>
      )}

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>

        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Clock size={16} color={Colors.textLight} />
            <Text style={styles.infoText}>{estimatedTime} min</Text>
          </View>

          <View style={styles.infoItem}>
            <User size={16} color={Colors.textLight} />
            <Text style={styles.infoText}>1-2 servings</Text>
          </View>

          {nutritionalInfo?.calories && (
            <View style={styles.infoItem}>
              <Heart size={16} color={Colors.textLight} />
              <Text style={styles.infoText}>
                {nutritionalInfo.calories} cal
              </Text>
            </View>
          )}
        </View>

        <View style={styles.ingredientsContainer}>
          <Text style={styles.ingredientsTitle}>Ingredients:</Text>
          <Text style={styles.ingredients} numberOfLines={2}>
            {ingredients.slice(0, 3).join(", ")}
            {ingredients.length > 3 ? "..." : ""}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
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
  },
  image: {
    width: "100%",
    height: 180,
  },
  saveButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 8,
  },
  infoContainer: {
    flexDirection: "row",
    marginBottom: 12,
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
  ingredientsContainer: {
    marginTop: 4,
  },
  ingredientsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 2,
  },
  ingredients: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
  },
});

export default RecipeCard;
