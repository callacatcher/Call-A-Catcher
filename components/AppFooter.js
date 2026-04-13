import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export default function AppFooter() {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>
        App made by Hodgsons Snakes
      </Text>

      <Image
        source={require("../assets/footer_logo.png")}
        style={styles.footerLogo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    marginTop: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  footerText: {
    fontSize: 12,
    color: "#777",
    fontWeight: "500",
    marginRight: 8,
  },

  footerLogo: {
    width: 20,
    height: 20,
  },
});