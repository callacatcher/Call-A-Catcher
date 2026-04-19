import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";

const WebAdBanner = ({ type = "default" }) => {
  const isWeb = Platform.OS === "web";

  const getTitle = () => {
    if (isWeb) return "Advertisement";
    return "Ad Preview";
  };

  const getBody = () => {
    if (isWeb) return "AdSense Slot (Web Build)";
    
    switch (type) {
      case "home":
        return "Home Screen Ad Slot (Preview)";
      case "firstaid":
        return "First Aid Ad Slot (Preview)";
      case "signup":
        return "Sign Up Ad Slot (Preview)";
      default:
        return "Ad Slot Preview (Expo Go)";
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{getTitle()}</Text>

      <View style={styles.box}>
        <Text style={styles.text}>{getBody()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 0,
marginBottom: 0,
  },
  label: {
    fontSize: 5,
    color: "#999",
    marginBottom: 0

  },
  box: {
    width: "100%",
    maxWidth: 365,
    height: 40,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 0,

  },
  text: {
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 10,
  },
});

export default WebAdBanner;