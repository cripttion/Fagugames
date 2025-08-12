import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  Dimensions,
  StatusBar,
  Alert,
  Vibration,
  Modal
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import bottle from "./../../assets/bottle.png";
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
  withSequence,
  runOnJS,
} from "react-native-reanimated";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { Audio } from 'expo-av';
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get('window');

const TruthDare = ({ navigation }) => {
  const angle = useSharedValue(0);
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(1);
  const coinScale = useSharedValue(0);
  
  const [isSpinning, setIsSpinning] = useState(false);
  const [sound, setSound] = useState();
  const [coins, setCoins] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [lastCoinTime, setLastCoinTime] = useState(Date.now());
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [temp, setTemp] = useState(0);
  
  // Particle animations
  const particles = useRef(
    Array.from({ length: 12 }, () => ({
      x: useSharedValue(Math.random() * width),
      y: useSharedValue(Math.random() * height),
      opacity: useSharedValue(0.3),
      scale: useSharedValue(0.5),
    }))
  ).current;

  useEffect(() => {
    loadCoins();
    startParticleAnimation();
    startCoinTimer();
    
    return () => {
      // Cleanup function
      const cleanup = async () => {
        if (sound) {
          try {
            const status = await sound.getStatusAsync();
            if (status.isLoaded) {
              if (status.isPlaying) {
                await sound.stopAsync();
              }
              await sound.unloadAsync();
            }
          } catch (error) {
            // Ignore cleanup errors during unmount
          }
        }
      };
      cleanup();
    };
  }, []);

  // Timer logic for stopping spin and sound (from your original code)
  useEffect(() => {
    let timer1;
    if (temp) {
      timer1 = setTimeout(() => {
        cancelAnimation(angle);
        setIsSpinning(false);
        onSpinComplete();
        
        // Stop sound safely
        if (sound) {
          sound.getStatusAsync().then((status) => {
            if (status.isLoaded) {
              sound.unloadAsync().catch((error) => {
                console.log('Sound unload error:', error);
              });
            }
          }).catch((error) => {
            console.log('Sound status error:', error);
          });
        }
      }, 3 * 1000);
    }
    
    return () => {
      clearTimeout(timer1);
    };
  }, [temp, sound]);

  const loadCoins = async () => {
    try {
      const storedCoins = await AsyncStorage.getItem("userCoins");
      setCoins(parseInt(storedCoins) || 0);
    } catch (error) {
      console.error('Error loading coins:', error);
    }
  };

  const addCoin = async () => {
    try {
      const newCoinCount = coins + 1;
      setCoins(newCoinCount);
      await AsyncStorage.setItem("userCoins", newCoinCount.toString());
      
      // Animate coin earning
      coinScale.value = withSequence(
        withSpring(1.5, { damping: 10 }),
        withSpring(1, { damping: 10 })
      );
      
      Vibration.vibrate(100);
    } catch (error) {
      console.error('Error adding coin:', error);
    }
  };

  const startCoinTimer = () => {
    const interval = setInterval(() => {
      const now = Date.now();
      const timeDiff = now - lastCoinTime;
      
      if (timeDiff >= 60000) { // 1 minute = 60000ms
        addCoin();
        setLastCoinTime(now);
      }
      
      setTimeSpent(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  };

  const startParticleAnimation = () => {
    particles.forEach((particle, index) => {
      const animateParticle = () => {
        particle.y.value = -20;
        particle.x.value = Math.random() * width;
        
        particle.y.value = withTiming(height + 20, {
          duration: 8000 + Math.random() * 4000,
        });
        
        particle.opacity.value = withRepeat(
          withSequence(
            withTiming(0.8, { duration: 2000 }),
            withTiming(0.2, { duration: 2000 })
          ),
          -1,
          true
        );
        
        setTimeout(animateParticle, Math.random() * 5000);
      };
      
      setTimeout(animateParticle, index * 500);
    });
  };

  async function playSpinSound() {
    const { sound } = await Audio.Sound.createAsync(
      require('./../../assets/bottleSpin.mp3')
    );
    setSound(sound);
    await sound.playAsync();
  }

  const animatedBottleStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${angle.value * 360}deg` },
      { scale: scale.value }
    ],
  }));

  const animatedGlowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const animatedCoinStyle = useAnimatedStyle(() => ({
    transform: [{ scale: coinScale.value }],
  }));

  const onSpinComplete = () => {
    // Celebration effects
    glowOpacity.value = withSequence(
      withTiming(1, { duration: 300 }),
      withTiming(0, { duration: 1000 })
    );
    
    scale.value = withSequence(
      withSpring(1.2, { damping: 8 }),
      withSpring(1, { damping: 8 })
    );
    
    Vibration.vibrate([100, 50, 100]);
  };

  const startAnimation = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    playSpinSound();
    
    // Reset angle and start spinning using your logic
    angle.value = 0;
    angle.value = withRepeat(
      withTiming(10 + temp, { duration: 10000, easing: Easing.linear }),
      5,
      true
    );
    setTemp(temp > 12 ? 2 : temp + 1);
    
    // Button press animation
    buttonScale.value = withSequence(
      withSpring(0.9, { damping: 10 }),
      withSpring(1, { damping: 10 })
    );
    
    // Glow effect during spin
    glowOpacity.value = withTiming(0.8, { duration: 500 });
  };

  const getTimeUntilNextCoin = () => {
    const timeSinceLastCoin = Date.now() - lastCoinTime;
    const timeLeft = Math.max(0, 60000 - timeSinceLastCoin);
    return Math.ceil(timeLeft / 1000);
  };

  const HowToPlayModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showHowToPlay}
      onRequestClose={() => setShowHowToPlay(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={['#000000', '#1a0033', '#330066']}
            style={styles.modalGradient}
          >
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🎮 HOW TO PLAY</Text>
              <TouchableOpacity
                onPress={() => setShowHowToPlay(false)}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            
            {/* Modal Content */}
            <View style={styles.modalContent}>
              <View style={styles.instructionRow}>
                <Text style={styles.instructionEmoji}>🎯</Text>
                <Text style={styles.instructionText}>Spin the bottle to choose Truth or Dare</Text>
              </View>
              
              <View style={styles.instructionRow}>
                <Text style={styles.instructionEmoji}>👥</Text>
                <Text style={styles.instructionText}>Follow the bottle's direction</Text>
              </View>
              
              <View style={styles.instructionRow}>
                <Text style={styles.instructionEmoji}>💎</Text>
                <Text style={styles.instructionText}>Earn coins every minute of play</Text>
              </View>
              
              <View style={styles.instructionRow}>
                <Text style={styles.instructionEmoji}>🚀</Text>
                <Text style={styles.instructionText}>Challenge your friends!</Text>
              </View>
              
              <View style={styles.tipContainer}>
                <Text style={styles.tipTitle}>💡 Pro Tip:</Text>
                <Text style={styles.tipText}>
                  The bottle will spin for 3-5 seconds. Wait for it to completely stop before revealing your challenge!
                </Text>
              </View>
            </View>
            
            {/* Modal Footer */}
            <TouchableOpacity
              style={styles.gotItButton}
              onPress={() => setShowHowToPlay(false)}
            >
              <LinearGradient
                colors={['#004aad', '#cb6ce6']}
                style={styles.gotItGradient}
              >
                <Text style={styles.gotItText}>Got It! 🎉</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Animated background particles */}
      {particles.map((particle, index) => (
        <Animated.View
          key={index}
          style={[
            styles.particle,
            {
              transform: [
                { translateX: particle.x },
                { translateY: particle.y },
                { scale: particle.scale }
              ],
              opacity: particle.opacity,
            },
          ]}
        />
      ))}

      <LinearGradient
        colors={['#000000', '#1a0033', '#330066', '#1a0033', '#000000']}
        style={styles.backgroundGradient}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Header with back button, info button and coins */}
          <View style={styles.header}>
            <View style={styles.leftHeader}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={['rgba(0, 74, 173, 0.3)', 'rgba(203, 108, 230, 0.3)']}
                  style={styles.backButtonGradient}
                >
                  <MaterialIcons name="arrow-back" size={24} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.infoButton}
                onPress={() => setShowHowToPlay(true)}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={['rgba(0, 74, 173, 0.3)', 'rgba(203, 108, 230, 0.3)']}
                  style={styles.infoButtonGradient}
                >
                  <MaterialIcons name="info" size={24} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <Animated.View style={[styles.coinContainer, animatedCoinStyle]}>
              <LinearGradient
                colors={['#FFD700', '#FFA500']}
                style={styles.coinGradient}
              >
                <FontAwesome name="diamond" size={16} color="#000" />
                <Text style={styles.coinText}>{coins}</Text>
              </LinearGradient>
            </Animated.View>
          </View>

          {/* Game Title */}
          <View style={styles.titleContainer}>
            <LinearGradient
              colors={['#004aad', '#cb6ce6']}
              style={styles.titleGradient}
            >
              <Text style={styles.gameTitle}>🎯 TRUTH OR DARE</Text>
            </LinearGradient>
            <Text style={styles.subtitle}>Spin the bottle to reveal your fate!</Text>
          </View>

          {/* Coin Timer Info */}
          <View style={styles.coinTimerContainer}>
            <LinearGradient
              colors={['rgba(255, 215, 0, 0.2)', 'rgba(255, 165, 0, 0.2)']}
              style={styles.coinTimer}
            >
              <FontAwesome name="clock-o" size={16} color="#FFD700" />
              <Text style={styles.coinTimerText}>
                {getTimeUntilNextCoin() > 0 
                  ? `Next coin in ${getTimeUntilNextCoin()}s` 
                  : 'Coin earned! 🎉'
                }
              </Text>
            </LinearGradient>
          </View>

          {/* Main Game Area */}
          <View style={styles.gameArea}>
            {/* Glow effect behind bottle */}
            <Animated.View style={[styles.glowEffect, animatedGlowStyle]} />
            
            {/* Spinning bottle */}
            <View style={styles.bottleContainer}>
              <Animated.Image
                source={bottle}
                style={[styles.bottle, animatedBottleStyle]}
              />
              
              {/* Center dot */}
              <View style={styles.centerDot}>
                <LinearGradient
                  colors={['#004aad', '#cb6ce6']}
                  style={styles.centerDotGradient}
                />
              </View>
            </View>

            {/* Spin status */}
            <View style={styles.statusContainer}>
              {isSpinning ? (
                <View style={styles.spinningStatus}>
                  <Text style={styles.spinningText}>🌟 SPINNING...</Text>
                  <Text style={styles.spinningSubtext}>The bottle decides your destiny!</Text>
                </View>
              ) : (
                <View style={styles.readyStatus}>
                  <Text style={styles.readyText}>⚡ READY TO SPIN</Text>
                  <Text style={styles.readySubtext}>Tap the button below to start!</Text>
                </View>
              )}
            </View>
          </View>

          {/* Spin Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={startAnimation}
              style={styles.spinButtonWrapper}
              activeOpacity={0.8}
              disabled={isSpinning}
            >
              <Animated.View style={animatedButtonStyle}>
                <LinearGradient
                  colors={isSpinning ? ['#666', '#444'] : ['#004aad', '#cb6ce6']}
                  style={[styles.spinButton, isSpinning && styles.disabledButton]}
                >
                  <FontAwesome 
                    name={isSpinning ? "spinner" : "rotate-right"} 
                    size={28} 
                    color="white" 
                  />
                  <Text style={styles.spinButtonText}>
                    {isSpinning ? 'SPINNING...' : 'SPIN BOTTLE'}
                  </Text>
                </LinearGradient>
              </Animated.View>
            </TouchableOpacity>
          </View>

          {/* Game Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>⏱️</Text>
              <Text style={styles.statLabel}>{Math.floor(timeSpent / 60)}m {timeSpent % 60}s</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>🎯</Text>
              <Text style={styles.statLabel}>Truth or Dare</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>💎</Text>
              <Text style={styles.statLabel}>+1 per min</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* How to Play Modal */}
      <HowToPlayModal />
    </View>
  );
};

export default TruthDare;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  backgroundGradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
  particle: {
    position: 'absolute',
    width: 3,
    height: 3,
    backgroundColor: '#004aad',
    borderRadius: 1.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 20,
  },
  leftHeader: {
    flexDirection: 'row',
    gap: 10,
  },
  backButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    overflow: 'hidden',
  },
  backButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  infoButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    overflow: 'hidden',
  },
  infoButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  coinContainer: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  coinGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  coinText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  titleGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
    marginBottom: 10,
  },
  gameTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 2,
    textAlign: 'center',
  },
  subtitle: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  coinTimerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  coinTimer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  coinTimerText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  glowEffect: {
    position: 'absolute',
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: 'rgba(0, 74, 173, 0.3)',
    shadowColor: '#004aad',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 10,
  },
  bottleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  bottle: {
    width: 280,
    height: 280,
    resizeMode: 'contain',
  },
  centerDot: {
    position: 'absolute',
   
  },
  centerDotGradient: {
    flex: 1,
    shadowColor: '#004aad',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  statusContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  spinningStatus: {
    alignItems: 'center',
  },
  spinningText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#cb6ce6',
    marginBottom: 5,
  },
  spinningSubtext: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
  readyStatus: {
    alignItems: 'center',
  },
  readyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004aad',
    marginBottom: 5,
  },
  readySubtext: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
  buttonContainer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  spinButtonWrapper: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#004aad',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  spinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
    gap: 10,
    minWidth: 180,
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  spinButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 74, 173, 0.1)',
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 74, 173, 0.2)',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    marginBottom: 4,
  },
  statLabel: {
    color: '#ccc',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 10,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalGradient: {
    padding: 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  closeButton: {
    padding: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  instructionEmoji: {
    fontSize: 20,
    marginRight: 12,
    width: 30,
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    color: '#ccc',
    lineHeight: 22,
  },
  tipContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'rgba(0, 74, 173, 0.2)',
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#004aad',
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 20,
  },
  gotItButton: {
    margin: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  gotItGradient: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  gotItText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});