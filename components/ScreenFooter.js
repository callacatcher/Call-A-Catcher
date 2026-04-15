import React from "react";
import { View, Platform } from "react-native";
import AppFooter from "./AppFooter";
import WebAdBanner from "./WebAdBanner";

const ScreenFooter = ({ showAd }) => {
  return (
   <View>
  <AppFooter />

  {showAd === "home" && (
    <WebAdBanner type="home" />
  )}
  {showAd === "firstaid" && (
    <WebAdBanner type="firstaid" />
    )}
    {showAd === "signup" && (
    <WebAdBanner type="signup" />
    )}
</View>
  );
};

export default ScreenFooter;