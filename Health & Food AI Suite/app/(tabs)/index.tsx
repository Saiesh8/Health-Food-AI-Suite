import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Camera, FileText, Plus, Search } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import Button from "@/components/Button";
import Input from "@/components/Input";
import ImagePickerButton from "@/components/ImagePickerButton";
import RecipeCard from "@/components/RecipeCard";
import LoadingOverlay from "@/components/LoadingOverlay";
import { useRecipeStore } from "@/store/recipeStore";
import { Recipe } from "@/types";
import Colors from "@/constants/colors";
import {
  generateAIResponse,
  createFoodValidationPrompt,
  createRecipeFromImagePrompt,
  createRecipeFromIngredientsPrompt,
  parseRecipeFromAI,
} from "@/utils/ai";

export default function RecipesScreen() {
  const router = useRouter();
  const { recipes, savedRecipes, addRecipe, saveRecipe, setCurrentRecipe } =
    useRecipeStore();

  const [activeTab, setActiveTab] = useState<"camera" | "text">("camera");
  const [ingredients, setIngredients] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");
  const [showImagePicker, setShowImagePicker] = useState(false);

  const handleTabChange = (tab: "camera" | "text") => {
    setActiveTab(tab);
  };

  const handleRecipePress = (recipe: Recipe) => {
    setCurrentRecipe(recipe);
    router.push(`/recipe/${recipe.id}`);
  };

  const handleSaveRecipe = (recipe: Recipe) => {
    saveRecipe(recipe);
    Alert.alert("Recipe Saved", "Recipe has been added to your saved recipes.");
  };

  const handleImageSelected = async (base64: string) => {
    try {
      setIsLoading(true);
      setLoadingMessage("Validating image...");

      // First validate if the image contains food
      const validationPrompt = createFoodValidationPrompt(base64);
      const validationResponse = await generateAIResponse(validationPrompt);

      // Check if the response indicates this is a food image
      if (validationResponse.includes("YES")) {
        setLoadingMessage("Generating recipe...");

        // Generate recipe from the food image
        const recipePrompt = createRecipeFromImagePrompt(base64);
        const recipeResponse = await generateAIResponse(recipePrompt);

        // Parse the AI response into a structured recipe
        const parsedRecipe = parseRecipeFromAI(recipeResponse);

        // Create a new recipe object
        const newRecipe: Recipe = {
          id: Date.now().toString(),
          title: parsedRecipe.title,
          ingredients: parsedRecipe.ingredients,
          instructions: parsedRecipe.instructions,
          nutritionalInfo: parsedRecipe.nutritionalInfo,
          healthBenefits: parsedRecipe.healthBenefits,
          imageUri: `data:image/jpeg;base64,${base64}`,
          createdAt: Date.now(),
        };

        // Add the recipe to the store
        addRecipe(newRecipe);

        // Navigate to the recipe details
        setCurrentRecipe(newRecipe);
        router.push(`/recipe/${newRecipe.id}`);
      } else {
        Alert.alert(
          "Not a Food Image",
          "The image does not appear to contain food. Please try another image.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("Error processing image:", error);
      Alert.alert(
        "Error",
        "An error occurred while processing the image. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
      setShowImagePicker(false);
    }
  };

  const handleGenerateFromIngredients = async () => {
    if (!ingredients.trim()) {
      Alert.alert("Error", "Please enter some ingredients.");
      return;
    }

    try {
      setIsLoading(true);
      setLoadingMessage("Generating recipe...");

      // Generate recipe from ingredients text
      const recipePrompt = createRecipeFromIngredientsPrompt(ingredients);
      const recipeResponse = await generateAIResponse(recipePrompt);

      // Parse the AI response into a structured recipe
      const parsedRecipe = parseRecipeFromAI(recipeResponse);

      // Create a new recipe object
      const newRecipe: Recipe = {
        id: Date.now().toString(),
        title: parsedRecipe.title,
        ingredients: parsedRecipe.ingredients,
        instructions: parsedRecipe.instructions,
        nutritionalInfo: parsedRecipe.nutritionalInfo,
        healthBenefits: parsedRecipe.healthBenefits,
        createdAt: Date.now(),
      };

      // Add the recipe to the store
      addRecipe(newRecipe);

      // Navigate to the recipe details
      setCurrentRecipe(newRecipe);
      router.push(`/recipe/${newRecipe.id}`);
    } catch (error) {
      console.error("Error generating recipe:", error);
      Alert.alert(
        "Error",
        "An error occurred while generating the recipe. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
      setIngredients("");
    }
  };

  return (
    <View style={styles.container}>
      <LoadingOverlay visible={isLoading} message={loadingMessage} />

      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientEnd]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>AI Recipe Generator</Text>
        <Text style={styles.headerSubtitle}>
          Generate recipes from food images or ingredients
        </Text>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "camera" && styles.activeTab]}
            onPress={() => handleTabChange("camera")}
          >
            <Camera size={20} color="#fff" />
            <Text style={styles.tabText}>Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "text" && styles.activeTab]}
            onPress={() => handleTabChange("text")}
          >
            <FileText size={20} color="#fff" />
            <Text style={styles.tabText}>Text</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === "camera" ? (
          <View style={styles.cameraSection}>
            {showImagePicker ? (
              <ImagePickerButton onImageSelected={handleImageSelected} />
            ) : (
              <View style={styles.cameraPrompt}>
                <Text style={styles.promptTitle}>
                  Take a photo of your food
                </Text>
                <Text style={styles.promptText}>
                  Our AI will analyze the image and generate a recipe based on
                  the ingredients it detects.
                </Text>
                <Button
                  title="Select Food Image"
                  onPress={() => setShowImagePicker(true)}
                  icon={<Camera size={20} color="#fff" />}
                  style={styles.button}
                />
              </View>
            )}
          </View>
        ) : (
          <View style={styles.textSection}>
            <Text style={styles.sectionTitle}>Enter Ingredients</Text>
            <Text style={styles.sectionSubtitle}>
              List the ingredients you have, and we'll generate a recipe for
              you.
            </Text>

            <Input
              value={ingredients}
              onChangeText={setIngredients}
              placeholder="e.g., chicken, rice, tomatoes, onions"
              multiline
              numberOfLines={4}
              style={styles.ingredientsInput}
            />

            <Button
              title="Generate Recipe"
              onPress={handleGenerateFromIngredients}
              icon={<Plus size={20} color="#fff" />}
              style={styles.button}
            />
          </View>
        )}

        {recipes.length > 0 && (
          <View style={styles.recipesSection}>
            <Text style={styles.sectionTitle}>Recent Recipes</Text>
            {recipes.slice(0, 5).map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onPress={() => handleRecipePress(recipe)}
                onSave={() => handleSaveRecipe(recipe)}
                isSaved={savedRecipes.some((r) => r.id === recipe.id)}
              />
            ))}
          </View>
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
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 10,
    gap: 8,
  },
  activeTab: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  tabText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  cameraSection: {
    marginBottom: 24,
  },
  cameraPrompt: {
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
  promptTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  promptText: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  textSection: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 16,
    lineHeight: 20,
  },
  ingredientsInput: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  recipesSection: {
    marginTop: 8,
  },
});
