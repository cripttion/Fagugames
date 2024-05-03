import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import GradientText from "../components/GradientText";

const Winner = ({navigation,route}) => {
    const{data} = route.params;
    return (
    <View style={styles.container}>
         <GradientText colors={["#004aad", "#cb6ce6"]} style={[styles.text1,{fontSize:60}]}>
           HURRAY !
        </GradientText>
         <GradientText colors={["#004aad", "#cb6ce6"]} style={styles.text1}>
         {data.WinnerName} It's Your Win.
        </GradientText>
        <GradientText colors={["#004aad", "#cb6ce6"]} style={styles.text1}>
        {data.winningPoints} Points
        </GradientText>
         <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate(data.game)}>
            <Text>Restart</Text>
         </TouchableOpacity>
      
    </View>
  )
}

export default Winner;

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#000',
        justifyContent:'center',
        alignItems:'center',
    },
    text1:{
        fontSize:40,
        fontWeight:"bold"
      },
      button:{
        backgroundColor:'white',
        alignItems:'center',
        padding:10,
        borderRadius:50,
        marginTop:100
      }
})