// App.js
import React, { useEffect, useState } from "react";
import { StyleSheet, View, StatusBar, AppState,Text} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import Screens
import Home from "./screens/Home";
import TruthDare from "./screens/Games/TruthDare";
import RedBlue from "./screens/Games/RedBlue";
import RajaMantri from "./screens/Games/Rajamtri";
import TicTac from "./screens/Games/TicTac";
import GameData from "./screens/GameData";
import Coins from "./screens/Conins";
import RedBlueGame from "./screens/Games/RedBlueGame";
import Winner from "./screens/Winner";
import TicTacGame from "./screens/Games/TicTacGame";
import RajaMantriGame from "./screens/Games/RajaMantriGame";

const Stack = createNativeStackNavigator();

// Custom transition animations
const slideTransition = {
  headerShown: false,
  gestureEnabled: true,
  animation: 'slide_from_right',
  animationDuration: 300,
};

const modalTransition = {
  headerShown: false,
  presentation: 'modal',
  gestureEnabled: true,
  animation: 'slide_from_bottom',
  animationDuration: 400,
};

const fullScreenTransition = {
  headerShown: false,
  presentation: 'fullScreenModal',
  gestureEnabled: false,
  animation: 'fade',
  animationDuration: 300,
};

const App = () => {
  const [isReady, setIsReady] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    initializeApp();
    
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => subscription?.remove();
  }, []);

  const initializeApp = async () => {
    try {
      // Initialize default values for new users
      const initData = [
        { key: "RecentGame", defaultValue: "RedBlue" },
        { key: "userCoins", defaultValue: "100" },
        { key: "gamesPlayed", defaultValue: "0" },
        { key: "totalWins", defaultValue: "0" },
        { key: "winStreak", defaultValue: "0" },
        { key: "userLevel", defaultValue: "1" },
        { key: "userXP", defaultValue: "0" },
        { key: "soundEnabled", defaultValue: "true" },
        { key: "vibrationEnabled", defaultValue: "true" },
        { key: "highScore", defaultValue: "0" },
        { key: "achievementsUnlocked", defaultValue: "0" },
      ];

      await Promise.all(
        initData.map(async ({ key, defaultValue }) => {
          const existingValue = await AsyncStorage.getItem(key);
          if (existingValue === null) {
            await AsyncStorage.setItem(key, defaultValue);
          }
        })
      );
      
      // Add a small delay for smooth loading experience
      await new Promise(resolve => setTimeout(resolve, 800));
      
    } catch (error) {
      console.error('Error initializing app:', error);
      // Even if initialization fails, allow app to continue
    } finally {
      setIsReady(true);
    }
  };

  const handleAppStateChange = (nextAppState) => {
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App resumed - refresh data if needed');
    }
    setAppState(nextAppState);
  };

  if (!isReady) {
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <View style={styles.loadingContainer}>
          <View style={styles.loadingContent}>
            <View style={styles.logoContainer}>
              <View style={styles.glowEffect} />
              <View style={styles.logoText}>
                <Text style={styles.letterF}>F</Text>
                <Text style={styles.letterA}>A</Text>
                <Text style={styles.letterG}>G</Text>
                <Text style={styles.letterU}>U</Text>
              </View>
            </View>
            <View style={styles.loadingDots}>
              <View style={[styles.loadingDot, styles.dot1]} />
              <View style={[styles.loadingDot, styles.dot2]} />
              <View style={[styles.loadingDot, styles.dot3]} />
            </View>
            <View style={styles.loadingTextContainer}>
              <Text style={styles.loadingSubtext}>Loading Gaming Experience...</Text>
            </View>
          </View>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="transparent" 
        translucent 
      />
      <NavigationContainer
        theme={{
          dark: true,
          colors: {
            primary: '#004aad',
            background: '#000000',
            card: '#1a0033',
            text: '#ffffff',
            border: '#333333',
            notification: '#cb6ce6',
          },
        }}
      >
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={slideTransition}
        >
          <Stack.Screen 
            name="Home" 
            component={Home}
            options={slideTransition}
          />
          <Stack.Screen 
            name="GameData" 
            component={GameData}
            options={{
              ...slideTransition,
              title: 'All Games'
            }}
          />
          <Stack.Screen 
            name="Coins" 
            component={Coins}
            options={{
              ...slideTransition,
              title: 'Rewards'
            }}
          />
          
          <Stack.Screen 
            name="TruthDare" 
            component={TruthDare}
            options={modalTransition}
          />
          <Stack.Screen 
            name="RedBlue" 
            component={RedBlue}
            options={modalTransition}
          />
          <Stack.Screen 
            name="RajaMantri" 
            component={RajaMantri}
            options={modalTransition}
          />
          <Stack.Screen 
            name="ZeroKatis" 
            component={TicTac}
            options={modalTransition}
          />
          
          {/* Active Game Screens - Full Screen */}
          <Stack.Screen 
            name="RedBlueGame" 
            component={RedBlueGame}
            options={fullScreenTransition}
          />
          <Stack.Screen 
            name="TicTacGame" 
            component={TicTacGame}
            options={fullScreenTransition}
          />
          <Stack.Screen 
            name="RajaMantriGame" 
            component={RajaMantriGame}
            options={fullScreenTransition}
          />
          
          <Stack.Screen 
            name="Winner" 
            component={Winner}
            options={{
              ...fullScreenTransition,
              gestureEnabled: false,  
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    position: 'relative',
    marginBottom: 40,
  },
  glowEffect: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(0, 74, 173, 0.1)',
    top: -50,
    left: -50,
  },
  logoText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  letterF: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#004aad',
    marginHorizontal: 2,
  },
  letterA: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#6b46c1',
    marginHorizontal: 2,
  },
  letterG: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#8b5cf6',
    marginHorizontal: 2,
  },
  letterU: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#cb6ce6',
    marginHorizontal: 2,
  },
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  dot1: {
    backgroundColor: '#004aad',
  },
  dot2: {
    backgroundColor: '#6b46c1',
  },
  dot3: {
    backgroundColor: '#cb6ce6',
  },
  loadingTextContainer: {
    alignItems: 'center',
  },
  loadingSubtext: {
    color: '#888',
    fontSize: 16,
    fontStyle: 'italic',
    letterSpacing: 1,
  },
});