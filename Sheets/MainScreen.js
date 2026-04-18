/* =========================
     MAIN APP SCREEN
  ========================= */

 import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Linking,
  ActivityIndicator,
  Platform
} from "react-native";

import { StatusBar } from "expo-status-bar";
import ScreenFooter from "../components/ScreenFooter";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { stylesheet as styles } from "../styles/stylesheet";


export default function MainScreen({
  postcode,
  setPostcode,
  error,
  warning,
  loading,
  showAll,
  setShowAll,
  search,
  useMyLocation,
  withLoading,
  displayData,
  pinned,
  togglePin,
  priorityIds,
  handlePostcodeChange,
  onSignup,
  onFirstAid,
  APP_STORE_LINK,
  PLAY_STORE_LINK,
  setHasSearched = () => {},
  setResults = () => {},
  setNearbyResults = () => {},
  resetSearch,
}) {



  return (
    <View style={styles.container}>

      {/* ===== TOP BAR (Home reset + Logo) ===== */}
      <View style={styles.topBar}>
        <TouchableOpacity
  onPress={resetSearch}
  style={styles.homeButton}
>
  <Text style={styles.homeButtonText}>← Home</Text>
</TouchableOpacity>

        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
        />
      </View>

      
      
      {/* ===== HEADER / SEARCH INPUT ===== */}
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

    
    
      {/* ===== SEARCH + GPS CONTROLS ===== */}
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
          onPress={useMyLocation}
        >
          <Text style={styles.gpsText}>📍</Text>
        </TouchableOpacity>
      </View>

      
      
      
      {/* ===== TOGGLE: SHOW ALL CATCHERS ===== */}
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

     
     
     
      {/* ===== RESULTS LIST (CATCHER CARDS) ===== */}
      <FlatList
        data={[...displayData].sort((a, b) => {

  // 1️⃣ PINNED FIRST (highest priority)
  const aPinned = pinned.includes(String(a.id)) ? 1 : 0;
  const bPinned = pinned.includes(String(b.id)) ? 1 : 0;

  if (aPinned !== bPinned) {
    return bPinned - aPinned;
  }

  // 2️⃣ SPECIAL ID PRIORITY (id "4")
  const aIsSpecial = a.id === "4" ? 1 : 0;
  const bIsSpecial = b.id === "4" ? 1 : 0;

  if (aIsSpecial !== bIsSpecial) {
    return bIsSpecial - aIsSpecial;
  }

  // 3️⃣ OTHER PRIORITY IDS
  const aPriority = Array.isArray(priorityIds) && priorityIds.includes(String(a.id)) ? 1 : 0;
const bPriority = Array.isArray(priorityIds) && priorityIds.includes(String(b.id)) ? 1 : 0;

  if (aPriority !== bPriority) {
    return bPriority - aPriority;
  }

  // 4️⃣ DEFAULT ORDER (no change)
  return 0;
})}


        keyExtractor={(item) => item.id?.toString()}
        renderItem={({ item }) => (
          
          <View style={styles.card}>

            {/* === CARD HEADER (Name + Pin) === */}
            <View style={styles.cardHeader}>
              <Text style={styles.name}>{item.name}</Text>

              <TouchableOpacity
         onPress={() => togglePin(item.id)}
          style={{
          position: "absolute",
           right: 30,
          }}
>
           <Text style={{ fontSize: 25, transform: [{ scale: 1.4 }] }}>
           {pinned.includes(String(item.id)) ? "⭐" : "☆"}
           </Text>
           </TouchableOpacity>
            </View>

            <Text style={{ color: "#666", marginBottom: 0,marginLeft: 10 }}>
              {item.status}
            </Text>

            {(item.positiveReviews > 0 || item.negativeReviews > 0) && (
              <View style={{ flexDirection: "row", marginBottom: 2, marginLeft: 10, gap: 12 }}>
                
                {item.positiveReviews > 0 && (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    <MaterialCommunityIcons name="thumb-up" size={18} color="#2e7d32" />
                    <Text style={{ color: "#2e7d32", fontWeight: "600" }}>
                      {item.positiveReviews}
                    </Text>
                  </View>
                )}

                {item.negativeReviews > 0 && (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    <MaterialCommunityIcons name="thumb-down" size={18} color="#c62828" />
                    <Text style={{ color: "#c62828", fontWeight: "600" }}>
                      {item.negativeReviews}
                    </Text>
                  </View>
                )}

              </View>
            )}

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


  {/* ===== BOTTOM ACTION SECTION (Emergency + App Actions) ===== */}
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
          onPress={onFirstAid}
        >
          <Text style={styles.signupText}>Snake Bite First Aid</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signupButton}
          onPress={onSignup}
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
              alert("        This button is currently unoperational. \n\n  This is for the future when we move to the app store. for now, the database updates anytime you open, and have internet connection. It works with no internet, Just fine, but the listing may be out of date depending on when you last visited us. :)\n\n  We Plan to be on Android, but to keep the app free for everyone, we cant afford to go on apple.");
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

      {/* ===== LOADING OVERLAY ===== */}
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

      {/* ===== STATUS + FOOTER ===== */}
      <StatusBar style="dark" />
      <ScreenFooter showAd="home" />

    </View>
    );
}