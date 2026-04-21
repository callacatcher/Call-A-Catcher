import React, { useEffect, useState } from "react";
import { View, Text, Platform, TouchableOpacity, StyleSheet } from "react-native";

export default function InstallAppButton({ style }) {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [browser, setBrowser] = useState("unknown");
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // 🚨 Safety: only run on web
    if (Platform.OS !== "web") return;
    if (typeof window === "undefined") return;

    // ✅ Detect if already installed (safe)
    const isStandalone =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(display-mode: standalone)").matches;

    const isIOSStandalone =
      typeof window !== "undefined" &&
      window.navigator &&
      window.navigator.standalone === true;

    if (isStandalone || isIOSStandalone) {
      setInstalled(true);
      return;
    }

    // ✅ Detect browser
    const ua = navigator.userAgent;

    if (/android/i.test(ua) && /chrome/i.test(ua)) {
      setBrowser("chrome");
    } else if (/iphone|ipad|ipod/i.test(ua) && /safari/i.test(ua)) {
      setBrowser("safari");
    } else {
      setBrowser("other");
    }

    // ✅ Capture install prompt (Chrome only)
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // ✅ Detect install completion
    const installedHandler = () => {
      setInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener("appinstalled", installedHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;

    installPrompt.prompt();
    const choice = await installPrompt.userChoice;

    if (choice?.outcome === "accepted") {
      setInstalled(true);
    }

    setInstallPrompt(null);
  };

  // ❌ Hide completely if:
  // - not web
  // - already installed
  if (Platform.OS !== "web" || installed) return null;

  return (
    <View style={{ alignItems: "center" }}>
      
      {/* ✅ Chrome (install button when available) */}
      {browser === "chrome" && installPrompt && (
        <TouchableOpacity
          style={[styles.button, style]}
          onPress={handleInstall}
        >
          <Text style={styles.text}>Install Call a Catcher</Text>
        </TouchableOpacity>
      )}

      {/* 🍎 Safari */}
      {browser === "safari" && (
        <Text style={styles.infoText}>
          Tap Share → "Add to Home Screen"
        </Text>
      )}

      {/* 🌐 Other browsers */}
      {browser === "other" && (
        <Text style={styles.infoText}>
          Use your browser menu to install this app
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