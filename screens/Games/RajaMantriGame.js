import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { FontAwesome } from "@expo/vector-icons";

const RajaMantriGame = ({ route, navigation }) => {
  const { playerData } = route.params;
  const box1 = useSharedValue(0);
  const box2 = useSharedValue(0);
  const box3 = useSharedValue(0);
  const box4 = useSharedValue(0);
 const  box4UP = useSharedValue(0);
  const sv = useSharedValue(0);
  const [valueArray, setValueArray] = useState();
  const [box2Rotate, setBox2Rotate] = useState("0deg");
  const [box3Rotate, setBox3Rotate] = useState("0deg");

  const [box4Rotate, setBox4Rotate] = useState("0deg");
  const [rajaAllow, setRajaAllow] = useState(false);
  const [box1Press, setBox1Press] = useState(false);
  const spinAnimation = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sv.value * 360}deg` }],
  }));
  const box1animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: box1.value }],
  }));
  const box2animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: box2.value }, { rotate: box2Rotate },],
  }));
  const box3animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: box3.value }, { rotate: box3Rotate }],
  }));
  const box4animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: box4.value }, { rotate: box4Rotate },{translateY:box4UP.value}],
  }));

  const data = [
    {
      name: "Raja",
      value: 1000,
    },
    {
      name: "Mantri",
      value: 800,
    },
    {
      name: "Chor",
      value: 0,
    },
    {
      name: "Sipahi",
      value: 500,
    },
  ];
  let selectedIndices = [];

  function getRandomIndex() {
    return Math.floor(Math.random() * 4);
  }

  function getRandomArray() {
    selectedIndices = [];
    while (selectedIndices.length < 4) {
      let index = getRandomIndex();
      if (!selectedIndices.includes(index)) {
        selectedIndices.push(index);
      }
    }
    return selectedIndices;
  }
  const startAnimation = async () => {
    sv.value = 0;
    box1.value = 0;
    box2.value = 0;
    box3.value = 0;
    box4.value = 0;
    sv.value = withTiming(20, { duration: 5000 });
    box1.value = withTiming(-100, { duration: 5000 });
    box2.value = withTiming(380, { duration: 5000 });
    box3.value = withTiming(-100, { duration: 5000 });
    box4.value = withTiming(100, { duration: 5000 });
    box4UP.value = withTiming(-100, { duration: 5000 });

    setBox2Rotate("0deg");
    setBox3Rotate("0deg");
    setBox4Rotate("0deg");
    setBox1Press(false);
    setValueArray([0,0,0,0]);
  };
  console.log(valueArray);
  // Get a new random array
  return (
    <>
      <View style={styles.container}>
        <Animated.View style={[spinAnimation]}>
        
          <Animated.View style={[styles.box, box1animatedStyle]}>
            <TouchableOpacity style={{height:100}} onPress={()=>{
              console.log("Pressed");
            }}>
              
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[styles.box, box2animatedStyle]}>
          <Text>Box2</Text>

          </Animated.View>
          <Animated.View style={[styles.box, box3animatedStyle]}>
          <Text>Box3</Text>

          </Animated.View>
          <Animated.View style={[styles.box, box4animatedStyle,]}>
          <Text>Box4</Text>

          </Animated.View>
        </Animated.View>
      </View>
      <View style={styles.player1Name}>
        <Text style={styles.text}>{playerData.firstPlayer}</Text>
      </View>
      <View style={styles.player2Name}>
        <Text style={styles.text}>{playerData.secondPlayer}</Text>
      </View>
      <View style={styles.player3Name}>
        <Text style={styles.text}>{playerData.thirdPlayer}</Text>
      </View>
      <View style={styles.player4Name}>
        <Text style={styles.text}>{playerData.fourthPlayer}</Text>
      </View>
      <TouchableOpacity onPress={startAnimation} style={styles.button}>
        <FontAwesome name="rotate-right" size={40} color="white" />
      </TouchableOpacity>
    </>
  );
};

export default RajaMantriGame;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#000",
    marginTop: -100,
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontSize: 40,
    fontFamily: "Jersey15-Regular",
  },
  player1Name: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    transform: [{ rotate: "180deg" }],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  player2Name: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  player3Name: {
    transform: [{ rotate: "90deg" }],
    position: "absolute",
    top: 400,
    maxWidth: 150,
    maxHeight: 100,
  },
  player4Name: {
    transform: [{ rotate: "-90deg" }],
    position: "absolute",
    top: 400,
    right: 0,
    maxWidth: 150,
    maxHeight: 100,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 140,
    borderRadius: 20,
  },
  box: {
    width: 100,
    alignSelf: "center",
    backgroundColor:'#A9A9A9',
    height:100,
    borderRadius:20,
  },
  button: {
    position: "absolute",
    bottom: 20,
    marginHorizontal: 20,
    // alignSelf:'center'
  },
});
