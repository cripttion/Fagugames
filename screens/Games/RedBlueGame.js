import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Audio } from 'expo-av';

const RedBlueGame = ({ navigation, route }) => {
  const { playerData } = route.params;
  const [box1Height, setBox1Height] = useState(400);
  const [box2Height, setBox2Height] = useState(400);
  const [player1Point, setPlayer1Point] = useState(0);
  const [player2Point, setPlayer2Point] = useState(0);
  const [sound, setSound] = useState();
  const box1Press = () => {
    setBox1Height(box1Height + 15);
    setPlayer1Point(player1Point + 10);
  };
  const box2Press = () => {
    setBox1Height(box1Height - 15);
    setBox2Height(box2Height + 15);
    setPlayer2Point(player2Point + 10);
  };
  async function playSound() {
    const { sound } = await Audio.Sound.createAsync( require('./../../assets/audio/gameover.mp3')
    );
    setSound(sound);

    await sound.playAsync();
  }
  useEffect(() => {
    if (box1Height >= 820 || box1Height <= 0) {
  
      playSound();
      navigation.navigate("Winner", {
        data: {
          game: "RedBlue",
          WinnerName:  box1Height >= 820 ? playerData.firstPlayer :playerData.secondPlayer,
          winningPoints: box1Height >= 820 ? player1Point : player2Point,
        },
        
      });
    }
  }, [box1Height, box2Height]);

  return (
    <>
      <View style={styles.container}>
        <Pressable
          style={[styles.box1press, { height: box1Height }]}
          onPress={box1Press}
        ></Pressable>
        <Pressable
          style={[styles.box2press, { height: box2Height }]}
          onPress={box2Press}
        ></Pressable>
      </View>
      <View style={styles.player1}>
        <Text
          style={{
            color: "white",
            fontSize: 30,
            fontFamily: "Jersey15-Regular",
          }}
        >
          {playerData.firstPlayer}
        </Text>

        <Text
          style={{
            color: "white",
            fontSize: 30,
            fontFamily: "Jersey15-Regular",
          }}
        >
          {player1Point}
        </Text>
      </View>
      <View style={styles.palyer2}>
        <Text
          style={{
            color: "white",
            fontSize: 30,
            fontFamily: "Jersey15-Regular",
          }}
        >
          {playerData.secondPlayer}
        </Text>

        <Text
          style={{
            color: "white",
            fontSize: 30,
            fontFamily: "Jersey15-Regular",
          }}
        >
          {player2Point}
        </Text>
      </View>
    </>
  );
};

export default RedBlueGame;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  box1press: {
    backgroundColor: "#ff5757",
  },
  box2press: {
    backgroundColor: "#004aad",
  },
  player1: {
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  palyer2: {
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "flex-end",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
