import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Clock, Heart, Share, ArrowLeft, Bookmark } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import Button from "@/components/Button";
import { useRecipeStore } from "@/store/recipeStore";
import Colors from "@/constants/colors";

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { recipes, savedRecipes, saveRecipe, removeSavedRecipe } =
    useRecipeStore();

  const recipe = recipes.find((r) => r.id === id);

  if (!recipe) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Recipe not found</Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  const isSaved = savedRecipes.some((r) => r.id === recipe.id);

  const handleSaveToggle = () => {
    if (isSaved) {
      removeSavedRecipe(recipe.id);
      Alert.alert(
        "Recipe Removed",
        "Recipe has been removed from your saved recipes."
      );
    } else {
      saveRecipe(recipe);
      Alert.alert(
        "Recipe Saved",
        "Recipe has been added to your saved recipes."
      );
    }
  };

  const handleShare = () => {
    Alert.alert("Share", "Sharing functionality would be implemented here.");
  };

  // Default image if none provided
  const defaultImage =
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80";

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: recipe.title,
          headerShown: false,
        }}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: recipe.imageUri || defaultImage }}
            style={styles.image}
            resizeMode="cover"
          />

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <View style={styles.iconBackground}>
              <ArrowLeft size={24} color="#fff" />
            </View>
          </TouchableOpacity>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleSaveToggle}
            >
              <View style={styles.iconBackground}>
                <Bookmark
                  size={24}
                  color="#fff"
                  fill={isSaved ? "#fff" : "transparent"}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
              <View style={styles.iconBackground}>
                <Share size={24} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>

          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            style={styles.gradient}
          >
            <Text style={styles.title}>{recipe.title}</Text>
          </LinearGradient>
        </View>

        <View style={styles.content}>
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Clock size={20} color={Colors.primary} />
              <Text style={styles.infoText}>
                {Math.max(15, recipe.ingredients.length * 5)} min
              </Text>
            </View>

            {recipe.nutritionalInfo?.calories && (
              <View style={styles.infoItem}>
                <Heart size={20} color={Colors.primary} />
                <Text style={styles.infoText}>
                  {recipe.nutritionalInfo.calories} calories
                </Text>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            {recipe.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientItem}>
                <View style={styles.bullet} />
                <Text style={styles.ingredientText}>{ingredient}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            {recipe.instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <View style={styles.instructionNumber}>
                  <Text style={styles.numberText}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>

          {recipe.healthBenefits && recipe.healthBenefits.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Health Benefits</Text>
              {recipe.healthBenefits.map((benefit, index) => (
                <View key={index} style={styles.benefitItem}>
                  <View style={styles.bullet} />
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>
          )}

          {recipe.nutritionalInfo &&
            Object.keys(recipe.nutritionalInfo).length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Nutritional Information</Text>
                <View style={styles.nutritionContainer}>
                  {Object.entries(recipe.nutritionalInfo).map(
                    ([key, value]) => (
                      <View key={key} style={styles.nutritionItem}>
                        <Text style={styles.nutritionValue}>{value}</Text>
                        <Text style={styles.nutritionLabel}>{key}</Text>
                      </View>
                    )
                  )}
                </View>
              </View>
            )}
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
  imageContainer: {
    position: "relative",
    height: 300,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },
  actionButtons: {
    position: "absolute",
    top: 50,
    right: 20,
    flexDirection: "row",
    zIndex: 10,
  },
  iconButton: {
    marginLeft: 12,
  },
  iconBackground: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    padding: 20,
  },
  infoContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  infoText: {
    fontSize: 16,
    color: Colors.text,
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 16,
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginRight: 12,
  },
  ingredientText: {
    fontSize: 16,
    color: Colors.text,
    flex: 1,
  },
  instructionItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  numberText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  instructionText: {
    fontSize: 16,
    color: Colors.text,
    flex: 1,
    lineHeight: 24,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  benefitText: {
    fontSize: 16,
    color: Colors.text,
    flex: 1,
    lineHeight: 24,
  },
  nutritionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  nutritionItem: {
    width: "30%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary,
  },
  nutritionLabel: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 4,
    textTransform: "capitalize",
  },
});
