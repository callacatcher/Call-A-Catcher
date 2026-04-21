import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Linking,
  ScrollView
} from "react-native";

import ScreenFooter from "../components/ScreenFooter";
import { stylesheet as styles } from "../styles/stylesheet";

export default function InstallScreen({ onBack }) {
  return (
    <View style={styles.container}>

      {/* HEADER (same as SignupScreen) */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack} style={styles.homeButton}>
          <Text style={styles.homeButtonText}>← Back</Text>
        </TouchableOpacity>

        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
        />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>

        {/* TITLE */}
        <Text style={[styles.title, { marginTop: 30 }]}>
          Install Call-A-Catcher
        </Text>

        {/* MAIN INSTRUCTIONS */}
        <Text style={{ marginVertical: 20, textAlign: "center" }}>
          Follow the steps below to install the app on your device:
        </Text>

        {/* ANDROID */}
        <Text style={styles.sectionTitle}>
          📱 Chrome / Edge (Android)
        </Text>
        <Text style={styles.text}>
          1. Tap the three dots (⋮) in the top right{"\n"}
          2. Tap “Install app” or “Add to Home Screen”{"\n"}
          3. Confirm install
        </Text>

        {/* IOS */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
          🍎 Safari (iPhone)
        </Text>
        <Text style={styles.text}>
          1. Tap the Share button (⬆️){"\n"}
          2. Scroll down and tap “Add to Home Screen”{"\n"}
          3. Tap Add
        </Text>

        {/* TIP */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
        💡 Tip
        </Text>
        <Text style={styles.text}>
          
          Installing the app gives you faster access, offline feel, and full-screen mode.
        </Text>

        {/* OPTIONAL EMAIL STYLE BUTTON (kept simple like Signup feel) */}
        <TouchableOpacity
          style={{ 
            marginTop: 100,
            backgroundColor: "#124bb6",
            padding: 12,
            borderRadius: 8,
            marginTop: 20,
            alignItems: "center"
          }}
          onPress={() => Linking.openURL("mailto:callacatcher@gmail.com")}
        >
          <Text>📧 Need help? Contact us</Text>
        </TouchableOpacity>

        {/* IMAGE (same idea as SignupScreen) */}
        <Image
          source={require("../assets/signup_photo.jpg")}
          style={{
            width: "100%",
            height: 260,
            resizeMode: "contain",
            marginVertical: 20,
          }}
        />

      </ScrollView>

      {/* FOOTER (same as SignupScreen) */}
      <ScreenFooter showAd="signup" />

    </View>
  );
}