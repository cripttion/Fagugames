import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, SafeAreaView, StatusBar, Linking, Dimensions } from 'react-native'
import React, { useState } from 'react'
import GradientText from '../components/GradientText'

const { width, height } = Dimensions.get('window')

const Coins = ({ navigation }) => {
  const [userCoins, setUserCoins] = useState(1250) // Example user coins
  const [showPurchaseSuccess, setShowPurchaseSuccess] = useState(false)
  const [purchasedProduct, setPurchasedProduct] = useState(null)
  
  const products = [
    {
      id: 1,
      name: 'Gaming Bottle',
      price: 500,
      image: '🎮',
      description: 'Level up your hydration',
      rarity: 'Epic'
    },
    {
      id: 2,
      name: 'Pro Gamer Tee',
      price: 800,
      image: '🎯',
      description: 'Legendary gaming shirt',
      rarity: 'Legendary'
    },
    {
      id: 3,
      name: 'Loot Bag',
      price: 300,
      image: '🎒',
      description: 'Carry your gaming gear',
      rarity: 'Rare'
    },
    {
      id: 4,
      name: 'Shield Case',
      price: 400,
      image: '🛡️',
      description: 'Ultimate phone protection',
      rarity: 'Epic'
    }
  ]

  const getRarityColor = (rarity) => {
    switch(rarity) {
      case 'Legendary': return '#FFD700'
      case 'Epic': return '#9D4EDD'
      case 'Rare': return '#06FFA5'
      default: return '#fff'
    }
  }

  const handlePurchase = (product) => {
    if (userCoins >= product.price) {
      Alert.alert(
        '🎮 PURCHASE QUEST 🎮',
        `Ready to unlock ${product.name}?\n\n🎯 Mission Steps:\n1. Spend ${product.price} coins\n2. Complete purchase\n3. Share victory on Instagram\n4. Tag @_cripttion in story\n5. Submit screenshot\n6. Claim your reward!\n\nAccept Quest?`,
        [
          { text: 'Cancel Quest', style: 'cancel' },
          { 
            text: 'ACCEPT QUEST', 
            onPress: () => {
              setUserCoins(userCoins - product.price)
              setPurchasedProduct(product)
              setShowPurchaseSuccess(true)
            }
          }
        ]
      )
    } else {
      Alert.alert('❌ INSUFFICIENT COINS', `You need ${product.price - userCoins} more coins to unlock this item!\n\nKeep playing to earn more coins! 🎮`)
    }
  }

  const handleInstagramRedirect = () => {
    const instagramUrl = 'https://instagram.com'
    Linking.canOpenURL(instagramUrl).then(supported => {
      if (supported) {
        Linking.openURL(instagramUrl)
      } else {
        Alert.alert('Instagram not found', 'Please install Instagram to complete the quest!')
      }
    })
    setShowPurchaseSuccess(false)
  }

  const handleBackButton = () => {
    if (navigation) {
      navigation.goBack()
    }
  }

  if (showPurchaseSuccess && purchasedProduct) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <View style={styles.successContainer}>
          <View style={styles.successCard}>
            <Text style={styles.successEmoji}>🎉</Text>
            <GradientText colors={["#00ff88", "#00d4ff"]} style={styles.successTitle}>
              ITEM UNLOCKED!
            </GradientText>
            
            <View style={styles.itemShowcase}>
              <Text style={styles.itemEmoji}>{purchasedProduct.image}</Text>
              <Text style={styles.itemName}>{purchasedProduct.name}</Text>
              <View style={[styles.rarityBadge, { backgroundColor: getRarityColor(purchasedProduct.rarity) }]}>
                <Text style={styles.rarityText}>{purchasedProduct.rarity.toUpperCase()}</Text>
              </View>
            </View>

            <View style={styles.questContainer}>
              <Text style={styles.questTitle}>🎯 COMPLETE YOUR QUEST:</Text>
              <Text style={styles.questStep}>1. Share this victory on Instagram Story</Text>
              <Text style={styles.questStep}>2. Tag @_cripttion</Text>
              <Text style={styles.questStep}>3. Screenshot and submit</Text>
            </View>

            <TouchableOpacity style={styles.instagramButton} onPress={handleInstagramRedirect}>
              <Text style={styles.instagramButtonText}>📸 SHARE ON INSTAGRAM</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backToStoreButton} onPress={() => setShowPurchaseSuccess(false)}>
              <Text style={styles.backToStoreText}>← Back to Store</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Header with Back Button */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.coinsDisplay}>
          <Text style={styles.coinsText}>💰 {userCoins}</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
        {/* Title */}
        <View style={styles.header}>
          <GradientText colors={["#ff006e", "#8338ec", "#3a86ff"]} style={styles.headerText}>
            🎮 GAMING STORE 🎮
          </GradientText>
          <Text style={styles.subtitle}>Level up your gear!</Text>
        </View>

        {/* Quest Steps */}
        <View style={styles.questInfoContainer}>
          <View style={styles.questHeader}>
            <Text style={styles.questInfoTitle}>🎯 PURCHASE QUEST</Text>
          </View>
          <View style={styles.stepsGrid}>
            <View style={styles.stepItem}>
              <Text style={styles.stepNumber}>1</Text>
              <Text style={styles.stepDescription}>Select Item</Text>
            </View>
            <View style={styles.stepItem}>
              <Text style={styles.stepNumber}>2</Text>
              <Text style={styles.stepDescription}>Spend Coins</Text>
            </View>
            <View style={styles.stepItem}>
              <Text style={styles.stepNumber}>3</Text>
              <Text style={styles.stepDescription}>Share Story</Text>
            </View>
            <View style={styles.stepItem}>
              <Text style={styles.stepNumber}>4</Text>
              <Text style={styles.stepDescription}>Tag @_cripttion</Text>
            </View>
          </View>
        </View>

        {/* Products Grid */}
        <View style={styles.productsContainer}>
          {products.map((product) => (
            <View key={product.id} style={styles.productCard}>
              <View style={[styles.rarityBorder, { borderColor: getRarityColor(product.rarity) }]}>
                <Text style={styles.productEmoji}>{product.image}</Text>
                <Text style={styles.productName}>{product.name}</Text>
                <View style={[styles.rarityTag, { backgroundColor: getRarityColor(product.rarity) }]}>
                  <Text style={styles.rarityTagText}>{product.rarity}</Text>
                </View>
                <Text style={styles.productDescription}>{product.description}</Text>
                
                <View style={styles.priceContainer}>
                  <Text style={styles.priceText}>💰 {product.price}</Text>
                </View>
                
                <TouchableOpacity 
                  style={[
                    styles.buyButton, 
                    userCoins < product.price && styles.buyButtonDisabled
                  ]}
                  onPress={() => handlePurchase(product)}
                >
                  <Text style={[
                    styles.buyButtonText,
                    userCoins < product.price && styles.buyButtonTextDisabled
                  ]}>
                    {userCoins >= product.price ? '🎮 UNLOCK' : '❌ LOCKED'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <GradientText colors={["#ff006e", "#8338ec"]} style={styles.footerText}>
            🚀 More epic items incoming! 🚀
          </GradientText>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Coins

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#111',
    borderBottomWidth: 2,
    borderBottomColor: '#333',
  },
  backButton: {
    backgroundColor: '#222',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#444',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  coinsDisplay: {
    backgroundColor: '#ff006e',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 25,
    shadowColor: '#ff006e',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  coinsText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    marginVertical: 30,
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    color: '#aaa',
    fontSize: 16,
    fontStyle: 'italic',
  },
  questInfoContainer: {
    backgroundColor: '#1a1a2e',
    margin: 15,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#16213e',
    overflow: 'hidden',
  },
  questHeader: {
    backgroundColor: '#16213e',
    padding: 15,
    alignItems: 'center',
  },
  questInfoTitle: {
    color: '#00ff88',
    fontSize: 18,
    fontWeight: 'bold',
  },
  stepsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
  },
  stepItem: {
    width: '50%',
    alignItems: 'center',
    marginBottom: 15,
  },
  stepNumber: {
    backgroundColor: '#ff006e',
    color: '#fff',
    width: 30,
    height: 30,
    borderRadius: 15,
    textAlign: 'center',
    lineHeight: 30,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  stepDescription: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  productsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    marginTop: 20,
  },
  productCard: {
    width: '45%',
    marginBottom: 20,
  },
  rarityBorder: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  productEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  productName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  rarityTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginBottom: 8,
  },
  rarityTagText: {
    color: '#000',
    fontSize: 10,
    fontWeight: 'bold',
  },
  productDescription: {
    color: '#aaa',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  priceContainer: {
    backgroundColor: '#8338ec',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: '#8338ec',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 3,
  },
  priceText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  buyButton: {
    backgroundColor: '#00ff88',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    width: '100%',
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  buyButtonDisabled: {
    backgroundColor: '#444',
    shadowOpacity: 0,
  },
  buyButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buyButtonTextDisabled: {
    color: '#888',
  },
  footer: {
    alignItems: 'center',
    marginTop: 30,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  // Success Screen Styles
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    padding: 20,
  },
  successCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00ff88',
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
    width: '100%',
    maxWidth: 350,
  },
  successEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  itemShowcase: {
    alignItems: 'center',
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#16213e',
    borderRadius: 15,
    width: '100%',
  },
  itemEmoji: {
    fontSize: 50,
    marginBottom: 10,
  },
  itemName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  rarityBadge: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  rarityText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  questContainer: {
    backgroundColor: '#0e1628',
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
    width: '100%',
  },
  questTitle: {
    color: '#00ff88',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  questStep: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
    paddingLeft: 10,
  },
  instagramButton: {
    backgroundColor: '#E1306C',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
    shadowColor: '#E1306C',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  instagramButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backToStoreButton: {
    backgroundColor: '#333',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  backToStoreText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
})