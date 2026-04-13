import { useState, useEffect } from "react";
import {
  StyleSheet,
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
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

const APP_STORE_LINK = "";
const PLAY_STORE_LINK = "";

export default function App() {
  const [screen, setScreen] = useState("home");
  const [showFirstAid, setShowFirstAid] = useState(false);
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
  const AdBanner = () => {
  return (
    <BannerAd
      unitId="ca-app-pub-3940256099942544/6300978111"
      size={BannerAdSize.BANNER}
    />
  );
};
  

  const [pinned, setPinned] = useState([]);

  /* =========================
     GLOBAL LOADING WRAPPER
  ========================= */
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

  /* =========================
     GPS FIX (ONLY 3 CHANGES APPLIED HERE)
  ========================= */
  const useMyLocation = async () => {

    /* ✅ CHANGE 1: force spinner render BEFORE blocking GPS */
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
      /* ✅ CHANGE 2: always release loading state safely */
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
     NOTICE SCREEN
  ========================= */
  if (showNotice) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Important Notice</Text>

        <Text style={styles.noticeText}>
          This app does not update listings automatically.
          Please check the App Store regularly.
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
        {/* FOOTER */}
 <AppFooter />
      </View>
    );
  }

  /* =========================
     SIGNUP SCREEN
  ========================= */
  if (screen === "signup") {
    return (
      <View style={styles.container}>
        <Image
  source={require("./assets/logo.png")}
  style={styles.logo}
/>
        <Text style={styles.title}>Catcher Sign Up</Text>

        <Text style={{ marginVertical: 20, textAlign: "center" }}>
          Copy this template and edit it with your details:
        </Text>

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

        <Text style={{ marginVertical: 20, textAlign: "center" }}>
          Do not remove any punctuation. Edit and send it to us.
        </Text>

        <TouchableOpacity
          style={styles.emergencyButton}
          onPress={() =>
            Linking.openURL(
              "mailto:callacatcher@gmail.com?subject=New%20Catcher%20Submission"
            )
          }
        >
          <Text style={styles.emergencyText}>📧 Send via Email</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.signupButton, { marginTop: 10 }]}
          onPress={() => setScreen("home")}

          
          
        >
          <Text style={styles.signupText}>Back</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
              {/* FOOTER */}
      <AppFooter />
      </View>
    );
  }
  if (showFirstAid) {
  return (
    <View style={styles.container}>

      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => setShowFirstAid(false)}
          style={styles.homeButton}
        >
          <Text style={styles.homeButtonText}>← Back</Text>
        </TouchableOpacity>

        <Image
          source={require("./assets/logo.png")}
          style={styles.logo}
        />
      </View>

      <Text style={styles.title}>Snake Bite First Aid</Text>

      <View style={styles.card}>

<Text style={[styles.stepTitle, { color: "#d32f2f" }]}>
  S — STAY STILL
</Text>
<View style={styles.bullets}>
  <Text style={styles.bullet}>• Do NOT move the affected limb</Text>
  <Text style={styles.bullet}>• Movement spreads venom quickly</Text>
</View>

<View style={styles.section}>

  <Text style={[styles.stepTitle, { color: "#1565c0" }]}>
    T — TALK TO 000
  </Text>

  <View style={styles.bullets}>
    <Text style={styles.bullet}>• Call emergency services immediately</Text>
    <Text style={styles.bullet}>• Use speaker mode</Text>
  </View>

</View>

<View style={styles.section}>

  <Text style={[styles.stepTitle, { color: "#6a1b9a" }]}>
    O — OBSERVE ONLY
  </Text>

  <View style={styles.bullets}>
    <Text style={styles.bullet}>• Do NOT try to identify the snake</Text>
    <Text style={styles.bullet}>• Do not photograph or chase it</Text>
  </View>

</View>

<View style={styles.section}>

  <Text style={[styles.stepTitle, { color: "#2e7d32" }]}>
    P — PRESSURE BANDAGE
  </Text>

  <View style={styles.bullets}>
    <Text style={styles.bullet}>• Apply firm pressure bandage, IF 000 DDIRECT YOU TO</Text>
    <Text style={styles.bullet}>• Keep limb completely still</Text>
  </View>

</View>

<View style={[styles.section, styles.extraSection]}>

  <Text style={[styles.stepTitle, { color: "#ef6c00" }]}>
    ⚠️ EXTRA
  </Text>

  <View style={styles.bullets}>
    <Text style={styles.bullet}>• Remove rings if safe</Text>
    <Text style={styles.bullet}>• Keep person calm</Text>
  </View>

</View>

</View>

      <View style={{ flex: 1 }} />

      <TouchableOpacity
  style={styles.emergencyButton}
  onPress={() => Linking.openURL("tel:000")}
>
  <Text style={styles.emergencyText}>
    🚨 Call 000 Emergency
  </Text>
</TouchableOpacity>

      <AppFooter />
    </View>
  );
}

  /* =========================
     MAIN APP
  ========================= */
  return (
    <View style={styles.container}>
      <AdBanner />
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => {
            setResults([]);
            setNearbyResults([]);
            setError("");
            setWarning("");
            setHasSearched(false);
            setPostcode("");
          }}
          style={styles.homeButton}
        >
          <Text style={styles.homeButtonText}>← Home</Text>
        </TouchableOpacity>

        <Image
          source={require("./assets/logo.png")}
          style={styles.logo}
        />
      </View>

      <Text style={styles.subheader}>
        Find a licensed snake catcher near you
      </Text>

      <TextInput
        placeholder="Enter postcode"
        value={postcode}
        onChangeText={handlePostcodeChange}
        style={styles.input}
        keyboardType="numeric"
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {warning ? <Text style={styles.warningText}>{warning}</Text> : null}

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.searchButton, { flex: 1 }]}
          onPress={() => withLoading(search)}
        >
          <Text style={styles.searchText}>
            {loading ? "Searching..." : "Find Catcher"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.gpsButton}
          onPress={() => withLoading(useMyLocation)}
        >
          <Text style={styles.gpsText}>📍</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
  onPress={() => setShowAll(!showAll)}
  style={{
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  }}
>
  <Text>
    {showAll ? "Hide All Catchers" : "View All Catchers"}
  </Text>
