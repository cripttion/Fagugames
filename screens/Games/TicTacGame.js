import { Pressable, StyleSheet, Text, TouchableOpacity, View, Animated, Dimensions } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const TicTacGame = ({ navigation, route }) => {
  const { playerData } = route.params;
  
  // Game State
  const [board, setBoard] = useState(Array(9).fill(null));
  const [winner, setWinner] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [colors, setColors] = useState(Array(9).fill('transparent'));
  const [sound, setSound] = useState();
  const [emptyBox, setEmptyBox] = useState(9);
  
  // Score & Coins State
  const [playerXScore, setPlayerXScore] = useState(0);
  const [playerOScore, setPlayerOScore] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const [roundCoins, setRoundCoins] = useState(0);
  const [showCoinAnimation, setShowCoinAnimation] = useState(false);
  
  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const coinAnim = useRef(new Animated.Value(0)).current;
  const boardShakeAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const winnerBoxAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadUserCoins();
    startGlowAnimation();
    startPulseAnimation();
  }, []);

  useEffect(() => {
    findWinner();
  }, [board]);

  const loadUserCoins = async () => {
    try {
      const coins = await AsyncStorage.getItem('userCoins');
      if (coins) {
        setTotalCoins(parseInt(coins));
      }
    } catch (error) {
      console.error('Error loading coins:', error);
    }
  };

  const saveUserCoins = async (newCoins) => {
    try {
      await AsyncStorage.setItem('userCoins', newCoins.toString());
      setTotalCoins(newCoins);
    } catch (error) {
      console.error('Error saving coins:', error);
    }
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const startGlowAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  };

  const animateCoinReward = (coinsEarned) => {
    setRoundCoins(coinsEarned);
    setShowCoinAnimation(true);
    
    Animated.sequence([
      Animated.timing(coinAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(coinAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowCoinAnimation(false);
    });
  };

  const shakeBoard = () => {
    Animated.sequence([
      Animated.timing(boardShakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(boardShakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(boardShakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(boardShakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const showWinnerAnimation = () => {
    Animated.spring(winnerBoxAnim, {
      toValue: 1,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  async function playSound() {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('./../../assets/clickSound.mp3')
      );
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.log('Sound error:', error);
    }
  }

  async function playEndSound() {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('./../../assets/gameTie.mp3')
      );
      await sound.playAsync();
    } catch (error) {
      console.log('End sound error:', error);
    }
  }

  async function playWinSound() {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('./../../assets/winsound.mp3')
      );
      await sound.playAsync();
    } catch (error) {
      console.log('Win sound error:', error);
    }
  }

  const restartGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setColors(Array(9).fill('transparent'));
    setEmptyBox(9);
    winnerBoxAnim.setValue(0);
  };

  const findWinner = () => {
    const winnerIndexes = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (let i = 0; i < winnerIndexes.length; i++) {
      let [x, y, z] = winnerIndexes[i];
      if (board[x] && board[x] === board[y] && board[x] === board[z]) {
        setWinner(board[x]);
        
        // Update scores and award coins
        let coinsEarned = 5; // 5 coins for winning
        if (board[x] === 'X') {
          setPlayerXScore(prev => prev + 1);
        } else {
          setPlayerOScore(prev => prev + 1);
        }
        
        const newTotalCoins = totalCoins + coinsEarned;
        saveUserCoins(newTotalCoins);
        animateCoinReward(coinsEarned);
        
        showWinnerAnimation();
        playWinSound();
        return;
      }
    }

    // Check for tie - when all boxes are filled and no winner
    const filledBoxes = board.filter(box => box !== null).length;
    if (filledBoxes === 9 && !winner) {
      // Set winner as 'TIE' to show modal
      setWinner('TIE');
      // Award consolation coins for tie
      const coinsEarned = 2; // 2 coins for tie
      const newTotalCoins = totalCoins + coinsEarned;
      saveUserCoins(newTotalCoins);
      animateCoinReward(coinsEarned);
      showWinnerAnimation();
      playEndSound();
    }
  };

  const handlePress = (index) => {
    if (board[index] || winner) {
      shakeBoard();
      return;
    }

    playSound();
    setEmptyBox(emptyBox - 1);

    const newBoard = [...board];
    const newColors = [...colors];

    newBoard[index] = currentPlayer;
    newColors[index] = currentPlayer === 'X' ? 'rgba(203, 108, 230, 0.3)' : 'rgba(0, 74, 173, 0.3)';

    setBoard(newBoard);
    setColors(newColors);

    const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
    setCurrentPlayer(nextPlayer);

    // Award participation coin for each move
    const newTotalCoins = totalCoins + 1;
    saveUserCoins(newTotalCoins);
  };

  const getBoxStyle = (index) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    
    return {
      borderRightWidth: col < 2 ? 3 : 0,
      borderBottomWidth: row < 2 ? 3 : 0,
    };
  };

  return (
    <LinearGradient 
      colors={['#0a0a0a', '#1a0033', '#0a0a0a']} 
      style={styles.container}
    >
      {/* Animated Background Effects */}
      <Animated.View 
        style={[
          styles.backgroundGlow,
          {
            opacity: glowAnim,
            transform: [{ scale: glowAnim }]
          }
        ]}
      />

      {/* Header with Scores */}
      <View style={styles.header}>
        <View style={styles.scoreContainer}>
          <View style={[styles.playerScore, { borderColor: '#cb6ce6' }]}>
            <Text style={[styles.playerName, { color: '#cb6ce6' }]}>
              {playerData.firstPlayer}
            </Text>
            <Text style={[styles.scoreText, { color: '#cb6ce6' }]}>
              {playerXScore}
            </Text>
          </View>
          
          <View style={styles.vsContainer}>
            <Text style={styles.vsText}>VS</Text>
            <View style={styles.coinDisplay}>
              <MaterialCommunityIcons name="cash-multiple" size={20} color="#FFD700" />
              <Text style={styles.coinText}>{totalCoins}</Text>
            </View>
          </View>
          
          <View style={[styles.playerScore, { borderColor: '#004aad' }]}>
            <Text style={[styles.playerName, { color: '#004aad' }]}>
              {playerData.secondPlayer}
            </Text>
            <Text style={[styles.scoreText, { color: '#004aad' }]}>
              {playerOScore}
            </Text>
          </View>
        </View>
      </View>

      {/* Current Player Indicator */}
      <Animated.View 
        style={[
          styles.currentPlayerIndicator,
          { transform: [{ scale: pulseAnim }] }
        ]}
      >
        <Text style={[
          styles.currentPlayerText,
          { color: currentPlayer === 'X' ? '#cb6ce6' : '#004aad' }
        ]}>
          {currentPlayer === 'X' ? playerData.firstPlayer : playerData.secondPlayer}'s Turn
        </Text>
        <Text style={[
          styles.currentPlayerSymbol,
          { color: currentPlayer === 'X' ? '#cb6ce6' : '#004aad' }
        ]}>
          {currentPlayer}
        </Text>
      </Animated.View>

      {/* Game Board */}
      <Animated.View 
        style={[
          styles.boardContainer,
          { transform: [{ translateX: boardShakeAnim }] }
        ]}
      >
        <View style={styles.board}>
          {board.map((data, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handlePress(index)}
              style={[
                styles.box,
                getBoxStyle(index),
                { backgroundColor: colors[index] }
              ]}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.text,
                { 
                  color: data === 'X' ? '#cb6ce6' : data === 'O' ? '#004aad' : 'transparent',
                  textShadowColor: data ? 'rgba(255,255,255,0.5)' : 'transparent',
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: 10
                }
              ]}>
                {data}
              </Text>
              {data && (
                <View style={[
                  styles.symbolGlow,
                  { 
                    backgroundColor: data === 'X' ? 'rgba(203, 108, 230, 0.2)' : 'rgba(0, 74, 173, 0.2)'
                  }
                ]} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      {/* Winner Modal */}
      {winner && (
        <Animated.View 
          style={[
            styles.winnerModal,
            {
              transform: [{ scale: winnerBoxAnim }],
              opacity: winnerBoxAnim
            }
          ]}
        >
          <LinearGradient
            colors={winner === 'TIE'
              ? ['#333333', '#555555']
              : winner === 'X' 
                ? ['#cb6ce6', '#8b5cf6'] 
                : ['#004aad', '#0066cc']
            }
            style={styles.winnerContent}
          >
            <MaterialCommunityIcons 
              name={winner === 'TIE' ? "handshake" : "trophy"} 
              size={60} 
              color="#FFD700" 
            />
            
            <Text style={styles.winnerTitle}>
              {winner === 'TIE'
                ? "🤝 IT'S A DRAW! 🤝"
                : `🎉 ${winner === 'X' ? playerData.firstPlayer : playerData.secondPlayer} WINS! 🎉`
              }
            </Text>
            
            <View style={styles.rewardContainer}>
              <MaterialCommunityIcons name="cash-multiple" size={30} color="#FFD700" />
              <Text style={styles.rewardText}>
                +{winner === 'TIE' ? '2' : '5'} Coins Earned!
              </Text>
            </View>
            
            <TouchableOpacity 
              onPress={restartGame}
              style={styles.playAgainButton}
            >
              <LinearGradient
                colors={['#FFD700', '#FFA500']}
                style={styles.playAgainGradient}
              >
                <MaterialCommunityIcons name="restart" size={25} color="#000" />
                <Text style={styles.playAgainText}>PLAY AGAIN</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      )}

      {/* Coin Animation */}
      {showCoinAnimation && (
        <Animated.View 
          style={[
            styles.coinAnimation,
            {
              opacity: coinAnim,
              transform: [
                { scale: coinAnim },
                { translateY: coinAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, -20]
                })}
              ]
            }
          ]}
        >
          <MaterialCommunityIcons name="cash-multiple" size={50} color="#FFD700" />
          <Text style={styles.coinAnimationText}>+{roundCoins} Coins!</Text>
        </Animated.View>
      )}

      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <MaterialCommunityIcons name="arrow-left" size={30} color="#fff" />
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default TicTacGame;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  backgroundGlow: {
    position: 'absolute',
    top: height * 0.3,
    left: width * 0.2,
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    backgroundColor: 'rgba(203, 108, 230, 0.1)',
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playerScore: {
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 15,
    padding: 15,
    backgroundColor: 'rgba(255,255,255,0.05)',
    minWidth: 100,
  },
  playerName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  scoreText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  vsContainer: {
    alignItems: 'center',
  },
  vsText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  coinDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  coinText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  currentPlayerIndicator: {
    alignItems: 'center',
    marginBottom: 30,
  },
  currentPlayerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  currentPlayerSymbol: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  boardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  board: {
    width: 300,
    height: 300,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 3,
    borderColor: '#fff',
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  box: {
    width: '33.33%',
    height: '33.33%',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#fff',
    position: 'relative',
  },
  text: {
    fontSize: 50,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  symbolGlow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  winnerModal: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  winnerContent: {
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFD700',
    margin: 20,
  },
  winnerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  rewardText: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  playAgainButton: {
    marginTop: 10,
  },
  playAgainGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  playAgainText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  coinAnimation: {
    position: 'absolute',
    top: height * 0.4,
    alignSelf: 'center',
    alignItems: 'center',
  },
  coinAnimationText: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 10,
    borderRadius: 25,
  },
});