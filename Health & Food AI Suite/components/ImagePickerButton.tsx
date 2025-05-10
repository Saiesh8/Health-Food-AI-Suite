import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera, Image as ImageIcon, Upload } from "lucide-react-native";
import Button from "./Button";
import Colors from "@/constants/colors";

interface ImagePickerButtonProps {
  onImageSelected: (base64: string, uri: string) => void;
  title?: string;
  variant?: "primary" | "secondary" | "outline";
}

const ImagePickerButton: React.FC<ImagePickerButtonProps> = ({
  onImageSelected,
  title = "Select Image",
  variant = "primary",
}) => {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const selectedImage = result.assets[0];
        setImage(selectedImage.uri);

        // Get base64 data
        if (selectedImage.base64) {
          onImageSelected(selectedImage.base64, selectedImage.uri);
        } else {
          // If base64 is not available (shouldn't happen with our options)
          console.error("Base64 data not available");
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const takePhoto = async () => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== "granted") {
        alert("Sorry, we need camera permissions to make this work!");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const selectedImage = result.assets[0];
        setImage(selectedImage.uri);

        // Get base64 data
        if (selectedImage.base64) {
          onImageSelected(selectedImage.base64, selectedImage.uri);
        } else {
          // If base64 is not available (shouldn't happen with our options)
          console.error("Base64 data not available");
        }
      }
    } catch (error) {
      console.error("Error taking photo:", error);
    }
  };

  return (
    <View style={styles.container}>
      {image ? (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: image }} style={styles.imagePreview} />
          <View style={styles.buttonsContainer}>
            <Button
              title="Change"
              onPress={pickImage}
              variant="outline"
              size="small"
              icon={<Upload size={16} color={Colors.primary} />}
              style={styles.button}
            />
            {Platform.OS !== "web" && (
              <Button
                title="Camera"
                onPress={takePhoto}
                variant="outline"
                size="small"
                icon={<Camera size={16} color={Colors.primary} />}
                style={styles.button}
              />
            )}
          </View>
        </View>
      ) : (
        <View style={styles.buttonsContainer}>
          <Button
            title={title}
            onPress={pickImage}
            variant={variant}
            icon={
              <ImageIcon
                size={20}
                color={variant === "outline" ? Colors.primary : "#fff"}
              />
            }
            style={styles.button}
          />
          {Platform.OS !== "web" && (
            <Button
              title="Take Photo"
              onPress={takePhoto}
              variant={variant === "primary" ? "outline" : variant}
              icon={
                <Camera
                  size={20}
                  color={variant !== "outline" ? "#fff" : Colors.primary}
                />
              }
              style={styles.button}
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 16,
  },
  imagePreviewContainer: {
    alignItems: "center",
    width: "100%",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 12,
  },
  button: {
    minWidth: 120,
  },
});

export default ImagePickerButton;
