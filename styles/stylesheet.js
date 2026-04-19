/* =========================
     STYLES SHEET
========================= */

import { StyleSheet } from "react-native";

export const stylesheet = StyleSheet.create({

  /* =========================
     LAYOUT / CONTAINERS
  ========================= */
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
    backgroundColor: "#fff",
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 0,
  },

 bottomSection: {
  width: "100%",
  padding: 10,
  backgroundColor: "#fff",
  borderTopWidth: 1,
  borderColor: "#ddd",

  },

  /* =========================
     TEXT / TYPOGRAPHY
  ========================= */
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },

  subheader: {
    textAlign: "center",
    marginBottom: 5,
    color: "#555",
  },

  step: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: "600",
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

  errorText: {
    color: "#c62828",
    textAlign: "center",
  },

  warningText: {
    color: "#b26a00",
    textAlign: "center",
    fontWeight: "600",
  },

  noticeText: {
    textAlign: "center",
    marginVertical: 20,
  },

  /* =========================
     INPUTS
  ========================= */
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

  /* =========================
     BUTTONS
  ========================= */
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

  updateText: {
    color: "#fff",
    fontWeight: "bold",
  },

  firstAidButton: {
    backgroundColor: "#ff9800",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
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

  /* =========================
     CARDS / LIST ITEMS
  ========================= */
resultsWrapper: {
  flex: 1,
},
  
  resultsContainer: {
  position: "absolute",
  top: 220, // 👈 adjust to match your current list start
  left: 10,
  right: 10,
  backgroundColor: "#fff",
  borderRadius: 12,
  overflow: "hidden",
  elevation: 6,
  zIndex: 999,
},

minimizeBar: {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  height: 50,
  backgroundColor: "#eee",
  justifyContent: "center",
  borderTopWidth: 1,
  borderColor: "#ccc",
},
  
  card: {
    backgroundColor: "#f9f9f9",
    padding: 0,
    borderRadius: 5,
    marginBottom: 5,
    marginTop: 5,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },

  actionRow: {
    flexDirection: "row",
    gap: 8,
  },

  callButton: {
    backgroundColor: "#c62828",
    flex: 5,
    padding: 8,
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

  /* =========================
     IMAGES
  ========================= */
  logo: {
    width: "100%",
    height: 120,
    resizeMode: "contain",
    marginBottom: 0,
  },

  /* =========================
     FOOTER
  ========================= */
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

  /* =========================
     LOADING / OVERLAYS
  ========================= */
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

  /* =========================
     BULLETS / FIRST AID
  ========================= */
  bullets: {
    marginTop: 6,
  },

  bullet: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
    color: "#333",
  },

  /* =========================
     SPACING HELPERS
  ========================= */
  extraGap: {
    marginTop: 35,
  },

  /* =========================
     SPLASH
  ========================= */
  splash: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },

  splashImage: {
    width: "80%",
    aspectRatio: 1,
  },
});