import { 
  Image, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TextInput, 
  View,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Vibration
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import rb from './../../assets/3.png';
import GradientText from '../../components/GradientText';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  withRepeat,
  Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const TicTac = ({ navigation }) => {
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [showValidation, setShowValidation] = useState(false);
  
  // Animation values
  const fadeInAnim = useSharedValue(0);
  const slideInAnim = useSharedValue(100);
  const buttonScale = useSharedValue(1);
  const imageScale = useSharedValue(0.8);
  const glowOpacity = useSharedValue(0);
  const shakeAnim = useSharedValue(0);
  
  // Floating particles
  const particles = useRef(
    Array.from({ length: 8 }, () => ({
      x: useSharedValue(Math.random() * width),
      y: useSharedValue(Math.random() * height),
      opacity: useSharedValue(0.4),
      scale: useSharedValue(0.5),
    }))
  ).current;

  useEffect(() => {
    // Entry animations
    fadeInAnim.value = withTiming(1, { duration: 800 });
    slideInAnim.value = withTiming(0, { duration: 800, easing: Easing.out(Easing.cubic) });
    imageScale.value = withSpring(1, { damping: 8, stiffness: 100 });
    
    // Start floating particles
    startParticleAnimation();
    
    // Glow pulse effect
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 2000 }),
        withTiming(0.1, { duration: 2000 })
      ),
      -1,
      true
    );
  }, []);

  const startParticleAnimation = () => {
    particles.forEach((particle, index) => {
      const animateParticle = () => {
        particle.y.value = -20;
        particle.x.value = Math.random() * width;
        
        particle.y.value = withTiming(height + 20, {
          duration: 6000 + Math.random() * 4000,
        });
        
        particle.opacity.value = withRepeat(
          withSequence(
            withTiming(0.6, { duration: 1500 }),
            withTiming(0.2, { duration: 1500 })
          ),
          -1,
          true
        );
        
        setTimeout(animateParticle, Math.random() * 3000);
      };
      
      setTimeout(animateParticle, index * 300);
    });
  };

  const validateAndStart = () => {
    if (!player1.trim() || !player2.trim()) {
      setShowValidation(true);
      
      // Shake animation for validation
      shakeAnim.value = withSequence(
        withTiming(-10, { duration: 100 }),
        withTiming(10, { duration: 100 }),
        withTiming(-10, { duration: 100 }),
        withTiming(10, { duration: 100 }),
        withTiming(0, { duration: 100 })
      );
      
      Vibration.vibrate(200);
      
      setTimeout(() => setShowValidation(false), 3000);
      return;
    }

    // Success animation
    buttonScale.value = withSequence(
      withSpring(0.95, { damping: 10 }),
      withSpring(1.05, { damping: 8 }),
      withSpring(1, { damping: 8 })
    );
    
    Vibration.vibrate(100);
    
    setTimeout(() => {
      AsyncStorage.setItem('RecentGame', "ZeroKatis");
      navigation.navigate('TicTacGame', {
        playerData: {
          firstPlayer: player1.trim(),
          secondPlayer: player2.trim()
        }
      });
    }, 300);
  };

  // Animated styles
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: fadeInAnim.value,
    transform: [{ translateY: slideInAnim.value }],
  }));

  const imageAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: imageScale.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const shakeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeAnim.value }],
  }));

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
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View style={containerAnimatedStyle}>
              {/* Header with back button */}
              <View style={styles.header}>
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
                
                <Text style={styles.headerTitle}>Setup Game</Text>
                <View style={styles.placeholder} />
              </View>

              {/* Game Image with glow effect */}
              <View style={styles.imageContainer}>
                <Animated.View style={[styles.imageGlow, glowAnimatedStyle]} />
                <Animated.Image 
                  source={rb} 
                  style={[styles.gameImage, imageAnimatedStyle]} 
                />
              </View>

              {/* Title Section */}
              <View style={styles.titleSection}>
                <View style={styles.titleRow}>
                  <GradientText colors={["#004aad", "#cb6ce6"]} style={styles.titleText}>
                    Add Players
                  </GradientText>
                  <View style={styles.gameIcon}>
                    <LinearGradient
                      colors={['rgba(0, 74, 173, 0.2)', 'rgba(203, 108, 230, 0.2)']}
                      style={styles.gameIconGradient}
                    >
                      <MaterialIcons name="videogame-asset" size={32} color="#004aad" />
                    </LinearGradient>
                  </View>
                </View>
                <Text style={styles.subtitle}>Enter player names to begin the battle!</Text>
              </View>

              {/* Validation Message */}
              {showValidation && (
                <Animated.View style={[styles.validationContainer, shakeAnimatedStyle]}>
                  <LinearGradient
                    colors={['rgba(255, 59, 48, 0.2)', 'rgba(255, 149, 0, 0.2)']}
                    style={styles.validation}
                  >
                    <MaterialIcons name="warning" size={20} color="#FF3B30" />
                    <Text style={styles.validationText}>
                      Please enter both player names!
                    </Text>
                  </LinearGradient>
                </Animated.View>
              )}

              {/* Player Input Section */}
              <View style={styles.playersSection}>
                {/* Player 1 */}
                <View style={styles.playerContainer}>
                  <View style={styles.playerHeader}>
                    <LinearGradient
                      colors={['#cb6ce6', '#9d4edd']}
                      style={styles.playerBadge}
                    >
                      <FontAwesome name="user" size={16} color="#fff" />
                      <Text style={styles.playerBadgeText}>Player 1</Text>
                    </LinearGradient>
                    <Text style={styles.playerSymbol}>❌</Text>
                  </View>
                  
                  <View style={styles.inputContainer}>
                    <LinearGradient
                      colors={['rgba(203, 108, 230, 0.1)', 'rgba(157, 78, 221, 0.1)']}
                      style={styles.inputGradient}
                    >
                      <MaterialIcons name="person" size={20} color="#cb6ce6" style={styles.inputIcon} />
                      <TextInput 
                        style={[styles.textInput, { borderColor: '#cb6ce6' }]} 
                        value={player1} 
                        onChangeText={setPlayer1}
                        placeholder='Enter Player 1 name'
                        placeholderTextColor='rgba(203, 108, 230, 0.5)'
                        maxLength={15}
                      />
                    </LinearGradient>
                  </View>
                </View>

                {/* VS Divider */}
                <View style={styles.vsContainer}>
                  <LinearGradient
                    colors={['#004aad', '#cb6ce6']}
                    style={styles.vsCircle}
                  >
                    <Text style={styles.vsText}>VS</Text>
                  </LinearGradient>
                  <View style={styles.vsLine} />
                </View>

                {/* Player 2 */}
                <View style={styles.playerContainer}>
                  <View style={styles.playerHeader}>
                    <LinearGradient
                      colors={['#004aad', '#0056d6']}
                      style={styles.playerBadge}
                    >
                      <FontAwesome name="user" size={16} color="#fff" />
                      <Text style={styles.playerBadgeText}>Player 2</Text>
                    </LinearGradient>
                    <Text style={styles.playerSymbol}>⭕</Text>
                  </View>
                  
                  <View style={styles.inputContainer}>
                    <LinearGradient
                      colors={['rgba(0, 74, 173, 0.1)', 'rgba(0, 86, 214, 0.1)']}
                      style={styles.inputGradient}
                    >
                      <MaterialIcons name="person" size={20} color="#004aad" style={styles.inputIcon} />
                      <TextInput 
                        style={[styles.textInput, { borderColor: '#004aad' }]} 
                        value={player2} 
                        onChangeText={setPlayer2}
                        placeholder='Enter Player 2 name'
                        placeholderTextColor='rgba(0, 74, 173, 0.5)'
                        maxLength={15}
                      />
                    </LinearGradient>
                  </View>
                </View>
              </View>

              {/* Game Features */}
              <View style={styles.featuresContainer}>
                <LinearGradient
                  colors={['rgba(0, 74, 173, 0.1)', 'rgba(203, 108, 230, 0.1)']}
                  style={styles.features}
                >
                  <Text style={styles.featuresTitle}>🎮 Game Features</Text>
                  <View style={styles.featuresList}>
                    <View style={styles.featureItem}>
                      <Text style={styles.featureIcon}>⚡</Text>
                      <Text style={styles.featureText}>Lightning fast gameplay</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Text style={styles.featureIcon}>🏆</Text>
                      <Text style={styles.featureText}>Score tracking & winner celebration</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Text style={styles.featureIcon}>🎯</Text>
                      <Text style={styles.featureText}>Smart AI detection</Text>
                    </View>
                  </View>
                </LinearGradient>
              </View>

              {/* Start Game Button */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={validateAndStart}
                  style={styles.startButtonWrapper}
                  activeOpacity={0.8}
                >
                  <Animated.View style={buttonAnimatedStyle}>
                    <LinearGradient
                      colors={
                        (player1.trim() && player2.trim()) 
                          ? ["#004aad", "#cb6ce6"] 
                          : ['#666', '#444']
                      }
                      start={{ x: 0.8, y: 0.6 }}
                      end={{ x: 0, y: 0.6 }}
                      style={styles.startButton}
                    >
                      <MaterialIcons name="play-arrow" size={28} color="white" />
                      <Text style={styles.startButtonText}>START GAME</Text>
                      <MaterialIcons name="sports-esports" size={24} color="white" />
                    </LinearGradient>
                  </Animated.View>
                </TouchableOpacity>
              </View>

              {/* Quick Start Options */}
              <View style={styles.quickStartContainer}>
                <Text style={styles.quickStartTitle}>⚡ Quick Start</Text>
                <View style={styles.quickStartButtons}>
                  <TouchableOpacity
                    style={styles.quickStartButton}
                    onPress={() => {
                      setPlayer1("Player 1");
                      setPlayer2("Player 2");
                      Vibration.vibrate(50);
                    }}
                  >
                    <LinearGradient
                      colors={['rgba(0, 74, 173, 0.2)', 'rgba(203, 108, 230, 0.2)']}
                      style={styles.quickStartGradient}
                    >
                      <MaterialIcons name="flash-on" size={20} color="#FFD700" />
                      <Text style={styles.quickStartText}>Default Names</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.quickStartButton}
                    onPress={() => {
                      setPlayer1("");
                      setPlayer2("");
                      Vibration.vibrate(50);
                    }}
                  >
                    <LinearGradient
                      colors={['rgba(255, 59, 48, 0.2)', 'rgba(255, 149, 0, 0.2)']}
                      style={styles.quickStartGradient}
                    >
                      <MaterialIcons name="clear" size={20} color="#FF6B6B" />
                      <Text style={styles.quickStartText}>Clear All</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

