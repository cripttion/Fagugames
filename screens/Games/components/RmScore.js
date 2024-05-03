import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { FontAwesome } from '@expo/vector-icons';

const RmScore = ({data,closeScore}) => {
 
const sumData = data.reduce((acc, obj) => {
    for (let key in obj) {
      if (acc[key]) {
        acc[key] += obj[key];
      } else {
        acc[key] = obj[key];
      }
    }
    return acc;
  }, {});
  return (
    <View style={{backgroundColor:'white'}}>
        <View>
            <TouchableOpacity style={styles.closeButton} onPress={()=>closeScore(false)}>
            <FontAwesome name="window-close" size={40} color="red" />
            </TouchableOpacity>
        </View>
      <View style={[styles.row]}>
        {Object.keys(data[0]).map(xx=>(
            <Text key={xx} style={styles.cell}>{xx}</Text>
        ))}
      </View>
      {data.map((item, index) => (
        <View key={index} style={styles.row}>
          {Object.values(item).map(key => (
            <Text key={key} style={styles.cell}>{key}</Text>
          ))}
        </View>
      ))}
      <View style={styles.row}>
        {Object.keys(sumData).map(key => (
          <Text key={key} style={[styles.cell, styles.total]}>{sumData[key]}</Text>
        ))}
      </View>
    </View>
    // <View style={}>
    //     <Text>Score</Text>
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    paddingVertical: 5,
    
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  header: {
    fontWeight: 'bold',
    color:'white',
  },
  total: {
    borderTopWidth: 1,
    borderTopColor: 'black',
    fontWeight: 'bold',
  },
  closeButton:{

   marginTop:5,
   marginBottom:10,
       // backgroundColor:'red',
    padding:5,
   
    flexDirection:"row-reverse",
   
  }
});

export default RmScore;
