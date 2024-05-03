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
import RmScore from "./components/RmScore";
import { FontAwesome5 } from '@expo/vector-icons';
const RajaMantriGame = ({ route, navigation }) => {
  const { playerData } = route.params;
  const box1 = useSharedValue(0);
  const box2 = useSharedValue(0);
  const box3 = useSharedValue(0);
  const box4 = useSharedValue(0);
  const box4UP = useSharedValue(0);
  const sv = useSharedValue(0);
  const [valueArray, setValueArray] = useState([]);
  const [tempArray, setTempArray] = useState([]);
  const [box2Rotate, setBox2Rotate] = useState("0deg");
  const [box3Rotate, setBox3Rotate] = useState("0deg");
  const [isCorrect,setIscorrect] = useState(false);
  const[choiceSelected,setChoiceSelected] = useState(false);
  const [box4Rotate, setBox4Rotate] = useState("0deg");
  const [sipahiAnswer, setSipahiAnswer] = useState(null);
  const [box1Press, setBox1Press] = useState(false);
  const [box2Press, setBox2Press] = useState(false);

  const [box3Press, setBox3Press] = useState(false);

  const [box4Press, setBox4Press] = useState(false);

  const spinAnimation = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sv.value * 360}deg` }],
  }));
  const box1animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: box1.value }],
  }));
  const box2animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: box2.value }, { rotate: box2Rotate }],
  }));
  const box3animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: box3.value }, { rotate: box3Rotate }],
  }));
  const box4animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: box4.value },
      { rotate: box4Rotate },
      { translateY: box4UP.value },
    ],
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
  let tempArr = [];
  function getIndexOfOther(arr) {
    tempArr = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] == 1 || arr[i] == 2) {
        tempArr.push(i);
      }
    }
    return tempArr;
  }
  const startAnimation = async () => {
    const xx = getRandomArray();
    setValueArray(xx);
    setBox1Press(false);
    setBox2Press(false);
    setBox3Press(false);
    setBox4Press(false);
    setChoiceSelected(false);
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
    setTempArray(getIndexOfOther(xx));
  };

const [gamescore ,setScore] = useState([]);

  const choicePressed = (value)=>{
      setChoiceSelected(true);
      let score;
      if(valueArray[value]===2)
      {
        setIscorrect(true);
        score = {
            [playerData.firstPlayer]:data[valueArray[0]].value,
            [playerData.secondPlayer]:data[valueArray[1]].value,
            [playerData.thirdPlayer]:data[valueArray[2]].value,
            [playerData.fourthPlayer]:data[valueArray[3]].value
        }
      }else{
          
         score = {
          [playerData.firstPlayer]: (() => {
            if (valueArray[0] === 2) {
              return data[3].value;
            } else if (valueArray[0] === 3) {
              return data[2].value;
            } else {
              return data[valueArray[0]].value;
            }
          })(),
          [playerData.secondPlayer]: (() => {
            if (valueArray[1] === 2) {
              return data[3].value;
            } else if (valueArray[1] === 3) {
              return data[2].value;
            } else {
              return data[valueArray[1]].value;
            }
          })(),
          [playerData.thirdPlayer]: (() => {
            if (valueArray[2] === 2) {
              return data[3].value;
            } else if (valueArray[2] === 3) {
              return data[2].value;
            } else {
              return data[valueArray[2]].value;
            }
          })(),
          [playerData.fourthPlayer]: (() => {
            if (valueArray[3] === 2) {
              return data[3].value;
            } else if (valueArray[3] === 3) {
              return data[2].value;
            } else {
              return data[valueArray[3]].value;
            }
          })()
        }
      }
      setScore([...gamescore,score])
  }
 
const [showScore,setShowScore] = useState(false);
  // console.log(valueArray);
  // console.log(tempArray);
  console.log(gamescore);
  return (
    <>
      <View style={styles.container}>
        <Animated.View style={[spinAnimation]}>
          <Animated.View style={[styles.box, box1animatedStyle]}>
            <TouchableOpacity
              style={{ height: 100 }}
              onPress={() => {
                setBox1Press(true);
              }}
            >
              {box1Press && valueArray[0] === 0 && (
                <>
                  <View
                    style={{
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 20,
                      marginVertical: 20,
                    }}
                  >
                    <Text
                      style={[
                        styles.texts,
                        { transform: [{ rotate: "180deg" }] },
                      ]}
                    >
                      {data[0].value}
                    </Text>
                    <Text
                      style={[
                        styles.texts,
                        { transform: [{ rotate: "180deg" }] },
                      ]}
                    >
                      {data[0].name}
                    </Text>
                  </View>
                </>
              )}
              {box1Press && valueArray[0] === 3 && (
                <>
                  <View
                    style={{
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 20,
                      marginVertical: 20,
                    }}
                  >
                    <Text
                      style={[
                        styles.texts,
                        { transform: [{ rotate: "180deg" }] },
                      ]}
                    >
                      {data[3].value}
                    </Text>
                    <Text
                      style={[
                        styles.texts,
                        { transform: [{ rotate: "180deg" }] },
                      ]}
                    >
                      {data[3].name}
                    </Text>
                  </View>
                </>
              )}
              {!box1Press && tempArray.includes(0)&& !choiceSelected && (
                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 20,
                  }}

                
                >
                  <Text
                    style={{ color: "white", fontSize: 22, fontWeight: "bold" }}
                  >
                    0
                  </Text>
                </View>
              )}
              {choiceSelected&&!box1Press&&<>
                <>
                  <View
                    style={{
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 20,
                      marginVertical: 20,
                    }}
                  >
                    <Text
                      style={[
                        styles.texts,
                        { transform: [{ rotate: "180deg" }] },
                      ]}
                    >
                      {data[valueArray[0]].value}
                    </Text>
                    <Text
                      style={[
                        styles.texts,
                        { transform: [{ rotate: "180deg" }] },
                      ]}
                    >
                      {data[valueArray[0]].name}
                    </Text>
                  </View>
                </>
                </>}
            </TouchableOpacity>
            {box1Press && valueArray[0] === 3 && (
              <View style={styles.twoButton}>
                <TouchableOpacity
                  style={{
                    backgroundColor: "white",
                    padding: 10,
                    borderRadius: 50,
                  }}
                  onPress={()=>choicePressed(tempArray[0])}
                >
                  <Text>{tempArray[0]}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: "white",
                    padding: 10,
                    borderRadius: 50,
                  }}
                  onPress={()=>choicePressed(tempArray[1])}
                >
                  <Text>{tempArray[1]}</Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>

          <Animated.View style={[styles.box, box2animatedStyle]}>
            <TouchableOpacity
              style={{ height: 100 }}
              onPress={() => {
                setBox2Press(true);
              }}
            >
              {box2Press && valueArray[1] === 0 && (
                <>
                  <View
                    style={{
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 20,
                      marginVertical: 20,
                    }}
                  >
                    <Text style={styles.texts}>{data[0].name}</Text>
                    <Text style={styles.texts}>{data[0].value}</Text>
                  </View>
                </>
              )}
              {box2Press && valueArray[1] === 3 && (
                <>
                  <View
                    style={{
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 20,
                      marginVertical: 20,
                    }}
                  >
                    <Text style={styles.texts}>{data[3].name}</Text>
                    <Text style={styles.texts}>{data[3].value}</Text>
                  </View>
                </>
              )}
              {!box2Press && tempArray.includes(1)&&!choiceSelected && (
                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 20,
                  }}
                >
                  <Text
                    style={{ color: "white", fontSize: 22, fontWeight: "bold" }}
                  >
                    1
                  </Text>
                </View>
              )}
               {choiceSelected&&!box2Press&&<>
                <>
                  <View
                    style={{
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 20,
                      marginVertical: 20,
                    }}
                  >
                    <Text
                      style={[
                        styles.texts,
                        { transform: [{ rotate: "180deg" }] },
                      ]}
                    >
                      {data[valueArray[1]].value}
                    </Text>
                    <Text
                      style={[
                        styles.texts,
                        { transform: [{ rotate: "180deg" }] },
                      ]}
                    >
                      {data[valueArray[1]].name}
                    </Text>
                  </View>
                </>
                </>}
            </TouchableOpacity>
            {box2Press && valueArray[1] === 3 && (
              <View style={styles.twoButton}>
                <TouchableOpacity
                  style={{
                    backgroundColor: "white",
                    padding: 10,
                    borderRadius: 50,
                  }}
                  onPress={()=>choicePressed(tempArray[0])}
                >
                  <Text>{tempArray[0]}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: "white",
                    padding: 10,
                    borderRadius: 50,
                  }}
                  onPress={()=>choicePressed(tempArray[1])}
                >
                  <Text>{tempArray[1]}</Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
          <Animated.View style={[styles.box, box3animatedStyle]}>
            <TouchableOpacity
              style={{ height: 100 }}
              onPress={() => {
                setBox3Press(true);
              }}
            >
              {box3Press && valueArray[2] === 0 && (
                <>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      marginVertical: 20,
                      marginTop: 40,
                    }}
                  >
                    <Text
                      style={[
                        styles.texts,
                        { transform: [{ rotate: "90deg" }] },
                      ]}
                    >
                      {data[0].value}
                    </Text>
                    <Text
                      style={[
                        styles.texts,
                        { transform: [{ rotate: "90deg" }] },
                      ]}
                    >
                      {data[0].name}
                    </Text>
                  </View>
                </>
              )}
              {box3Press && valueArray[2] === 3 && (
                <>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      marginVertical: 20,
                      marginTop: 40,
                    }}
                  >
                    <Text
                      style={[
                        styles.texts,
                        { transform: [{ rotate: "90deg" }] },
                      ]}
                    >
                      {data[3].value}
                    </Text>
                    <Text
                      style={[
                        styles.texts,
                        { transform: [{ rotate: "90deg" }] },
                      ]}
                    >
                      {data[3].name}
                    </Text>
                  </View>
                </>
              )}
              {!box3Press && tempArray.includes(2)&&!choiceSelected && (
                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 20,
                  }}
                >
                  <Text
                    style={{ color: "white", fontSize: 22, fontWeight: "bold" }}
                  >
                    2
                  </Text>
                </View>
              )}
               {choiceSelected&&!box3Press&&<>
                <>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                     
                      marginVertical: 40,
                    }}
                  >
                    <Text
                      style={[
                        styles.texts,
                        { transform: [{ rotate: "90deg"  }] },
                      ]}
                    >
                      {data[valueArray[2]].value}
                    </Text>
                    <Text
                      style={[
                        styles.texts,
                        { transform: [{ rotate: "90deg"  }] },
                      ]}
                    >
                      {data[valueArray[2]].name}
                    </Text>
                  </View>
                </>
                </>}
            </TouchableOpacity>
            {box3Press && valueArray[2] === 3 && (
              <View style={styles.twoButton}>
                <TouchableOpacity
                  style={{
                    backgroundColor: "white",
                    padding: 10,
                    borderRadius: 50,
                  }}
                  onPress={()=>choicePressed(tempArray[0])}
                >
                  <Text>{tempArray[0]}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: "white",
                    padding: 10,
                    borderRadius: 50,
                  }}
                  onPress={()=>choicePressed(tempArray[1])}
                >
                  <Text>{tempArray[1]}</Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
          <Animated.View style={[styles.box, box4animatedStyle]}>
            <TouchableOpacity
              style={{ height: 100 }}
              onPress={() => {
                setBox4Press(true);
              }}
            >
              {box4Press && valueArray[3] === 0 && (
                <>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      marginVertical: 20,
                      marginTop: 40,
                    }}
                  >
                    <Text
                      style={[
                        styles.texts,
                        { transform: [{ rotate: "-90deg" }] },
                      ]}
                    >
                      {data[0].name}
                    </Text>
                    <Text
                      style={[
                        styles.texts,
                        { transform: [{ rotate: "-90deg" }] },
                      ]}
                    >
                      {data[0].value}
                    </Text>
                  </View>
                </>
              )}
              {box4Press && valueArray[3] === 3 && (
                <>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 40,
                    }}
                  >
                    <Text
                      style={[
                        styles.texts,
                        { transform: [{ rotate: "-90deg" }] },
                      ]}
                    >
                      {data[3].name}
                    </Text>
                    <Text
                      style={[
                        styles.texts,
                        { transform: [{ rotate: "-90deg" }] },
                      ]}
                    >
                      {data[3].value}
                    </Text>
                  </View>
                </>
              )}
              {!box4Press && tempArray.includes(3)&&!choiceSelected && (
                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 20,
                  }}
                >
                  <Text
                    style={{ color: "white", fontSize: 22, fontWeight: "bold" }}
                  >
                    3
                  </Text>
                </View>
              )}
               {choiceSelected&&!box4Press&&<>
                <>
                  <View
                    style={{
                      flexDirection: "row-reverse",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 20,
                      marginVertical: 40,
                    }}
                  >
                    <Text
                      style={[
                        styles.texts,
                        { transform: [{  rotate: "-90deg"  }] },
                      ]}
                    >
                      {data[valueArray[3]].value}
                    </Text>
                    <Text
                      style={[
                        styles.texts,
                        { transform: [{ rotate: "-90deg"  }] },
                      ]}
                    >
                      {data[valueArray[3]].name}
                    </Text>
                  </View>
                </>
                </>}
            </TouchableOpacity>
            {box4Press && valueArray[3] === 3 && (
              <View style={styles.twoButton}>
                <TouchableOpacity
                  style={{
                    backgroundColor: "white",
                    padding: 10,
                    borderRadius: 50,
                  }}
                  onPress={()=>choicePressed(tempArray[0])}
                >
                  <Text>{tempArray[0]}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: "white",
                    padding: 10,
                    borderRadius: 50,
                  }}
                  onPress={()=>choicePressed(tempArray[1])}
                >
                  <Text>{tempArray[1]}</Text>
                </TouchableOpacity>
              </View>
            )}
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
      <TouchableOpacity onPress={()=>setShowScore(true)} style={styles.button2}>
      <FontAwesome5 name="trophy" size={40} color="white" />
      </TouchableOpacity>

      {showScore&&
      <View style={styles.scoreBox}>
        <RmScore data={gamescore} closeScore={setShowScore}/>
      </View>
      }
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
    backgroundColor: "#004aad",
    height: 100,
    borderRadius: 20,
  },
  button: {
    position: "absolute",
    bottom: 20,
    marginHorizontal: 20,
    // alignSelf:'center'
  },
  texts: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  twoButton: {
    position: "absolute",
    top: 10,
    left: -40,
    flexDirection: "column",
    gap: 10,
  },
  button2: {
    position: "absolute",
    bottom: 20,
    right:10,
    marginHorizontal: 20,
    // alignSelf:'center'
  },
  scoreBox:{
    position:'absolute',
    bottom:0,
    left:0,
    right:0
  }
});
