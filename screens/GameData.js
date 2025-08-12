import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Animated, Modal } from 'react-native'
import React, { useEffect, useState, useCallback, useRef } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import GradientText from '../components/GradientText'
import { useFocusEffect } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import RecentPlayed from './components/RecentPlayed'

const { width, height } = Dimensions.get('window')

const GameData = ({ navigation }) => {
  // State Management
  const [recentGame, setRecentGame] = useState()
  const [userStats, setUserStats] = useState({
    totalCoins: 0,
    gamesPlayed: 0,
    totalWins: 0,
    winStreak: 0,
    userLevel: 1,
    userXP: 0,
    highScore: 0,
    achievementsUnlocked: 0
  })
  const [showDeveloperModal, setShowDeveloperModal] = useState(false)
  const [gameHistory, setGameHistory] = useState([])
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(-50)).current
  const pulseAnim = useRef(new Animated.Value(1)).current

  useFocusEffect(
    useCallback(() => {
      const updateData = async () => {
        // Load recent game
        const recentGameData = await AsyncStorage.getItem("RecentGame")
        setRecentGame(recentGameData)
        
        // Load user stats
        const stats = {
          totalCoins: parseInt(await AsyncStorage.getItem("userCoins") || "0"),
          gamesPlayed: parseInt(await AsyncStorage.getItem("gamesPlayed") || "0"),
          totalWins: parseInt(await AsyncStorage.getItem("totalWins") || "0"),
          winStreak: parseInt(await AsyncStorage.getItem("winStreak") || "0"),
          userLevel: parseInt(await AsyncStorage.getItem("userLevel") || "1"),
          userXP: parseInt(await AsyncStorage.getItem("userXP") || "0"),
          highScore: parseInt(await AsyncStorage.getItem("highScore") || "0"),
          achievementsUnlocked: parseInt(await AsyncStorage.getItem("achievementsUnlocked") || "0")
        }
        setUserStats(stats)
        
        // Generate sample game history for chart
        const history = generateGameHistory(stats.gamesPlayed)
        setGameHistory(history)
      }
      
      updateData()
      startAnimations()
      
      return () => {}
    }, [])
  )

  const generateGameHistory = (totalGames) => {
    const history = []
    const days = Math.min(7, totalGames)
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      history.push({
        day: date.toLocaleDateString('en', { weekday: 'short' }),
        games: Math.floor(Math.random() * 8) + 1,
        wins: Math.floor(Math.random() * 5) + 1
      })
    }
    return history
  }

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start()
    
    // Pulse animation for info icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start()
  }

  const calculateWinRate = () => {
    return userStats.gamesPlayed > 0 
      ? Math.round((userStats.totalWins / userStats.gamesPlayed) * 100) 
      : 0
  }

  const getNextLevelXP = () => {
    return userStats.userLevel * 100
  }

  const getLevelProgress = () => {
    const nextLevelXP = getNextLevelXP()
    const prevLevelXP = (userStats.userLevel - 1) * 100
    const currentProgress = userStats.userXP - prevLevelXP
    const levelRange = nextLevelXP - prevLevelXP
    return Math.max(0, Math.min(100, (currentProgress / levelRange) * 100))
  }

  // Custom Chart Components
  const CustomLineChart = ({ data }) => {
    const maxValue = Math.max(...data.map(d => d.games))
    
    return (
      <View style={styles.lineChartContainer}>
        <View style={styles.chartArea}>
          {data.map((item, index) => (
            <View key={index} style={styles.barColumn}>
              <View style={styles.barContainer}>
                <Animated.View
                  style={[
                    styles.bar,
                    {
                      height: `${(item.games / maxValue) * 100}%`,
                      backgroundColor: '#cb6ce6'
                    }
                  ]}
                />
              </View>
              <Text style={styles.barLabel}>{item.day}</Text>
            </View>
          ))}
        </View>
      </View>
    )
  }

  const CustomPieChart = ({ wins, losses }) => {
    const total = wins + losses
    const winPercentage = total > 0 ? (wins / total) * 100 : 0
    const lossPercentage = total > 0 ? (losses / total) * 100 : 0
    
    return (
      <View style={styles.pieChartContainer}>
        <View style={styles.pieStats}>
          <View style={styles.pieStatItem}>
            <View style={[styles.pieColorBox, { backgroundColor: '#cb6ce6' }]} />
            <Text style={styles.pieStatText}>Wins: {wins} ({winPercentage.toFixed(0)}%)</Text>
          </View>
          <View style={styles.pieStatItem}>
            <View style={[styles.pieColorBox, { backgroundColor: '#004aad' }]} />
            <Text style={styles.pieStatText}>Losses: {losses} ({lossPercentage.toFixed(0)}%)</Text>
          </View>
        </View>
        <View style={styles.pieVisual}>
          <LinearGradient
            colors={winPercentage > lossPercentage ? ['#cb6ce6', '#8b5cf6'] : ['#004aad', '#0066cc']}
            style={styles.pieCircle}
          >
            <Text style={styles.piePercentageText}>
              {Math.max(winPercentage, lossPercentage).toFixed(0)}%
            </Text>
            <Text style={styles.pieLabel}>
              {winPercentage > lossPercentage ? 'Win Rate' : 'Loss Rate'}
            </Text>
          </LinearGradient>
        </View>
      </View>
    )
  }

  const StatCard = ({ title, value, icon, gradient, subtitle }) => (
    <LinearGradient colors={gradient} style={styles.statCard}>
      <MaterialCommunityIcons name={icon} size={30} color="#fff" />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </LinearGradient>
  )

  const DeveloperModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showDeveloperModal}
      onRequestClose={() => setShowDeveloperModal(false)}
    >
      <View style={styles.modalOverlay}>
        <LinearGradient colors={['#1a0033', '#004aad', '#cb6ce6']} style={styles.modalContent}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setShowDeveloperModal(false)}
          >
            <MaterialCommunityIcons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          
          <MaterialCommunityIcons name="account-circle" size={80} color="#FFD700" />
          
          <Text style={styles.developerTitle}>FAGU GAMES</Text>
          <Text style={styles.developerSubtitle}>Level Up you Fun</Text>
          
          <View style={styles.developerInfo}>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="code-tags" size={20} color="#cb6ce6" />
              <Text style={styles.infoText}>Developed by criptiton</Text>
            </View>
            
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="palette" size={20} color="#cb6ce6" />
              <Text style={styles.infoText}>Made for love</Text>
            </View>
            
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="gamepad-variant" size={20} color="#cb6ce6" />
              <Text style={styles.infoText}>Multiple Game Modes</Text>
            </View>
            
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="chart-line" size={20} color="#cb6ce6" />
              <Text style={styles.infoText}>Advanced Analytics</Text>
            </View>
          </View>
          
          <Text style={styles.versionText}>Version 1.0.0</Text>
          <Text style={styles.copyrightText}>© 2024 FAGU Games. All rights reserved.</Text>
        </LinearGradient>
      </View>
    </Modal>
  )

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#000000', '#1a0033', '#000000']} style={styles.container}>
        {/* Header with Info Icon */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          
          <GradientText colors={["#004aad", "#cb6ce6"]} style={styles.headerTitle}>
            GAME ANALYTICS
          </GradientText>
          
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity 
              onPress={() => setShowDeveloperModal(true)} 
              style={styles.infoButton}
            >
              <MaterialCommunityIcons name="information" size={24} color="#FFD700" />
            </TouchableOpacity>
          </Animated.View>
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Player Level Section */}
          <Animated.View 
            style={[
              styles.levelSection, 
              { 
                opacity: fadeAnim, 
                transform: [{ translateY: slideAnim }] 
              }
            ]}
          >
            <LinearGradient colors={['#004aad', '#cb6ce6']} style={styles.levelCard}>
              <View style={styles.levelHeader}>
                <MaterialCommunityIcons name="trophy" size={40} color="#FFD700" />
                <View style={styles.levelInfo}>
                  <Text style={styles.levelTitle}>LEVEL {userStats.userLevel}</Text>
                  <Text style={styles.levelSubtitle}>Gaming Warrior</Text>
                </View>
              </View>
              
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <LinearGradient 
                    colors={['#FFD700', '#FFA500']} 
                    style={[styles.progressFill, { width: `${getLevelProgress()}%` }]} 
                  />
                </View>
                <Text style={styles.progressText}>
                  {userStats.userXP} / {getNextLevelXP()} XP
                </Text>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Stats Grid */}
          <Animated.View 
            style={[
              styles.statsGrid, 
              { opacity: fadeAnim }
            ]}
          >
            <StatCard 
              title="Total Coins"
              value={userStats.totalCoins}
              icon="cash-multiple"
              gradient={['#FFD700', '#FFA500']}
            />
            
            <StatCard 
              title="Games Played"
              value={userStats.gamesPlayed}
              icon="gamepad-variant"
              gradient={['#004aad', '#0066cc']}
            />
            
            <StatCard 
              title="Win Rate"
              value={`${calculateWinRate()}%`}
              icon="chart-line"
              gradient={['#cb6ce6', '#8b5cf6']}
            />
            
            <StatCard 
              title="Win Streak"
              value={userStats.winStreak}
              icon="fire"
              gradient={['#ff6b6b', '#ff8e53']}
            />
          </Animated.View>

          {/* Charts Section */}
          <Animated.View style={[styles.chartsSection, { opacity: fadeAnim }]}>
            <Text style={styles.sectionTitle}>📊 PERFORMANCE ANALYTICS</Text>
            
            {/* Games Per Day Chart */}
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Games Played This Week</Text>
              <CustomLineChart data={gameHistory} />
            </View>

            {/* Win/Loss Chart */}
            {userStats.gamesPlayed > 0 && (
              <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>Performance Overview</Text>
                <CustomPieChart 
                  wins={userStats.totalWins} 
                  losses={userStats.gamesPlayed - userStats.totalWins} 
                />
              </View>
            )}
          </Animated.View>

          {/* Recent Game Section */}
          <Animated.View style={[styles.recentSection, { opacity: fadeAnim }]}>
            <Text style={styles.sectionTitle}>🎮 RECENT ACTIVITY</Text>
            <RecentPlayed navigation={navigation} game={recentGame} />
          </Animated.View>

          {/* Achievements Section */}
          <Animated.View style={[styles.achievementsSection, { opacity: fadeAnim }]}>
            <Text style={styles.sectionTitle}>🏆 ACHIEVEMENTS</Text>
            <View style={styles.achievementGrid}>
              <TouchableOpacity style={styles.achievementCard}>
                <MaterialCommunityIcons 
                  name="medal" 
                  size={40} 
                  color={userStats.gamesPlayed >= 10 ? "#FFD700" : "#666"} 
                />
                <Text style={styles.achievementText}>Novice Player</Text>
                <Text style={styles.achievementDesc}>Play 10 games</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.achievementCard}>
                <MaterialCommunityIcons 
                  name="trophy" 
                  size={40} 
                  color={userStats.totalWins >= 5 ? "#FFD700" : "#666"} 
                />
                <Text style={styles.achievementText}>Winner</Text>
                <Text style={styles.achievementDesc}>Win 5 games</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.achievementCard}>
                <MaterialCommunityIcons 
                  name="fire" 
                  size={40} 
                  color={userStats.winStreak >= 3 ? "#FFD700" : "#666"} 
                />
                <Text style={styles.achievementText}>Hot Streak</Text>
                <Text style={styles.achievementDesc}>Win 3 in a row</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.achievementCard}>
                <MaterialCommunityIcons 
                  name="cash-multiple" 
                  size={40} 
                  color={userStats.totalCoins >= 100 ? "#FFD700" : "#666"} 
                />
                <Text style={styles.achievementText}>Coin Master</Text>
                <Text style={styles.achievementDesc}>Earn 100 coins</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>

        <DeveloperModal />
      </LinearGradient>
    </View>
  )
}

