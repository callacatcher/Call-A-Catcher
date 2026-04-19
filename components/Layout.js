import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

export default function Layout({ children, onHomePress }) {
  return (
    <View style={styles.container}>

      {/* 🔝 Top Bar (matches your current app) */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onHomePress} style={styles.homeButton}>
          <Text style={styles.homeButtonText}>← Home</Text>
        </TouchableOpacity>

        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
        />
      </View>

      {/* 📄 Page Content */}
      <View style={styles.content}>
        {children}
      </View>

      {/* 🔻 Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          App made by Hodgsons Snakes
        </Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60, // matches your app
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  homeButton: {
    position: "absolute",
    left: 20,
    top: 10,
    zIndex: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#eee",
    borderRadius: 6,
  },

  homeButtonText: {
    fontWeight: "bold",
    color: "#333",
  },

  logo: {
    width: "100%",
    height: 120,
    resizeMode: "contain",
    marginBottom: 10,
  },

  content: {
    flex: 1,
    paddingHorizontal: 20, // matches your container padding
  },

  footer: {
    padding: 10,
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ccc",
  },

  footerText: {
    fontSize: 12,
    color: "#555",
  },
});