</TouchableOpacity>

      <FlatList
        data={(displayData || []).sort((a, b) => {
          const aPriority = priorityIds.includes(String(a.id)) ? 1 : 0;
          const bPriority = priorityIds.includes(String(b.id)) ? 1 : 0;

          if (aPriority !== bPriority) return bPriority - aPriority;

          const aPinned = pinned.includes(String(a.id)) ? 1 : 0;
          const bPinned = pinned.includes(String(b.id)) ? 1 : 0;

          return bPinned - aPinned;
        })}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.name}>{item.name}</Text>

              <TouchableOpacity onPress={() => togglePin(item.id)}>
                <Text style={{ fontSize: 32 }}>
                  {pinned.includes(String(item.id)) ? "⭐" : "☆"}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={{ color: "#666", marginBottom: 10 }}>
              {item.status}
            </Text>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.callButton}
                onPress={() => Linking.openURL(`tel:${item.phone}`)}
              >
                <Text style={styles.callText}>Call</Text>
              </TouchableOpacity>

              {item.website && (
                <TouchableOpacity
                  style={styles.webButton}
                  onPress={() => Linking.openURL(item.website)}
                >
                  <Text style={styles.webText}>Website</Text>
                </TouchableOpacity>
              )}

              {item.facebook && (
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => Linking.openURL(item.facebook)}
                >
                  <Text style={styles.socialText}>Social</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      />

      <View style={[styles.bottomSection, { marginTop: 10 }]}>
        <TouchableOpacity
          style={styles.emergencyButton}
          onPress={() => Linking.openURL("tel:000")}
        >
          <Text style={styles.emergencyText}>
            🚨 Bitten by a snake? Tap to Call 000
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
  style={styles.firstAidButton}
  onPress={() => setShowFirstAid(true)}
>
  <Text style={styles.signupText}>Snake Bite First Aid</Text>
</TouchableOpacity>

        <TouchableOpacity
          style={styles.signupButton}
          onPress={() => setScreen("signup")}
        >
          <Text style={styles.signupText}>Catcher Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.updateButton}
          onPress={() => {
            const url =
              Platform.OS === "ios"
                ? APP_STORE_LINK
                : PLAY_STORE_LINK;

            if (!url) {
              alert("Updates will be available when the app is published");
              return;
            }

            Linking.openURL(url);
          }}
        >
          <Text style={styles.updateText}>
            Update App (Update Listings)
          </Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={{ color: "#fff", marginTop: 10 }}>
              Loading...
            </Text>
          </View>
        </View>
      )}

      <StatusBar style="dark" />
     
     <AppFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#fff",
  },

