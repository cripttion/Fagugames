// App.js
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
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
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createNativeStackNavigator();

const App = () => {


  useEffect(() => {
    const setRecent = async () => {
      await AsyncStorage.setItem("RecentGame", "RedBlue");
      
    };
    setRecent();
  }, []);

 

  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="TruthDare" component={TruthDare} />
          <Stack.Screen name="RedBlue" component={RedBlue} />
          <Stack.Screen name="RajaMantri" component={RajaMantri} />
          <Stack.Screen name="ZeroKatis" component={TicTac} />
          <Stack.Screen name="GameData" component={GameData} />
          <Stack.Screen name="Coins" component={Coins} />
          <Stack.Screen name="RedBlueGame" component={RedBlueGame} />
          <Stack.Screen name="Winner" component={Winner} />
          <Stack.Screen name="TicTacGame" component={TicTacGame} />
          <Stack.Screen name="RajaMantriGame" component={RajaMantriGame} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
});
