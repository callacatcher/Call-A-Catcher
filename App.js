/* =========================
     CALL A Catcher App
  ========================= */
console.log("🔥 BUILD CHECK CATCHERS VERSION:", CATCHERS_DATA.version);
// IMPORTS
import { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Linking,
  Image,
  Platform,
  ActivityIndicator
} from "react-native";

import { StatusBar } from "expo-status-bar";
import * as Clipboard from "expo-clipboard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { CATCHERS_DATA } from "./data/catchers";

import AppFooter from "./components/AppFooter";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import WebAdBanner from "./components/WebAdBanner";
import ScreenFooter from "./components/ScreenFooter";
import { stylesheet as styles } from "./styles/stylesheet";
import FirstAidScreen from "./Sheets/FirstAidScreen";
import SignupScreen from "./Sheets/SignupScreen";
import MainScreen from "./Sheets/MainScreen";

const APP_STORE_LINK = "";
const PLAY_STORE_LINK = "";

export default function App() {
  const [screen, setScreen] = useState("home");

  const [postcode, setPostcode] = useState("");
  const [results, setResults] = useState([]);
  const [nearbyResults, setNearbyResults] = useState([]);
  const [catchers, setCatchers] = useState([]);

  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");

  const [showNotice, setShowNotice] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const [pinned, setPinned] = useState([]);
  const [dataReady, setDataReady] = useState(false);
  const priorityIds = ["3"];
  const isWeb = Platform.OS === "web";

  const withLoading = async (fn) => {
  try {
    setLoading(true);
    await fn();
  } finally {
    setLoading(false);
  }
};

  /* =========================
     ADSENSE
  ========================= */
  useEffect(() => {
    if (isWeb) {
      const script = document.createElement("script");
      script.async = true;
      script.src =
        "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3658953223794524";
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);

      const meta = document.createElement("meta");
      meta.name = "google-adsense-account";
      meta.content = "ca-pub-3658953223794524";
      document.head.appendChild(meta);
    }
  }, []);

  /* =========================
     LOAD DATA (NO CACHE)
  ========================= */
  useEffect(() => {
    const loadCatchers = async () => {
      setCatchers(CATCHERS_DATA.data);
      setDataReady(true);
    };

    loadCatchers();
  }, []);

  /* =========================
     PIN SYSTEM
  ========================= */
  useEffect(() => {
    const loadPinned = async () => {
      const stored = await AsyncStorage.getItem("pinned_catchers");
      if (stored) setPinned(JSON.parse(stored).map(String));
    };
    loadPinned();
  }, []);

  const savePinned = async (updated) => {
    setPinned(updated);
    await AsyncStorage.setItem(
      "pinned_catchers",
      JSON.stringify(updated)
    );
  };

  const togglePin = (id) => {
    const safeId = String(id);

    const updated = pinned.includes(safeId)
      ? pinned.filter((p) => p !== safeId)
      : [...pinned, safeId];

    savePinned(updated);
  };

  /* =========================
     NOTICE
  ========================= */
  useEffect(() => {
    const checkNotice = async () => {
      const last = await AsyncStorage.getItem("notice_last_shown");

      if (!last) {
        setShowNotice(true);
        return;
      }

      const diffDays =
        (new Date() - new Date(last)) / (1000 * 60 * 60 * 24);

      if (diffDays >= 30) setShowNotice(true);
    };

    checkNotice();
  }, []);

  /* =========================
     SEARCH
  ========================= */
  const performSearch = async (value) => {
    setError("");
    setWarning("");

    const clean = value.trim();

    if (!clean || clean.length < 3) {
      setError("Please enter a valid postcode");
      return;
    }

    const prefix = clean.slice(0, 3);

    const exact = catchers.filter(
      (c) =>
        Array.isArray(c.postcodes) &&
        c.postcodes.includes(clean)
    );

    const nearby = catchers.filter(
      (c) =>
        Array.isArray(c.postcodes) &&
        c.postcodes.some((p) => p.startsWith(prefix))
    );

    if (exact.length > 0) {
      setResults(exact);
      setNearbyResults([]);
      setError("");
      setWarning("");
    } else if (nearby.length > 0) {
      setResults(nearby);
      setNearbyResults(nearby);
      setWarning("We can’t find an exact match, but these may be close");
      setError("");
    } else {
      setResults([]);
      setNearbyResults([]);
      setError(
        "No catchers found nearby. Try 'View All Catchers'."
      );
      setWarning("");
    }

    setHasSearched(true);
  };

  const search = () => {
    setError("");
    setWarning("");
    performSearch(postcode);
  };

  /* =========================
     GPS
  ========================= */
  const useMyLocation = async () => {
    setLoading(true);

    try {
      let { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setError("Location permission denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

     const response = await fetch(
  `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
  {
    headers: {
      "User-Agent": "call-a-catcher-app"
    }
  }
);

     const data = await response.json();

console.log("📍 RAW GPS RESPONSE:", data);

const detectedPostcode = data?.address?.postcode;

console.log("📍 DETECTED POSTCODE:", detectedPostcode);

      if (!detectedPostcode) {
        setError("Could not detect postcode");
        return;
      }

      setPostcode(detectedPostcode);
      await performSearch(detectedPostcode);
    } catch (err) {
      setError("GPS error, try manual postcode");
    } finally {
      setLoading(false);
    }
  };

  const handlePostcodeChange = (text) => {
    setPostcode(text.replace(/\D/g, ""));
    setHasSearched(false);
    setError("");
    setWarning("");
  };

  const resetSearch = () => {
    setPostcode("");
    setHasSearched(false);
    setResults([]);
    setNearbyResults([]);
    setError("");
    setWarning("");
  };

  /* =========================
     LIST LOGIC (PIN SYSTEM)
  ========================= */
  const searchActive = hasSearched && results.length > 0;

  const baseList = searchActive ? results : catchers;

  const pinnedOnly = catchers.filter((c) =>
    pinned.includes(String(c.id))
  );

  const pinnedInSearch = searchActive
    ? baseList.filter((c) => pinned.includes(String(c.id)))
    : [];

  const unpinned = searchActive
    ? baseList.filter((c) => !pinned.includes(String(c.id)))
    : showAll
    ? catchers.filter((c) => !pinned.includes(String(c.id)))
    : [];

  const displayData = searchActive
    ? [...pinnedInSearch, ...unpinned]
    : showAll
    ? catchers
    : pinnedOnly;

  /* =========================
     LOADING SCREEN
  ========================= */
  if (!dataReady) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Loading catchers...</Text>
      </View>
    );
  }

  /* =========================
     NOTICE SCREEN
  ========================= */
  if (showNotice) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Important Notice</Text>

        <Text style={styles.noticeText}>
          Welcome to Call-A-Catcher.
        </Text>

        <TouchableOpacity
          style={styles.noticeButton}
          onPress={async () => {
            await AsyncStorage.setItem(
              "notice_last_shown",
              new Date().toISOString()
            );
            setShowNotice(false);
          }}
        >
          <Text>I Understand</Text>
        </TouchableOpacity>

        <AppFooter />
      </View>
    );
  }

  /* =========================
     ROUTES
  ========================= */
  if (screen === "signup") {
    return <SignupScreen onBack={() => setScreen("home")} />;
  }

  if (screen === "firstAid") {
    return <FirstAidScreen onBack={() => setScreen("home")} />;
  }

  /* =========================
     MAIN APP
  ========================= */
  return (
    <MainScreen
  postcode={postcode}
  setPostcode={setPostcode}
  error={error}
  warning={warning}
  loading={loading}
  showAll={showAll}
  setShowAll={setShowAll}
  search={search}
  useMyLocation={useMyLocation}
  withLoading={withLoading}   // ✅ ADD THIS
  displayData={displayData}
  pinned={pinned}
  togglePin={togglePin}
  priorityIds={priorityIds}   // ✅ also pass this (you’re using it in MainScreen)
  handlePostcodeChange={handlePostcodeChange}
  resetSearch={resetSearch}
  onSignup={() => setScreen("signup")}
  onFirstAid={() => setScreen("firstAid")}
  APP_STORE_LINK={APP_STORE_LINK}
  PLAY_STORE_LINK={PLAY_STORE_LINK}
/>
  );
}
// END