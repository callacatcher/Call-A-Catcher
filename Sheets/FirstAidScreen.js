/* =========================
     FIRST AID SCREEN
  ========================= */

import React from "react";
import { View, Text, TouchableOpacity, Image, Linking } from "react-native";
import ScreenFooter from "../components/ScreenFooter";
import { stylesheet as styles } from "../styles/stylesheet";

export default function FirstAidScreen({ onBack }) {
  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack} style={styles.homeButton}>
          <Text style={styles.homeButtonText}>← Back</Text>
        </TouchableOpacity>

        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
        />
      </View>

      {/* TITLE */}
      <Text style={styles.title}>Snake Bite First Aid</Text>

      {/* CONTENT AREA */}
      <View style={styles.card2}>

        <Text style={[styles.stepTitle, { color: "#d32f2f" }]}>
          S — STAY STILL
        </Text>
        <View style={styles.bullets}>
          <Text style={styles.bullet}>• Do NOT move the affected limb</Text>
          <Text style={styles.bullet}>• Movement spreads venom quickly
          </Text>
        </View>

        <Text style={[styles.stepTitle, { color: "#1565c0" }]}>
          T — TALK TO 000
        </Text>
        <View style={styles.bullets}>
          <Text style={styles.bullet}>• Call emergency services immediately</Text>
          <Text style={styles.bullet}>• Use speaker mode</Text>
        </View>

        <Text style={[styles.stepTitle, { color: "#6a1b9a" }]}>
          O — OBSERVE ONLY
        </Text>
        <View style={styles.bullets}>
          <Text style={styles.bullet}>• Do NOT try to identify the snake</Text>
          <Text style={styles.bullet}>• Do not photograph or chase it</Text>
        </View>

        <Text style={[styles.stepTitle, { color: "#2e7d32" }]}>
          P — PRESSURE BANDAGE
        </Text>
        <View style={styles.bullets}>
          <Text style={styles.bullet}>• Apply only if instructed by 000</Text>
          <Text style={styles.bullet}>• Keep limb completely still</Text>
        </View>

        <Text style={[styles.stepTitle, { color: "#ef6c00" }]}>
          ⚠️ EXTRA
        </Text>
        <View style={styles.bullets}>
          <Text style={styles.bullet}>• Remove rings if safe</Text>
          <Text style={styles.bullet}>• Keep person calm</Text>
        </View>

      </View>

      {/* EMERGENCY BUTTON */}
      <TouchableOpacity
        style={styles.emergencyButton2}
        onPress={() => Linking.openURL("tel:000")}
      >
        <Text style={styles.emergencyText}>
          🚨 Call 000 Emergency
        </Text>
      </TouchableOpacity>

      {/* FOOTER */}
      <ScreenFooter showAd="firstaid" />

    </View>
  );
}