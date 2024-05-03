import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from "expo-font";
const Stats = ({navigation}) => {
 
  return (
    <TouchableOpacity style={styles.container} onPress={()=>navigation.navigate('GameData')}>
     <LinearGradient
        // Background Linear Gradient
        colors={["#004aad", "#cb6ce6"]}
        style={styles.background}
      />
         <Text  style={{color:'white',fontSize:20,textAlign:'center',fontWeight:'bold'}}>Stats</Text>
        <Ionicons name="stats-chart" size={30} color="white" />
    </TouchableOpacity>
  )
}

export default Stats

const styles = StyleSheet.create({
    container:{
         
        height:140,
       
        borderRadius:20,
        padding:10,
      
        flexDirection:"column",
        alignItems:'center',
        justifyContent:'center',
        gap:10,
    },
    background: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      height:140,
      borderRadius:20,
    },
})