/* =========================
     CALL A Catcher App
  ========================= */


 //IMPORTS//
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
import { catchers as initialCatchers } from "./data/catchers";
import AppFooter from "./components/AppFooter";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import WebAdBanner from "./components/WebAdBanner";
import ScreenFooter from "./components/ScreenFooter";
import { stylesheet as styles } from "./styles/stylesheet";
import FirstAidScreen from "./screens/FirstAidScreen";
import SignupScreen from "./screens/SignupScreen";
import MainScreen from "./screens/MainScreen";


const APP_STORE_LINK = "";
const PLAY_STORE_LINK = "";

export default function App() {
  const [screen, setScreen] = useState("home");
  
  const [postcode, setPostcode] = useState("");
  const [results, setResults] = useState([]);
  const [nearbyResults, setNearbyResults] = useState([]);
  const [catchers] = useState(initialCatchers);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [showNotice, setShowNotice] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [pinned, setPinned] = useState([]);
  const isWeb = Platform.OS === "web";

  const resetHome = () => {
  setResults([]);
  setNearbyResults([]);
  setError("");
  setWarning("");
  setHasSearched(false);
  setPostcode("");
};

  const withLoading = async (fn) => {
    try {
      setLoading(true);
      await fn();
    } finally {
      setLoading(false);
    }
  };

  const priorityIds = ["3"];

 const displayData =
  showAll
    ? catchers
    : hasSearched
    ? results
    : catchers.filter((c) => pinned.includes(String(c.id)));

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
} 
else if (nearby.length > 0) {
  setResults(nearby);
  setNearbyResults(nearby);
  setWarning("We can’t find an exact match, but these may be close");
  setError("");
} 
else {
  setResults([]);
  setNearbyResults([]);
  setError("We do not list anyone nearby. Tap 'View All Catchers' and call any listed catcher and they can help find someone in your area.");
  setWarning("");
}

    setHasSearched(true);
  };

  const search = () => {
  setError("");
  setWarning("");
  performSearch(postcode);
};

  const useMyLocation = async () => {
    setLoading(true);
    await new Promise(requestAnimationFrame);

    try {
      let { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setError("Location permission denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      const { latitude, longitude } = location.coords;

      const geo = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      const detectedPostcode = geo?.[0]?.postalCode;

      if (!detectedPostcode) {
        setError("GPS may not be accurate, try postcode search");
        return;
      }

      setPostcode(detectedPostcode);
      setHasSearched(true);
      await performSearch(detectedPostcode);

    } catch (err) {
      setError("GPS may not be accurate, try postcode search");

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

  /* =========================
     WELCOME NOTICE POP UP
  ========================= */
  if (showNotice) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Important Notice</Text>

        <Text style={styles.noticeText}>
          Welcome to the Call-A-Catcher Web App.
            This app works completely offline, 
                        BUT
        to Keep the Listings up to date, You will
                 need to be online.
      click the ⋮ in your top right corner, and select
      "add to homescreen" and it will look just like an
          app on your phone screen from now on.
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
          <Text style={styles.noticeButtonText}>I Understand</Text>
        </TouchableOpacity>
        
 <AppFooter />
      </View>
    );
  }

  /* =========================
   SIGNUP SCREEN
========================= */
if (screen === "signup") {
  return (
    <SignupScreen onBack={() => setScreen("home")} />
  );
}

/* =========================
   FIRST AID SCREEN
========================= */
if (screen === "firstAid") {
  return (
    <FirstAidScreen onBack={() => setScreen("home")} />
  );
}

  /* =========================
   MAIN SCREEN
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
    withLoading={withLoading}
    displayData={displayData}
    pinned={pinned}
    togglePin={togglePin}
    priorityIds={priorityIds}
    handlePostcodeChange={handlePostcodeChange}
    onSignup={() => setScreen("signup")}
    onFirstAid={() => setScreen("firstAid")}
    APP_STORE_LINK={APP_STORE_LINK}
    PLAY_STORE_LINK={PLAY_STORE_LINK}
  />
);
}
//END//

