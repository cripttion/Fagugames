import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import GradientText from '../components/GradientText'

const Conins = () => {
  return (
    <View style={styles.container}>
    <GradientText colors={["#004aad", "#cb6ce6"]} style={styles.text}>
       Feature launched soon in upcoming version , Please stay updated New things is Coming!    
      
     </GradientText>
     
 </View>
  )
}

export default Conins

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#000',
    justifyContent:'center',
    alignItems:'center'
  },
  text:{
    fontSize:25,
    textAlign:'center',
    marginTop:20,fontWeight:'bold',
  }
})