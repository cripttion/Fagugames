import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "./../assets/FUGU Plays/image.png";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import GradientText from "../components/GradientText";
import RecentPlayed from "./components/RecentPlayed";

import Earn from "./components/Earn";
import Stats from "./components/Stats";

const Home = () => {
  const [fontsLoaded, fontError] = useFonts({
    "Jersey15-Regular": require("./../assets/fonts/Jersey_15/Jersey15-Regular.ttf"),
  });
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tophead}>
        <Image source={logo} style={{ width: 100, height: 100 }} />

        <GradientText colors={["#004aad", "#cb6ce6"]} style={styles.text}>
          Fagu Games
        </GradientText>
      </View>
      <View style={styles.heroSection}>
        <RecentPlayed />
        <View style={{flexDirection:"column",gap:20,flex:1}}>
            <Stats />
            <Earn />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  text: {
    fontSize: 60,
    fontFamily:'Jersey15-Regular'
  },
  tophead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
  },
  heroSection:{
    flex:1,
    flexDirection:'row',
    gap:10,
    marginHorizontal:10
  }
});