export default GameData

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 10,
    borderRadius: 25,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  infoButton: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    padding: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  levelSection: {
    marginBottom: 30,
  },
  levelCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  levelInfo: {
    marginLeft: 15,
    flex: 1,
  },
  levelTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  levelSubtitle: {
    color: '#FFD700',
    fontSize: 16,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 8,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    width: (width - 60) / 2,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statValue: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10,
  },
  statTitle: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  },
  statSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 2,
  },
  chartsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  chartContainer: {
    marginBottom: 30,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  chartTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  chart: {
    borderRadius: 10,
  },
  // Custom Chart Styles
  lineChartContainer: {
    height: 160,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 10,
    padding: 15,
  },
  chartArea: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
    paddingBottom: 20,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    height: 80,
    width: 20,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
    borderRadius: 10,
    minHeight: 4,
  },
  barLabel: {
    color: '#fff',
    fontSize: 12,
    marginTop: 8,
    fontWeight: 'bold',
  },
  pieChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 160,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 10,
    padding: 15,
  },
  pieStats: {
    flex: 1,
  },
  pieStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  pieColorBox: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  pieStatText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  pieVisual: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  piePercentageText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  pieLabel: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
  },
  recentSection: {
    marginBottom: 30,
  },
  achievementsSection: {
    marginBottom: 30,
  },
  achievementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementCard: {
    width: (width - 60) / 2,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  achievementText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  achievementDesc: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width - 40,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 20,
  },
  developerTitle: {
    color: '#FFD700',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 15,
  },
  developerSubtitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 30,
    fontStyle: 'italic',
  },
  developerInfo: {
    width: '100%',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  infoText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 15,
  },
  versionText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginTop: 20,
  },
  copyrightText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    marginTop: 10,
    textAlign: 'center',
  },
});