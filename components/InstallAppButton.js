import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function InstallAppButton({ style }) {
  return (
    <View style={{ alignItems: "center" }}>
      
      {/* TEMP TEST BUTTON — always visible */}
      <TouchableOpacity
        style={[styles.button, style]}
        onPress={() => alert("Install button clicked (test mode)")}
      >
        <Text style={styles.text}>Install Call a Catcher</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#1565c0",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  text: {
    color: "white",
    fontWeight: "600",
  },
});