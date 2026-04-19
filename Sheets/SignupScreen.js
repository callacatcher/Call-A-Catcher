import React from "react";
import { View, Text, TouchableOpacity, Image, Linking } from "react-native";
import ScreenFooter from "../components/ScreenFooter";
import { stylesheet as styles } from "../styles/stylesheet";
import * as Clipboard from "expo-clipboard";

export default function SignupScreen({ onBack }) {
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

      {/* SCREEN TITLE */}
      <Text style={[styles.title, { marginTop: 30 }]}>
        Catcher Sign Up
      </Text>

      {/* INSTRUCTIONS TEXT */}
      <Text style={{ marginVertical: 20, textAlign: "center" }}>
        Copy this template and edit it with your details:
      </Text>

      {/* COPY TEMPLATE BUTTON */}
      <TouchableOpacity
        onPress={async () => {
          const text = `{
  name: "business name",
  phone: "0000000000",
  status: "24hr Emergency, 9-5 etc",
  postcodes: ["0000", "0001", "0002"],
}`;
          await Clipboard.setStringAsync(text);
          alert("Copied to clipboard");
        }}
        style={{
          backgroundColor: "#f2f2f2",
          padding: 10,
          borderRadius: 8,
        }}
      >
        <Text>
{`{
  name: "business name",
  phone: "0000000000",
  status: "24hr Emergency, 9-5 etc",
  postcodes: ["0000", "0001", "0002"],
}`}
        </Text>
      </TouchableOpacity>

      {/* WARNING TEXT */}
      <Text style={{ marginVertical: 10, textAlign: "center" }}>
        Do not remove any punctuation. Edit and send it to us.
      </Text>

      {/* EMAIL BUTTON */}
      <TouchableOpacity
        style={styles.signupemailButton}
        onPress={() =>
          Linking.openURL(
            "mailto:callacatcher@gmail.com?subject=New%20Catcher%20Submission"
          )
        }
      >
        <Text style={styles.emergencyText}>📧 Send via Email</Text>
      </TouchableOpacity>

      {/* SIGNUP IMAGE */}
      <Image
        source={require("../assets/signup_photo.jpg")}
        style={{
          width: "100%",
          height: 260,
          resizeMode: "contain",
          marginVertical: 20,
        }}
      />

      {/* FOOTER */}
      <ScreenFooter showAd="signup" />

    </View>
  );
}