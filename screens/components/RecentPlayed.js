import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";
import RedBlue from '../../assets/4.png'
import TruthDare from '../../assets/1.png';
import TicTac from '../../assets/3.png';
import Rajamtri from '../../assets/2.png';
const RecentPlayed = ({navigation,game}) => {

 
  return (
    <>
      <View style={styles.container}>
        <Image source={game==='TruthDare'?TruthDare:(game==='RedBlue'?RedBlue:(game==='RajaMantri'?Rajamtri:TicTac))} style={{width:'100%',height:'100%',borderRadius:20}} />
        <TouchableOpacity
          style={{
            position: "absolute",
            flex: 1,
            bottom: 5,
            left: 0,
            right: 0,
            marginHorizontal: 20,
          }}
          onPress={()=>navigation.navigate(game)}
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
    borderWidth: 6,
    borderColor: "#004aad",
  },
  text: {
    color: "white",
    fontSize: 20,
    fontWeight:'bold',
    textAlign: "center",
  },
  button: {
    padding:4,
    borderRadius: 20,
  },
});
