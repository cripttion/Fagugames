import { 
  Image, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  Animated, 
  Dimensions,
  StatusBar,
  ImageBackground
} from "react-native";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "./../assets/image.png";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import GradientText from "../components/GradientText";
import RecentPlayed from "./components/RecentPlayed";
import td from './../assets/1.png'
import rm from './../assets/2.png'
import rb from './../assets/3.png'
import tic from './../assets/4.png'
import Earn from "./components/Earn";
import Stats from "./components/Stats";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

const Home = ({navigation}) => {
  const [recentGame, setRecentGame] = useState("RedBlue");
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const gameCardsAnim = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ]).current;

  // Particle animation values
  const particles = useRef(
    Array.from({ length: 8 }, () => ({
      x: new Animated.Value(Math.random() * width),
      y: new Animated.Value(Math.random() * height),
      opacity: new Animated.Value(0.3),
      scale: new Animated.Value(0.5)
    }))
  ).current;

  useFocusEffect(
    useCallback(() => {
      const updateRecentGame = async () => {
        const data = await AsyncStorage.getItem("RecentGame");
        setRecentGame(data);
      };
      
      updateRecentGame();
      startAnimations();
      startParticleAnimation();
      
      return () => {};
    }, [])
  );

  const startAnimations = () => {
    // Main fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Slide up animation
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Logo rotation
    Animated.loop(
      Animated.timing(logoRotate, {
        toValue: 1,
        duration: 10000,
        useNativeDriver: true,
      })
    ).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        })
      ])
    ).start();

    // Float animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        })
      ])
    ).start();

    // Staggered game cards animation
    gameCardsAnim.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 600,
        delay: index * 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const startParticleAnimation = () => {
    particles.forEach((particle, index) => {
      const animateParticle = () => {
        particle.y.setValue(-50);
        particle.x.setValue(Math.random() * width);
        
        Animated.parallel([
          Animated.timing(particle.y, {
            toValue: height + 50,
            duration: 8000 + Math.random() * 4000,
            useNativeDriver: true,
          }),
          Animated.loop(
            Animated.sequence([
              Animated.timing(particle.opacity, {
                toValue: 0.8,
                duration: 2000,
                useNativeDriver: true,
              }),
              Animated.timing(particle.opacity, {
                toValue: 0.2,
                duration: 2000,
                useNativeDriver: true,
              })
            ])
          ),
          Animated.loop(
            Animated.sequence([
              Animated.timing(particle.scale, {
                toValue: 1,
                duration: 3000,
                useNativeDriver: true,
              }),
              Animated.timing(particle.scale, {
                toValue: 0.5,
                duration: 3000,
                useNativeDriver: true,
              })
            ])
          )
        ]).start(() => {
          setTimeout(animateParticle, Math.random() * 2000);
        });
      };
      
      setTimeout(animateParticle, index * 1000);
    });
  };

  const spin = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const GameCard = ({ source, onPress, index, title }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    
    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View
        style={[
          styles.gameCardContainer,
          {
            opacity: gameCardsAnim[index],
            transform: [
              {
                translateY: gameCardsAnim[index].interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
              { scale: scaleAnim }
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.gameCard}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['rgba(0, 74, 173, 0.3)', 'rgba(203, 108, 230, 0.3)']}
            style={styles.cardGradient}
          >
            <Image source={source} style={styles.gameImage} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.cardOverlay}
            >
              <Text style={styles.gameTitle}>{title}</Text>
            </LinearGradient>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
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
        colors={['#000000', '#1a0033', '#000000']}
        style={styles.backgroundGradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            vertical
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Header Section */}
            <Animated.View
              style={[
                styles.header,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }, { translateY: floatAnim }],
                },
              ]}
            >
              <Animated.View
                style={[
                  styles.logoContainer,
                  { transform: [{ rotate: spin }, { scale: pulseAnim }] },
                ]}
              >
                <LinearGradient
                  colors={['#004aad', '#cb6ce6']}
                  style={styles.logoGradient}
                >
                  <Image source={logo} style={styles.logo} />
                </LinearGradient>
              </Animated.View>
              
              <Animated.View style={[styles.titleContainer, { opacity: fadeAnim }]}>
                <GradientText colors={["#004aad", "#cb6ce6"]} style={styles.mainTitle}>
                  FAGU
                </GradientText>
                <GradientText colors={["#cb6ce6", "#004aad"]} style={styles.subtitle}>
                  GAMES
                </GradientText>
                <Text style={styles.tagline}>Level Up Your Fun!</Text>
              </Animated.View>
            </Animated.View>

            {/* Gaming Stats Bar */}
            <Animated.View
              style={[
                styles.statsBar,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <LinearGradient
                colors={['rgba(0, 74, 173, 0.2)', 'rgba(203, 108, 230, 0.2)']}
                style={styles.statsGradient}
              >
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>⚡</Text>
                  <Text style={styles.statLabel}>POWER</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>🏆</Text>
                  <Text style={styles.statLabel}>WINS</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>🎯</Text>
                  <Text style={styles.statLabel}>STREAK</Text>
                </View>
              </LinearGradient>
            </Animated.View>

            {/* Hero Section */}
            <Animated.View
              style={[
                styles.heroSection,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <View style={styles.heroContent}>
                <RecentPlayed navigation={navigation} game={recentGame} />
                <View style={styles.sideComponents}>
                  <Stats navigation={navigation} />
                  <Earn navigation={navigation} />
                </View>
              </View>
            </Animated.View>

            {/* Games Section */}
            <Animated.View
              style={[
                styles.gamesSection,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <View style={styles.sectionHeader}>
                <GradientText colors={["#004aad", "#cb6ce6"]} style={styles.sectionTitle}>
                  🎮 BATTLE ARENA
                </GradientText>
                <Text style={styles.sectionSubtitle}>Choose Your Challenge</Text>
              </View>

              <View style={styles.gamesGrid}>
                <GameCard
                  source={td}
                  title="Truth or Dare"
                  index={0}
                  onPress={async () => {
                    await AsyncStorage.setItem("RecentGame", "TruthDare");
                    navigation.navigate('TruthDare');
                  }}
                />
                <GameCard
                  source={rm}
                  title="Raja Mantri"
                  index={1}
                  onPress={() => navigation.navigate('RajaMantri')}
                />
                <GameCard
                  source={rb}
                  title="Zero Katis"
                  index={2}
                  onPress={() => navigation.navigate('ZeroKatis')}
                />
                <GameCard
                  source={tic}
                  title="Red Blue"
                  index={3}
                  onPress={() => navigation.navigate('RedBlue')}
                />
              </View>
            </Animated.View>

            {/* Bottom Spacing */}
            <View style={styles.bottomSpacing} />
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

export default Home;

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
  scrollContent: {
    paddingBottom: 30,
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: '#004aad',
    borderRadius: 2,
    shadowColor: '#cb6ce6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 30,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoGradient: {
    padding: 8,
    borderRadius: 60,
    shadowColor: '#004aad',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  titleContainer: {
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    letterSpacing: 4,
    textShadowColor: 'rgba(0, 74, 173, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginTop: -5,
  },
  tagline: {
    color: '#888',
    fontSize: 14,
    marginTop: 5,
    fontStyle: 'italic',
  },
  statsBar: {
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 20,
    overflow: 'hidden',
  },
  statsGradient: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 74, 173, 0.3)',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    marginBottom: 5,
  },
  statLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 10,
  },
  heroSection: {
    marginHorizontal: 10,
    marginBottom: 30,
  },
  heroContent: {
    flexDirection: 'row',
    gap: 10,
  },
  sideComponents: {
    flexDirection: 'column',
    gap: 20,
    flex: 1,
  },
  gamesSection: {
    marginHorizontal: 20,
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 2,
    textShadowColor: 'rgba(203, 108, 230, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  sectionSubtitle: {
    color: '#888',
    fontSize: 16,
    marginTop: 5,
  },
  gamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gameCardContainer: {
    width: '48%',
    marginBottom: 20,
  },
  gameCard: {
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#004aad',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  cardGradient: {
    flex: 1,
    borderWidth: 2,
    borderColor: 'rgba(0, 74, 173, 0.5)',
    borderRadius: 20,
  },
  gameImage: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    justifyContent: 'flex-end',
    padding: 15,
  },
  gameTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  bottomSpacing: {
    height: 20,
  },
});