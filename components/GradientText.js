import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MaskedView from '@react-native-community/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

const GradientText = ({colors, ...rest}) => {
  return (
    <MaskedView maskElement={<Text {...rest} />}>
      <LinearGradient colors={colors} start={{x:0.8, y: 0.6}} end={{x: 0, y: 0.6}}>
        <Text {...rest} style={[rest.style, {opacity: 0}]} />
      </LinearGradient>
    </MaskedView>
  )
}

export default GradientText

const styles = StyleSheet.create({})