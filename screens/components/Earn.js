import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { useFonts } from "expo-font";

const Earn = ({navigation}) => {
 
  return (
    <TouchableOpacity style={styles.container} onPress={()=>navigation.navigate('Coins')}>
  <LinearGradient
        // Background Linear Gradient
        colors={["#004aad", "#cb6ce6"]}
        style={styles.background}
      />
         <Text  style={{color:'white',fontSize:20,textAlign:'center',fontWeight:'bold'}}>Coins</Text>
         <FontAwesome5 name="coins" size={30} color="yellow"  />
    </TouchableOpacity>
  )
}

export default Earn

const styles = StyleSheet.create({
    container:{
        
        height:140,
      
        borderRadius:20,
        padding:10,

        flexDirection:"column",
        alignItems:'center',
        justifyContent:'center',
        gap:10

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