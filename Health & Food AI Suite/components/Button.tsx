import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/colors";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "text";
  size?: "small" | "medium" | "large";
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  icon,
  iconPosition = "left",
}) => {
  const getButtonStyles = () => {
    const baseStyle: ViewStyle = {
      ...styles.button,
      ...sizeStyles[size],
      opacity: disabled ? 0.6 : 1,
    };

    switch (variant) {
      case "primary":
        return baseStyle;
      case "secondary":
        return {
          ...baseStyle,
          backgroundColor: Colors.secondary,
        };
      case "outline":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: Colors.primary,
        };
      case "text":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          elevation: 0,
          shadowOpacity: 0,
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyles = () => {
    const baseStyle: TextStyle = {
      ...styles.text,
      ...textSizeStyles[size],
    };

    switch (variant) {
      case "outline":
        return {
          ...baseStyle,
          color: Colors.primary,
        };
      case "text":
        return {
          ...baseStyle,
          color: Colors.primary,
        };
      default:
        return baseStyle;
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <ActivityIndicator
          color={
            variant === "outline" || variant === "text"
              ? Colors.primary
              : "#fff"
          }
        />
      );
    }

    if (icon && iconPosition === "left") {
      return (
        <>
          {icon}
          <Text style={[getTextStyles(), textStyle, { marginLeft: 8 }]}>
            {title}
          </Text>
        </>
      );
    }

    if (icon && iconPosition === "right") {
      return (
        <>
          <Text style={[getTextStyles(), textStyle, { marginRight: 8 }]}>
            {title}
          </Text>
          {icon}
        </>
      );
    }

    return <Text style={[getTextStyles(), textStyle]}>{title}</Text>;
  };

  if (variant === "primary") {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || isLoading}
        style={[styles.buttonContainer, style]}
      >
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[getButtonStyles()]}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      style={[getButtonStyles(), style]}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const sizeStyles = {
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
};

const textSizeStyles = {
  small: {
    fontSize: 14,
  },
  medium: {
    fontSize: 16,
  },
  large: {
    fontSize: 18,
  },
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 10,
    overflow: "hidden",
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  text: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
});

export default Button;
