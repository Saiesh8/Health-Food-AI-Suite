import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { FileText, Calendar, AlertCircle } from "lucide-react-native";
import { HealthAnalysis } from "@/types";
import Colors from "@/constants/colors";

interface HealthAnalysisCardProps {
  analysis: HealthAnalysis;
  onPress: () => void;
}

const HealthAnalysisCard: React.FC<HealthAnalysisCardProps> = ({
  analysis,
  onPress,
}) => {
  const { type, imageUri, findings, recommendations, createdAt } = analysis;

  const getTypeText = () => {
    switch (type) {
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

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Default image based on type
  const getDefaultImage = () => {
    switch (type) {
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
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.header}>
        <View style={styles.typeContainer}>
          <View style={[styles.badge, { backgroundColor: getTypeColor(type) }]}>
            <Text style={styles.badgeText}>{getTypeText()}</Text>
          </View>
          <View style={styles.dateContainer}>
            <Calendar size={14} color={Colors.textLight} />
            <Text style={styles.dateText}>{formatDate(createdAt)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.contentContainer}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <Image
            source={{ uri: getDefaultImage() }}
            style={styles.image}
            resizeMode="cover"
          />
        )}

        <View style={styles.textContainer}>
          <Text style={styles.findingsTitle}>Findings:</Text>
          <Text style={styles.findingsText} numberOfLines={3}>
            {findings}
          </Text>

          {recommendations.length > 0 && (
            <View style={styles.recommendationsContainer}>
              <Text style={styles.recommendationsTitle}>Recommendations:</Text>
              <View style={styles.recommendationsList}>
                {recommendations.slice(0, 2).map((recommendation, index) => (
                  <View key={index} style={styles.recommendationItem}>
                    <AlertCircle size={14} color={Colors.primary} />
                    <Text style={styles.recommendationText} numberOfLines={1}>
                      {recommendation}
                    </Text>
                  </View>
                ))}
                {recommendations.length > 2 && (
                  <Text style={styles.moreText}>
                    + {recommendations.length - 2} more
                  </Text>
                )}
              </View>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "xray":
      return "#E3F2FD"; // Light blue
    case "mri":
      return "#E8F5E9"; // Light green
    case "ct":
      return "#FFF3E0"; // Light orange
    case "report":
      return "#F3E5F5"; // Light purple
    default:
      return "#F5F5F5"; // Light gray
  }
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
  header: {
    padding: 16,
    paddingBottom: 12,
  },
  typeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: Colors.highlight,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.primary,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 12,
    color: Colors.textLight,
    marginLeft: 4,
  },
  contentContainer: {
    flexDirection: "row",
    padding: 16,
    paddingTop: 0,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  findingsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  findingsText: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
    marginBottom: 8,
  },
  recommendationsContainer: {
    marginTop: 4,
  },
  recommendationsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  recommendationsList: {
    gap: 4,
  },
  recommendationItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  recommendationText: {
    fontSize: 14,
    color: Colors.textLight,
    flex: 1,
  },
  moreText: {
    fontSize: 12,
    color: Colors.primary,
    marginTop: 4,
  },
});

export default HealthAnalysisCard;