step: {
  fontSize: 18,
  marginBottom: 15,
  fontWeight: "600",
},
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  homeButton: {
    position: "absolute",
    left: 0,
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
  subheader: {
    textAlign: "center",
    marginBottom: 20,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 5,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  searchButton: {
    backgroundColor: "#1b5e20",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  searchText: {
    color: "#fff",
    fontWeight: "bold",
  },
  gpsButton: {
    backgroundColor: "#1565c0",
    width: 55,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  gpsText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    color: "#c62828",
    textAlign: "center",
  },
  warningText: {
    color: "#b26a00",
    textAlign: "center",
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
  },
  callButton: {
    backgroundColor: "#c62828",
    flex: 5,
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  callText: {
    color: "#fff",
    fontWeight: "bold",
  },
  webButton: {
    backgroundColor: "#1565c0",
    padding: 8,
    borderRadius: 6,
  },
  socialButton: {
    backgroundColor: "#6a1b9a",
    padding: 8,
    borderRadius: 6,
  },
  webText: { color: "#fff" },
  socialText: { color: "#fff" },
  bottomSection: {
    paddingTop: 10,
    paddingBottom: 0,
    gap: 5,
  },
  emergencyButton: {
    backgroundColor: "#d32f2f",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  emergencyText: {
    color: "#fff",
    fontWeight: "bold",
  },
  signupButton: {
    backgroundColor: "#111",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  signupText: {
    color: "#fff",
    fontWeight: "bold",
  },
  updateButton: {
    backgroundColor: "#1565c0",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  firstAidButton: {
  backgroundColor: "#ff9800",
  padding: 16,
  borderRadius: 8,
  alignItems: "center",
},
  updateText: {
    color: "#fff",
    fontWeight: "bold",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  noticeText: {
    textAlign: "center",
    marginVertical: 20,
  },
  noticeButton: {
    backgroundColor: "#1b5e20",
    padding: 14,
    borderRadius: 8,
  },
  noticeButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  loadingBox: {
    backgroundColor: "#000",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  footer: {
  marginTop: 20,
  paddingVertical: 12,
  borderTopWidth: 1,
  borderTopColor: "#ddd",
  alignItems: "center",
  backgroundColor: "#fff",
},

footerText: {
  fontSize: 12,
  color: "#777",
  fontWeight: "500",
},
footerLogo: {
  width: 20,
  height: 20,
},
stepTitle: {
  fontSize: 16,
  fontWeight: "bold",
  marginTop: 22,
  color: "#d32f2f",
},

stepText: {
  fontSize: 14,
  marginTop: 6,
  marginBottom: 18,
  lineHeight: 20,
  color: "#333",
},

extraGap: {
  marginTop: 35,
},
bullets: {
  marginTop: 6,
},

bullet: {
  fontSize: 14,
  lineHeight: 20,
  marginBottom: 6,
  color: "#333",
},
});
