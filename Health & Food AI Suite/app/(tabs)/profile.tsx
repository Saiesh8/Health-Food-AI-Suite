import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
} from "react-native";
import { useRouter } from "expo-router";
import {
  User,
  Settings,
  LogOut,
  Heart,
  ChefHat,
  Utensils,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Card from "@/components/Card";
import { useAuthStore } from "@/store/authStore";
import { useRecipeStore } from "@/store/recipeStore";
import { useMealPlanStore } from "@/store/mealPlanStore";
import { useHealthAnalysisStore } from "@/store/healthAnalysisStore";
import Colors from "@/constants/colors";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, updateUser, logout } = useAuthStore();
  const { recipes, savedRecipes } = useRecipeStore();
  const { mealPlans } = useMealPlanStore();
  const { analyses } = useHealthAnalysisStore();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  // Dietary preferences
  const [dietType, setDietType] = useState<
    "vegetarian" | "vegan" | "non-vegetarian"
  >(user?.preferences?.dietType || "non-vegetarian");
  const [weightGoal, setWeightGoal] = useState<"lose" | "maintain" | "gain">(
    user?.preferences?.weightGoal || "maintain"
  );

  const handleSaveProfile = () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert("Error", "Name and email are required.");
      return;
    }

    updateUser({
      name,
      email,
      preferences: {
        ...user?.preferences,
        dietType,
        weightGoal,
      },
    });

    setIsEditing(false);
    Alert.alert("Success", "Profile updated successfully.");
  };

  const handleLogout = () => {
    Alert.alert("Confirm Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          logout();
          setTimeout(() => {
            router.replace("/(auth)/welcome");
          }, 100);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientEnd]}
        style={styles.header}
      >
        <View style={styles.profileImageContainer}>
          <User size={40} color="#fff" />
        </View>
        <Text style={styles.profileName}>{user?.name}</Text>
        <Text style={styles.profileEmail}>{user?.email}</Text>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <ChefHat size={24} color={Colors.primary} />
            <Text style={styles.statNumber}>{recipes.length}</Text>
            <Text style={styles.statLabel}>Recipes</Text>
          </View>

          <View style={styles.statCard}>
            <Utensils size={24} color={Colors.primary} />
            <Text style={styles.statNumber}>{mealPlans.length}</Text>
            <Text style={styles.statLabel}>Meal Plans</Text>
          </View>

          <View style={styles.statCard}>
            <Heart size={24} color={Colors.primary} />
            <Text style={styles.statNumber}>{savedRecipes.length}</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
        </View>

        <Card style={styles.profileCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Profile Information</Text>
            <Button
              title={isEditing ? "Cancel" : "Edit"}
              onPress={() => setIsEditing(!isEditing)}
              variant="outline"
              size="small"
            />
          </View>

          {isEditing ? (
            <View style={styles.editForm}>
              <Input
                label="Name"
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                autoCapitalize="words"
              />

              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Button
                title="Save Changes"
                onPress={handleSaveProfile}
                style={styles.saveButton}
              />
            </View>
          ) : (
            <View style={styles.profileInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Name:</Text>
                <Text style={styles.infoValue}>{user?.name}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email:</Text>
                <Text style={styles.infoValue}>{user?.email}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Account Created:</Text>
                <Text style={styles.infoValue}>
                  {new Date().toLocaleDateString()}
                </Text>
              </View>
            </View>
          )}
        </Card>

        <Card style={styles.preferencesCard}>
          <Text style={styles.cardTitle}>Dietary Preferences</Text>

          <View style={styles.preferenceSection}>
            <Text style={styles.preferenceTitle}>Diet Type</Text>
            <View style={styles.optionsContainer}>
              <Button
                title="Non-Vegetarian"
                onPress={() => setDietType("non-vegetarian")}
                variant={dietType === "non-vegetarian" ? "primary" : "outline"}
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

          <View style={styles.preferenceSection}>
            <Text style={styles.preferenceTitle}>Weight Goal</Text>
            <View style={styles.optionsContainer}>
              <Button
                title="Lose Weight"
                onPress={() => setWeightGoal("lose")}
                variant={weightGoal === "lose" ? "primary" : "outline"}
                size="small"
                style={styles.optionButton}
              />
              <Button
                title="Maintain"
                onPress={() => setWeightGoal("maintain")}
                variant={weightGoal === "maintain" ? "primary" : "outline"}
                size="small"
                style={styles.optionButton}
              />
              <Button
                title="Gain Weight"
                onPress={() => setWeightGoal("gain")}
                variant={weightGoal === "gain" ? "primary" : "outline"}
                size="small"
                style={styles.optionButton}
              />
            </View>
          </View>

          <Button
            title="Save Preferences"
            onPress={handleSaveProfile}
            style={styles.saveButton}
          />
        </Card>

        <Card style={styles.settingsCard}>
          <Text style={styles.cardTitle}>Settings</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingLabel}>Notifications</Text>
              <Text style={styles.settingDescription}>
                Receive updates about new features
              </Text>
            </View>
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{ false: Colors.inactive, true: Colors.primary }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingLabel}>Dark Mode</Text>
              <Text style={styles.settingDescription}>
                Switch between light and dark theme
              </Text>
            </View>
            <Switch
              value={false}
              onValueChange={() => {}}
              trackColor={{ false: Colors.inactive, true: Colors.primary }}
              thumbColor="#fff"
            />
          </View>
        </Card>

        <Button
          title="Log Out"
          onPress={handleLogout}
          variant="outline"
          icon={<LogOut size={20} color={Colors.primary} />}
          style={styles.logoutButton}
        />
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
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  profileEmail: {
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
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 4,
  },
  profileCard: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
  },
  editForm: {
    marginTop: 8,
  },
  saveButton: {
    marginTop: 16,
  },
  profileInfo: {
    marginTop: 8,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  infoLabel: {
    width: 120,
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: Colors.textLight,
  },
  preferencesCard: {
    marginBottom: 16,
  },
  preferenceSection: {
    marginTop: 16,
    marginBottom: 8,
  },
  preferenceTitle: {
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
  settingsCard: {
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
  settingDescription: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 2,
  },
  logoutButton: {
    marginBottom: 30,
  },
});