export default TicTac;

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
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: '#004aad',
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  placeholder: {
    width: 45,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
    position: 'relative',
  },
  imageGlow: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 74, 173, 0.3)',
    shadowColor: '#004aad',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 10,
  },
  gameImage: {
    width: 300,
    height: 300,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#004aad',
  },
  titleSection: {
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 25,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginRight: 15,
  },
  gameIcon: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  gameIconGradient: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 74, 173, 0.3)',
  },
  subtitle: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    letterSpacing: 0.5,
  },
  validationContainer: {
    marginHorizontal: 20,
    marginBottom: 15,
  },
  validation: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
  },
  validationText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '600',
  },
  playersSection: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  playerContainer: {
    marginBottom: 20,
  },
  playerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  playerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    gap: 6,
  },
  playerBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  playerSymbol: {
    fontSize: 24,
  },
  inputContainer: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  inputGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 15,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    padding: 15,
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  vsContainer: {
    alignItems: 'center',
    marginVertical: 15,
    position: 'relative',
  },
  vsCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: 1,
  },
  vsText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  vsLine: {
    position: 'absolute',
    width: '80%',
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: '50%',
    zIndex: 0,
  },
  featuresContainer: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  features: {
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(0, 74, 173, 0.2)',
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  featuresList: {
    gap: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureIcon: {
    fontSize: 18,
    width: 25,
  },
  featureText: {
    color: '#ccc',
    fontSize: 14,
    flex: 1,
  },
  buttonContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  startButtonWrapper: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#004aad',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 30,
    gap: 12,
  },
  startButtonText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  quickStartContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  quickStartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
  },
  quickStartButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  quickStartButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  quickStartGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  quickStartText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});