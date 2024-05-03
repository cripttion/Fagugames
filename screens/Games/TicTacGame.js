import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
  const TicTacGame = ({navigation,route}) => {

    const {  playerData } = route.params;
    const [board,setBoard] = useState(Array(9).fill(null));
    const[winner,setWinner] = useState(null);
    const [currentPlayer,setCurrentPlayer] = useState('X');
    const [colors, setColors] = useState(Array(9).fill('black'));
    const [sound, setSound] = useState();
    const[emptyBox,setEmptyBox] = useState(9);
    async function playSound() {
      const { sound } = await Audio.Sound.createAsync( require('./../../assets/clickSound.mp3')
      );
      setSound(sound);
  
      await sound.playAsync();
    }
    async function playEndSound() {
      const { sound } = await Audio.Sound.createAsync( require('./../../assets/gameTie.mp3')
      );
      await sound.playAsync();
    }
    const restartGame = () => {
      setBoard(Array(9).fill(null));
      setCurrentPlayer('X');
      setWinner(null);
      setColors(Array(9).fill('black'));
      setEmptyBox(9);
    };

   const findWinner = ()=>{
      const winnerIndexes = [

        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
      ];
      for(let i = 0;i<winnerIndexes.length;i++)
      {
         let[x,y,z]  = winnerIndexes[i];
         if(board[x]&&board[x]===board[y]&&board[x]===board[z])
         {
           setWinner(board[x]);
           setBoard(Array(9).fill(null));
           playEndSound();
         }
      } 
   }

   useEffect(()=>{
       findWinner();
   },[board]);

    const handlePress = (index)=>{
          playSound();
          if(board[index]||winner)
          {
            return;
          }
          setEmptyBox(emptyBox-1);
          const newBoard = [...board];
          const newColors = [...colors];

          newBoard[index] = currentPlayer;
          newColors[index] = currentPlayer === 'X' ? '#cb6ce6' : '#004aad';

          setBoard(newBoard);
          setColors(newColors);
 
          const nextPlayer = currentPlayer==='X'?'0':'X';
          setCurrentPlayer(nextPlayer);
    }
    
    const stylesArray = [
      styles.box1,     
      styles.box1,    
      styles.box3,    
      styles.box1,     
      styles.box1,    
      styles.box3,    
      styles.box7,    
      styles.box7,    
         
    ];

    return (
    <>
    <View style={styles.container}>
    {currentPlayer==='X'&&
   <View style={{position:'absolute',top:70,}}>
    <Text style={[styles.text,{color:'#cb6ce6',transform:[{rotate:'180deg'}]}]}>X</Text>
   </View>
  }
    {currentPlayer==='0'&&
   <View style={{position:'absolute',bottom:70,}}>
    <Text style={[styles.text,{color:'#004aad',transform:[{rotate:'180deg'}]}]}>0</Text>
   </View>
  }
  {winner&&
    <View style={styles.winnerbox}>
        <Text style={{color:'white',fontSize:40, fontWeight:'bold',fontStyle:'italic'}}>{winner==='X'?playerData.firstPlayer:playerData.secondPlayer} Win's</Text>
        <TouchableOpacity onPress={restartGame}>
        <MaterialCommunityIcons name="restart" size={50} color="white" />
        </TouchableOpacity>
    </View>
  }
  {!winner&&emptyBox===0&&
    <View style={styles.winnerbox}>
        <Text style={{color:'white',fontSize:40, fontWeight:'bold',fontStyle:'italic'}}>It's a Draw</Text>
        <TouchableOpacity onPress={restartGame}>
        <MaterialCommunityIcons name="restart" size={50} color="white" />
        </TouchableOpacity>
    </View>
  }
   <View style={{flex:1,flexDirection:"row",flexWrap:'wrap'}} >
      {board.map((data,index)=>(
        
          <TouchableOpacity key={index} 
           onPress={()=>handlePress(index)}
          style={[stylesArray[index],styles.box]}>
            <Text style={[styles.text,{ color: colors[index] }]}>{data}</Text>
          </TouchableOpacity>
       
      ))}
      </View>
     
      

    
    </View>
    <View style={styles.player1Name}>
       
        <Text style={styles.text}>{playerData.firstPlayer}</Text>
      </View>
      <View style={styles.player2Name}>
        <Text style={styles.text}>{playerData.secondPlayer}</Text>
        
      </View>
  
    </>
  )
}

export default TicTacGame

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection:"row",
        backgroundColor:'#000',
        justifyContent:'center',
        alignItems:"center"
      },
      text: {
        color: "white",
        fontSize: 40,
        fontWeight:'bold',
        fontStyle:"italic",
       
      },
      player1Name: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        transform: [{ rotate: "180deg" }],
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: "center",
      },
      player2Name: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection:'column-reverse',
        alignItems: "center",
        justifyContent: "center",
      },
      box:{
       
        borderColor:'white',
        width:'33.33%',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        height:140,
        
      },
      box1:{
        borderRightWidth:3,
        borderBottomWidth:3,
      },

      box3:{
    
        borderBottomWidth:3,
      },
      
      box7:{
        borderRightWidth:3,
       
      },
     
     winnerbox:{
      position:'absolute',
      top:300,
      bottom:300,
      right:20,
      left:20,
      borderRadius:20,
      borderColor:'blue',
      borderWidth:6,
      elevation:10,
      flexDirection:'column',
      gap:30,
      justifyContent:"center",
      alignItems:'center',
      backgroundColor:'#004aad',
      zIndex:20,
    }
      
})