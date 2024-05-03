import { Image, ScrollView, StyleSheet, Text, TextInput, View,TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import rb from './../../assets/4.png'
import GradientText from '../../components/GradientText';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from '@react-native-async-storage/async-storage';

const RedBlue = ({navigation}) => {
  const [player1,setPlayer1] = useState("");
  const[player2,setPlayer2] = useState("");
  return (
    <ScrollView style={styles.container}>
      
        <Image source={rb} style={{width:'100%',maxHeight:300,borderWidth:6,borderColor:'#004aad'}} />
        <View style={{flexDirection:'row',alignItems:'center'}}>
        <GradientText colors={["#004aad", "#cb6ce6"]} style={styles.text1} >
            Add players
        </GradientText>
        <View style={{marginTop:10}}>
        <MaterialIcons name="videogame-asset" size={40} color="#004aad" />
        </View>
        </View>
        <View>
          <Text style={styles.text}>Player 1</Text>
          <TextInput style={[styles.textBox,{  borderColor:'#cb6ce6'}]} value={player1} onChangeText={(text)=>setPlayer1(text)} placeholder='Player 1'/>
          <Text style={styles.text}>Player 2</Text>
          <TextInput style={[styles.textBox,{  borderColor:'#004aad'}]} value={player2} onChangeText={(text)=>setPlayer2(text)} placeholder='Player 1'/>

       </View>
       <View>
       <TouchableOpacity
          style={{
            
            marginHorizontal: 20,
          }}
          onPress={async () => {
            await AsyncStorage.setItem('RecentGame', 'RedBlue');
            navigation.navigate('RedBlueGame', {
              playerData: {
                firstPlayer: player1,
                secondPlayer: player2
              }
            });
          }}
        >
          <LinearGradient
            // Button Linear Gradient
            colors={["#004aad", "#cb6ce6"]}
            start={{ x: 0.8, y: 0.6 }}
            end={{ x: 0, y: 0.6 }}
            style={styles.button}
          >
            <Text style={{fontSize:20,textAlign:'center',color:'white',fontWeight:'bold'}}>START GAME</Text>
          </LinearGradient>
        </TouchableOpacity>
       </View>
      
    </ScrollView>
  )
}

export default RedBlue

const styles = StyleSheet.create({
  container:{
    flex:1,
    height:'100vh',
    backgroundColor:'#000000'
  },
  text1:{
    fontSize:30,
    marginHorizontal:10,
    marginTop:10,
    fontWeight:'bold'
  },
  textBox:{
    borderWidth:6,
  
    borderRadius:20,
    padding:10,
    color:'white',
    marginHorizontal:20,
    fontSize:16,
    marginVertical:10,
  },
  text:{
    fontSize:20,
    marginHorizontal:10,
    marginTop:10,
    color:'white',
    fontWeight:'bold',
    textAlign:'center',
  },
  button: {
    marginTop:50,
    padding:20,
    borderRadius: 20,
  },
 
})