import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "./../assets/image.png";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import GradientText from "../components/GradientText";
import RecentPlayed from "./components/RecentPlayed";
import td from './../assets/1.png'
import rm from './../assets/2.png'
import rb from './../assets/3.png'
import tic from './../assets/4.png'
import Earn from "./components/Earn";
import Stats from "./components/Stats";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';

const Home = ({navigation}) => {
  
const [recentGame,setRecentGame] = useState("RedBlue");

useFocusEffect(
  useCallback(()=>{
    const updateRecentGame = async () => {
      const data = await AsyncStorage.getItem("RecentGame");
      setRecentGame(data);
    };

    updateRecentGame();
    return () => {
     
    };
  },[])
)
  return (
    <SafeAreaView style={styles.container}>
       <ScrollView vertical showsVerticalScrollIndicator={false}>    
      <View style={styles.tophead}>
        <Image source={logo} style={{ width: 100, height: 100 }} />

        <GradientText colors={["#004aad", "#cb6ce6"]} style={styles.text}>
          Fagu Games
        </GradientText>
      </View>
      <View style={styles.heroSection}>
        <RecentPlayed navigation={navigation} game={recentGame} />
        <View style={{flexDirection:"column",gap:20,flex:1}}>
            <Stats navigation={navigation}/>
            <Earn navigation={navigation}/>
        </View>
      </View>
      <View style={{marginTop:20,marginHorizontal:10,}}>
      <GradientText colors={["#004aad", "#cb6ce6"]} style={styles.text1}>
        Explore Games
        </GradientText>
        <View  style={styles.gameSection}>
            <TouchableOpacity style={styles.diffGames} onPress={async()=>{
              await AsyncStorage.setItem("RecentGame","TruthDare");
              navigation.navigate('TruthDare')}}>
              <Image source={td} style={{width:'100%',height:'100%',borderRadius:20}} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.diffGames} onPress={()=>navigation.navigate('RajaMantri')}>
            <Image source={rm} style={{width:'100%',height:'100%',borderRadius:20}} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.diffGames} onPress={()=>navigation.navigate('ZeroKatis')}>
            <Image source={rb} style={{width:'100%',height:'100%',borderRadius:20}} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.diffGames} onPress={()=>navigation.navigate('RedBlue')}>
            <Image source={tic} style={{width:'100%',height:'100%',borderRadius:20}} />
            </TouchableOpacity>

        </View>
      </View>
      </ScrollView>
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
    fontSize: 40,
    marginRight:20,
    fontWeight:'bold',
  },
  tophead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
  },
  heroSection:{
 
    flexDirection:'row',
    gap:10,
    marginHorizontal:10,

  },
  text1:{
    fontSize:30,
    fontWeight:'bold'
  },
  diffGames:{
    marginVertical:5,
    height:200,
    width:'48%',
    borderWidth:6,
    borderColor:'#004aad',
    // marginRight:10,
    borderRadius:20,
  },
  gameSection:{
   marginTop:10,
   marginHorizontal:10,
   flexWrap:'wrap',
   flexDirection:'row',
  //  backgroundColor:'red',
   gap:10,
  }
});
