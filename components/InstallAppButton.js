import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";

export default function InstallAppButton({ style }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (Platform.OS !== "web") return;
    if (typeof window === "undefined") return;

    // ✅ Check if already installed
    const isStandalone =
      window.matchMedia?.("(display-mode: standalone)")?.matches ||
      window.navigator?.standalone === true;

    if (isStandalone) {
      setInstalled(true);
      return;
    }

    // ✅ Capture install event (Chrome / Edge only)
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // ✅ Detect successful install
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
      alert("Install is not available yet. Open the app in Chrome and try again.");
      return;
    }

    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice?.outcome === "accepted") {
      setInstalled(true);
    }

    setDeferredPrompt(null);
  };

  // ❌ Hide completely if already installed
  if (installed) return null;

  return (
    <View style={{ alignItems: "center" }}>

      <TouchableOpacity
        style={[
          styles.button,
          style,
          !deferredPrompt && styles.disabled
        ]}
        onPress={handleInstall}
        disabled={!deferredPrompt}
      >
        <Text style={styles.text}>
          {deferredPrompt
            ? "Install Call a Catcher"
            : "Preparing Install..."}
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#1565c0",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: "white",
    fontWeight: "600",
  },
});