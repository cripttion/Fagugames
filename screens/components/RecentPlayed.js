import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";
import redblue from '../../assets/banners/4.png'
const RecentPlayed = ({navigation}) => {
  const [fontsLoaded, fontError] = useFonts({
    "Jersey15-Regular": require("../../assets/fonts/Jersey_15/Jersey15-Regular.ttf"),
  });
  return (
    <>
      <View style={styles.container}>
        <Image source={redblue} style={{width:'100%',height:'100%',borderRadius:20}} />
        <TouchableOpacity
          style={{
            position: "absolute",
            flex: 1,
            bottom: 5,
            left: 0,
            right: 0,
            marginHorizontal: 20,
          }}
          onPress={()=>navigation.navigate('RedBlue')}
        >
          <LinearGradient
            // Button Linear Gradient
            colors={["#004aad", "#cb6ce6"]}
            start={{ x: 0.8, y: 0.6 }}
            end={{ x: 0, y: 0.6 }}
            style={styles.button}
          >
            <Text style={styles.text}>Play Again</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default RecentPlayed;

const styles = StyleSheet.create({
  container: {
    width: 240,
    height: 300,

    borderRadius: 20,
    // padding: 10,
    // borderWidth: 1,
    // borderColor: "#fff",
  },
  text: {
    color: "white",
    fontFamily: "Jersey15-Regular",
    fontSize: 30,
    textAlign: "center",
  },
  button: {
    // padding:1,
    borderRadius: 20,
  },
});
