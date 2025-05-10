import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ChefHat, Utensils, Salad, Activity } from "lucide-react-native";
import Button from "@/components/Button";
import Colors from "@/constants/colors";

export default function WelcomeScreen() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.replace("/(auth)/signup");
  };

  const handleLogin = () => {
    router.replace("/(auth)/login");
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientEnd]}
        style={styles.header}
      >
        <View style={styles.logoContainer}>
          <ChefHat size={48} color="#fff" />
        </View>
        <Text style={styles.title}>Health & Food AI Suite</Text>
        <Text style={styles.subtitle}>
          Your personal AI-powered nutrition and health assistant
        </Text>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionTitle}>Discover What We Offer</Text>

        <View style={styles.featureCard}>
          <View style={styles.featureIconContainer}>
            <Utensils size={24} color={Colors.primary} />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>AI Recipe Generation</Text>
            <Text style={styles.featureDescription}>
              Take a photo of ingredients or enter what you have, and get
              delicious recipe suggestions instantly.
            </Text>
          </View>
        </View>

        <View style={styles.featureCard}>
          <View style={styles.featureIconContainer}>
            <Salad size={24} color={Colors.primary} />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Personalized Meal Plans</Text>
            <Text style={styles.featureDescription}>
              Get customized meal plans based on your dietary preferences and
              weight goals.
            </Text>
          </View>
        </View>

        <View style={styles.featureCard}>
          <View style={styles.featureIconContainer}>
            <Activity size={24} color={Colors.primary} />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Health Analysis</Text>
            <Text style={styles.featureDescription}>
              Analyze medical images and health reports to get insights and
              dietary recommendations.
            </Text>
          </View>
        </View>

        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
          }}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.buttonContainer}>
          <Button
            title="Get Started"
            onPress={handleGetStarted}
            size="large"
            style={styles.button}
          />
          <Button
            title="I already have an account"
            onPress={handleLogin}
            variant="outline"
            style={styles.button}
          />
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
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    marginTop: 8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 20,
    marginTop: 10,
  },
  featureCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(74, 144, 226, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    marginVertical: 20,
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 30,
  },
  button: {
    marginBottom: 12,
  },
});
