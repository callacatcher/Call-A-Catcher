import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";

export default function WebAdBanner({ type = "default" }) {
  const isWeb = Platform.OS === "web";

  const getText = () => {
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
    <View style={styles.wrapper}>
      <View style={styles.adBox}>
        <Text style={styles.text}>{getText()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    alignItems: "center",
  },

  adBox: {
    width: "100%",
    maxWidth: 365,
    height: 30,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },

  text: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
});