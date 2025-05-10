import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import {
  ArrowLeft,
  Calendar,
  AlertCircle,
  FileText,
  Utensils,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import Button from "@/components/Button";
import { useHealthAnalysisStore } from "@/store/healthAnalysisStore";
import Colors from "@/constants/colors";

export default function HealthAnalysisDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { analyses } = useHealthAnalysisStore();

  const analysis = analyses.find((a) => a.id === id);

  if (!analysis) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Health analysis not found</Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTypeText = () => {
    switch (analysis.type) {
      case "xray":
        return "X-Ray Analysis";
      case "mri":
        return "MRI Analysis";
      case "ct":
        return "CT Scan Analysis";
      case "report":
        return "Health Report Analysis";
      default:
        return "Medical Analysis";
    }
  };

  // Default image based on type
  const getDefaultImage = () => {
    switch (analysis.type) {
      case "xray":
        return "https://images.unsplash.com/photo-1582560475093-ba66accbc7f9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80";
      case "mri":
        return "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80";
      case "ct":
        return "https://images.unsplash.com/photo-1579154204601-01588f351e67?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80";
      case "report":
        return "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80";
      default:
        return "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80";
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: getTypeText(),
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

          <Text style={styles.title}>{getTypeText()}</Text>

          <View style={styles.dateContainer}>
            <Calendar size={18} color="#fff" />
            <Text style={styles.dateText}>
              {formatDate(analysis.createdAt)}
            </Text>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {analysis.type !== "report" && (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: analysis.imageUri || getDefaultImage() }}
                style={styles.image}
                resizeMode="contain"
              />
            </View>
          )}

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <FileText size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Findings</Text>
            </View>
            <Text style={styles.findingsText}>{analysis.findings}</Text>
          </View>

          {analysis.recommendations.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <AlertCircle size={20} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Recommendations</Text>
              </View>
              {analysis.recommendations.map((recommendation, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <View style={styles.bullet} />
                  <Text style={styles.recommendationText}>
                    {recommendation}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {analysis.dietRecommendations &&
            analysis.dietRecommendations.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Utensils size={20} color={Colors.primary} />
                  <Text style={styles.sectionTitle}>
                    Dietary Recommendations
                  </Text>
                </View>
                {analysis.dietRecommendations.map((recommendation, index) => (
                  <View key={index} style={styles.recommendationItem}>
                    <View style={styles.bullet} />
                    <Text style={styles.recommendationText}>
                      {recommendation}
                    </Text>
                  </View>
                ))}
              </View>
            )}

          <View style={styles.disclaimerContainer}>
            <Text style={styles.disclaimerText}>
              Note: This analysis is for educational purposes only and not a
              substitute for professional medical advice. Always consult with a
              healthcare provider for medical concerns.
            </Text>
          </View>
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
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 14,
    color: "#fff",
    marginLeft: 8,
  },
  content: {
    padding: 20,
  },
  imageContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginLeft: 8,
  },
  findingsText: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
  },
  recommendationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginRight: 12,
    marginTop: 8,
  },
  recommendationText: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
  },
  disclaimerContainer: {
    backgroundColor: "rgba(74, 144, 226, 0.1)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 30,
  },
  disclaimerText: {
    fontSize: 14,
    color: Colors.textLight,
    fontStyle: "italic",
    lineHeight: 20,
    textAlign: "center",
  },
});
