import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "./../assets/FUGU Plays/image.png";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import GradientText from "../components/GradientText";
import RecentPlayed from "./components/RecentPlayed";
import td from './../assets/banners/1.png'
import rm from './../assets/banners/2.png'
import rb from './../assets/banners/3.png'
import tic from './../assets/banners/4.png'
import Earn from "./components/Earn";
import Stats from "./components/Stats";

const Home = ({navigation}) => {
  const [fontsLoaded, fontError] = useFonts({
    "Jersey15-Regular": require("./../assets/fonts/Jersey_15/Jersey15-Regular.ttf"),
  });
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
        <RecentPlayed navigation={navigation} />
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
            <TouchableOpacity style={styles.diffGames} onPress={()=>navigation.navigate('TruthDare')}>
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
 
    flexDirection:'row',
    gap:10,
    marginHorizontal:10,

  },
  text1:{
    fontFamily:'Jersey15-Regular',
    fontSize:40,
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
