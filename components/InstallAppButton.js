import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";

export default function InstallAppButton({ style }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (Platform.OS !== "web") return;
    if (typeof window === "undefined") return;

    // ✅ Detect if already installed
    const isStandalone =
      window.matchMedia?.("(display-mode: standalone)")?.matches ||
      window.navigator?.standalone === true;

    if (isStandalone) {
      setInstalled(true);
      return;
    }

    // ✅ Listen for install prompt (Chrome / Edge)
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // ✅ Detect install completion
    const installedHandler = () => {
      setInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("appinstalled", installedHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      alert("Install not available yet. Try again after interacting with the page.");
      return;
    }

    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice?.outcome === "accepted") {
      setInstalled(true);
    }

    setDeferredPrompt(null);
  };

  // ❌ Hide if already installed
  if (installed) return null;

  return (
    <View style={{ alignItems: "center" }}>

      {/* ✅ Chrome / Edge install button */}
      {deferredPrompt && (
        <TouchableOpacity
          style={[styles.button, style]}
          onPress={handleInstall}
        >
          <Text style={styles.text}>Install Call a Catcher</Text>
        </TouchableOpacity>
      )}

      {/* ⏳ Waiting state */}
      {!deferredPrompt && (
        <Text style={styles.infoText}>
          Install option will appear after interacting with the app
        </Text>
      )}

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
  infoText: {
    fontSize: 12,
    color: "#555",
    textAlign: "center",
    marginTop: 5,
  },
});