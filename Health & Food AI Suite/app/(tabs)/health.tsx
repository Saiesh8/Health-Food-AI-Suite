import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { FileText, Image as ImageIcon, Plus } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import Button from "@/components/Button";
import ImagePickerButton from "@/components/ImagePickerButton";
import HealthAnalysisCard from "@/components/HealthAnalysisCard";
import LoadingOverlay from "@/components/LoadingOverlay";
import { useHealthAnalysisStore } from "@/store/healthAnalysisStore";
import { HealthAnalysis } from "@/types";
import Colors from "@/constants/colors";
import {
  generateAIResponse,
  createHealthAnalysisPrompt,
  createHealthReportAnalysisPrompt,
  parseHealthAnalysisFromAI,
} from "@/utils/ai";

export default function HealthScreen() {
  const router = useRouter();
  const { analyses, addAnalysis, setCurrentAnalysis } =
    useHealthAnalysisStore();

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");
  const [showForm, setShowForm] = useState(false);
  const [analysisType, setAnalysisType] = useState<
    "xray" | "mri" | "ct" | "report"
  >("xray");
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [reportText, setReportText] = useState("");

  const handleAnalysisPress = (analysis: HealthAnalysis) => {
    setCurrentAnalysis(analysis);
    router.push(`/health-analysis/${analysis.id}`);
  };

  const handleImageSelected = async (base64: string, uri: string) => {
    try {
      setIsLoading(true);
      setLoadingMessage(`Analyzing ${analysisType.toUpperCase()} image...`);

      // Generate health analysis using AI
      const analysisPrompt = createHealthAnalysisPrompt(base64, analysisType);
      const analysisResponse = await generateAIResponse(analysisPrompt);

      // Parse the AI response
      const parsedAnalysis = parseHealthAnalysisFromAI(analysisResponse);

      // Create the health analysis
      const newAnalysis: HealthAnalysis = {
        id: Date.now().toString(),
        type: analysisType,
        imageUri: uri,
        findings: parsedAnalysis.findings,
        recommendations: parsedAnalysis.recommendations,
        dietRecommendations: parsedAnalysis.dietRecommendations,
        createdAt: Date.now(),
      };

      // Add the analysis to the store
      addAnalysis(newAnalysis);

      // Navigate to the analysis details
      setCurrentAnalysis(newAnalysis);
      router.push(`/health-analysis/${newAnalysis.id}`);

      // Reset form
      setShowForm(false);
      setShowImagePicker(false);
    } catch (error) {
      console.error("Error analyzing image:", error);
      Alert.alert(
        "Error",
        "An error occurred while analyzing the image. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReportAnalysis = async () => {
    if (!reportText.trim()) {
      Alert.alert("Error", "Please enter your health report text.");
      return;
    }

    try {
      setIsLoading(true);
      setLoadingMessage("Analyzing health report...");

      // Generate health report analysis using AI
      const reportPrompt = createHealthReportAnalysisPrompt(reportText);
      const reportResponse = await generateAIResponse(reportPrompt);

      // Parse the AI response
      const parsedAnalysis = parseHealthAnalysisFromAI(reportResponse);

      // Create the health analysis
      const newAnalysis: HealthAnalysis = {
        id: Date.now().toString(),
        type: "report",
        findings: parsedAnalysis.findings,
        recommendations: parsedAnalysis.recommendations,
        dietRecommendations: parsedAnalysis.dietRecommendations,
        createdAt: Date.now(),
      };

      // Add the analysis to the store
      addAnalysis(newAnalysis);

      // Navigate to the analysis details
      setCurrentAnalysis(newAnalysis);
      router.push(`/health-analysis/${newAnalysis.id}`);

      // Reset form
      setShowForm(false);
      setReportText("");
    } catch (error) {
      console.error("Error analyzing report:", error);
      Alert.alert(
        "Error",
        "An error occurred while analyzing the report. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LoadingOverlay visible={isLoading} message={loadingMessage} />

      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientEnd]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>AI Health Analysis</Text>
        <Text style={styles.headerSubtitle}>
          Analyze medical images and health reports for insights and dietary
          recommendations
        </Text>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.createSection}>
          <Button
            title={showForm ? "Cancel" : "New Health Analysis"}
            onPress={() => {
              setShowForm(!showForm);
              setShowImagePicker(false);
            }}
            variant={showForm ? "outline" : "primary"}
            icon={showForm ? undefined : <Plus size={20} color="#fff" />}
            style={styles.createButton}
          />

          {showForm && (
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>Select Analysis Type</Text>

              <View style={styles.optionsContainer}>
                <Button
                  title="X-Ray"
                  onPress={() => {
                    setAnalysisType("xray");
                    setShowImagePicker(false);
                  }}
                  variant={analysisType === "xray" ? "primary" : "outline"}
                  size="small"
                  style={styles.optionButton}
                />
                <Button
                  title="MRI"
                  onPress={() => {
                    setAnalysisType("mri");
                    setShowImagePicker(false);
                  }}
                  variant={analysisType === "mri" ? "primary" : "outline"}
                  size="small"
                  style={styles.optionButton}
                />
                <Button
                  title="CT Scan"
                  onPress={() => {
                    setAnalysisType("ct");
                    setShowImagePicker(false);
                  }}
                  variant={analysisType === "ct" ? "primary" : "outline"}
                  size="small"
                  style={styles.optionButton}
                />
                <Button
                  title="Health Report"
                  onPress={() => {
                    setAnalysisType("report");
                    setShowImagePicker(false);
                  }}
                  variant={analysisType === "report" ? "primary" : "outline"}
                  size="small"
                  style={styles.optionButton}
                />
              </View>

              {analysisType !== "report" ? (
                <View style={styles.imageSection}>
                  <Text style={styles.sectionLabel}>
                    Upload {analysisType.toUpperCase()} Image:
                  </Text>

                  {showImagePicker ? (
                    <ImagePickerButton
                      onImageSelected={handleImageSelected}
                      title={`Select ${analysisType.toUpperCase()} Image`}
                    />
                  ) : (
                    <Button
                      title={`Select ${analysisType.toUpperCase()} Image`}
                      onPress={() => setShowImagePicker(true)}
                      icon={<ImageIcon size={20} color="#fff" />}
                      style={styles.uploadButton}
                    />
                  )}

                  <Text style={styles.disclaimer}>
                    Note: This analysis is for educational purposes only and not
                    a substitute for professional medical advice.
                  </Text>
                </View>
              ) : (
                <View style={styles.reportSection}>
                  <Text style={styles.sectionLabel}>
                    Enter Health Report Text:
                  </Text>

                  <TextInput
                    style={styles.reportInput}
                    value={reportText}
                    onChangeText={setReportText}
                    placeholder="Paste your health report text here..."
                    multiline
                    numberOfLines={8}
                    textAlignVertical="top"
                  />

                  <Button
                    title="Analyze Report"
                    onPress={handleReportAnalysis}
                    icon={<FileText size={20} color="#fff" />}
                    style={styles.analyzeButton}
                  />

                  <Text style={styles.disclaimer}>
                    Note: This analysis is for educational purposes only and not
                    a substitute for professional medical advice.
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        {analyses.length > 0 ? (
          <View style={styles.analysesSection}>
            <Text style={styles.sectionTitle}>Your Health Analyses</Text>
            {analyses.map((analysis) => (
              <HealthAnalysisCard
                key={analysis.id}
                analysis={analysis}
                onPress={() => handleAnalysisPress(analysis)}
              />
            ))}
          </View>
        ) : (
          !showForm && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>No Health Analyses Yet</Text>
              <Text style={styles.emptyStateText}>
                Upload medical images or health reports to get AI-powered
                analysis and dietary recommendations.
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
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  optionButton: {
    flex: 1,
    minWidth: 80,
  },
  imageSection: {
    marginTop: 8,
  },
  reportSection: {
    marginTop: 8,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
  },
  uploadButton: {
    marginBottom: 16,
  },
  analyzeButton: {
    marginTop: 16,
    marginBottom: 16,
  },
  reportInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    minHeight: 150,
    backgroundColor: "#fafafa",
  },
  disclaimer: {
    fontSize: 12,
    color: Colors.textLight,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 8,
  },
  analysesSection: {
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
