import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import bottle from "./../../assets/banners/image.png";
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { FontAwesome } from "@expo/vector-icons";

const TruthDare = () => {
  let angle = useSharedValue(0);
  const [temp, setTemp] = useState(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${angle.value * 360}deg` }],
  }));

  const startAnimation = () => {
    angle.value=0;
    angle.value = withRepeat(
      withTiming(10+temp, { duration: 10000, easing: Easing.linear }),
      5,
      true
    );
    setTemp(temp>12?2:temp+1);

    
  };

  useEffect(() => {
    let timer1 = setTimeout(() => {
      cancelAnimation(angle);
    }, 3 * 1000);

    return () => {
      clearTimeout(timer1);
    };
  }, [temp]);

  return (
    <>
      <View style={styles.container}>
        <Animated.Image
          source={bottle}
          style={[
            animatedStyle,
            {
              width: 300,
              height: 300,
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        />
      </View>
      <TouchableOpacity onPress={startAnimation} style={styles.button}>
        <FontAwesome name="rotate-right" size={40} color="white" />
      </TouchableOpacity>
    </>
  );
};

export default TruthDare;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100vh",
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    position: "absolute",
    bottom: 20,
    alignSelf:'center'
  },
});
