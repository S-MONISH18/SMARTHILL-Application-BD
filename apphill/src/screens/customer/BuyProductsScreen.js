import React, { useEffect, useState, useCallback } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NetInfo from '@react-native-community/netinfo';

import { farmerProducts } from '../../data/mockData';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

// 🔥 IMPORT API + AUTH
import { buyProduct, getProducts } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';

export default function BuyProductsScreen() {
  const { currentUser } = useAuth();

  const [isOfflineMode] = useState(false);
  const [products, setProducts] = useState(farmerProducts);
  const [currentIP, setCurrentIP] = useState(null);

  //////////////////////////////////////////////////////
  // NETWORK DETECTION
  //////////////////////////////////////////////////////
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected && state.details) {
        const ip = state.details.ipAddress || null;
        setCurrentIP(ip);
      } else {
        setCurrentIP(null);
      }
    });

    NetInfo.fetch().then((state) => {
      if (state.isConnected && state.details) {
        setCurrentIP(state.details.ipAddress || null);
      }
    });

    return unsubscribe;
  }, []);

  //////////////////////////////////////////////////////
  // FETCH PRODUCTS
  //////////////////////////////////////////////////////
  const fetchProductData = useCallback(async () => {
    if (isOfflineMode) {
      setProducts(farmerProducts);
      return;
    }

    try {
      const data = await getProducts();

      if (data.success) {
        setProducts(data.data);
        return;
      }
      console.log('buy products: non-success api', data);
    } catch (e) {
      console.log('Fallback to mock', e);
    }

    setProducts(farmerProducts);
  }, [isOfflineMode]);

  useEffect(() => {
    fetchProductData();
  }, [fetchProductData, currentIP]);

  //////////////////////////////////////////////////////
  // 🔥 BUY PRODUCT FUNCTION
  //////////////////////////////////////////////////////
  const handleBuy = async (item) => {
    try {
      const result = await buyProduct({
        productName: item.productName,
        farmerName: item.farmerName,
        farmerPhone: item.farmerPhone || item.phone || null,
        buyerPhone: currentUser.phone,
        buyerName: currentUser.name || null,
        quantity: item.quantity,
        price: item.price,
      });

      if (result.success) {
        Alert.alert(
          '✅ Order Placed',
          'Farmer has been notified!'
        );
      } else {
        Alert.alert('❌ Failed', result.message || 'Try again');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        <Text style={[typography.h2, styles.title]}>
          Buy Products
        </Text>

        {products.map(item => (
          <View key={item.productId || item.id || `${item.productName}-${item.farmerPhone}` } style={styles.card}>

            <Image
              source={{ uri: item.image || 'https://via.placeholder.com/150' }}
              style={styles.image}
            />

            <Text style={styles.name}>{item.productName}</Text>

            <Text style={styles.text}>Farmer: {item.farmerName}</Text>
            <Text style={styles.text}>Category: {item.category}</Text>
            <Text style={styles.text}>Quantity: {item.quantity}</Text>
            <Text style={styles.text}>Price: ₹{item.price}</Text>
            <Text style={styles.text}>Location: {item.location}</Text>

            {/* 🔥 BUY BUTTON CONNECTED */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleBuy(item)}
            >
              <Text style={styles.buttonText}>Buy Now</Text>
            </TouchableOpacity>

          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

//////////////////////////////////////////////////////
// STYLES
//////////////////////////////////////////////////////
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },

  title: {
    color: colors.primary,
    marginBottom: spacing.lg,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },

  image: {
    width: '100%',
    height: 160,
  },

  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    padding: spacing.md,
    paddingBottom: 0,
  },

  text: {
    color: colors.textSecondary,
    paddingHorizontal: spacing.md,
    marginBottom: 4,
  },

  button: {
    margin: spacing.md,
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});