import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState,useCallback } from 'react'
import GradientText from '../components/GradientText'
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RecentPlayed from './components/RecentPlayed';

const GameData = ({navigation}) => {
  const [recentGame,setRecentGame] = useState();
  
  useFocusEffect(
    useCallback(()=>{
      const updateRecentGame = async () => {
        const data = await AsyncStorage.getItem("RecentGame");
        setRecentGame(data);
      };
  
      updateRecentGame();
      return () => {
       
      };
    },[]))

  return (
    <View style={styles.container}>
       <GradientText colors={["#004aad", "#cb6ce6"]} style={styles.text}>
          Your Journey with Fagu Games
        </GradientText>
        <GradientText colors={["#004aad", "#cb6ce6"]} style={styles.text}>
          Recently played Game
        </GradientText>
        <RecentPlayed navigation={navigation} game={recentGame} />

    </View>
  )
}

export default GameData

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#000',
    justifyContent:'center',
    alignItems:'center'
  },
  text:{
    fontSize:30,
    textAlign:'center',
    marginTop:20,
    fontWeight:"bold",
  }
})