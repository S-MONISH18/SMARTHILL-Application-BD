import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NetInfo from '@react-native-community/netinfo';

import { farmerProducts } from '../../data/mockData';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

// 🔥 IMPORT API + AUTH
import { buyProduct } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';

export default function BuyProductsScreen() {
  const { currentUser } = useAuth();

  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [products, setProducts] = useState(farmerProducts);
  const [currentIP, setCurrentIP] = useState(null);

  const LOCAL_IP = '192.168.1.100';
  const LOCAL_API = `http://${LOCAL_IP}:3000`;

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
  useEffect(() => {
    fetchProductData();
  }, [isOfflineMode, currentIP]);

  const fetchProductData = async () => {
    if (isOfflineMode) {
      setProducts(farmerProducts);
      return;
    }

    try {
      const res = await fetch('http://10.0.2.2:3000/products');
      const data = await res.json();

      if (data.success) {
        setProducts(data.data);
        return;
      }
    } catch (e) {
      console.log('Fallback to mock');
    }

    setProducts(farmerProducts);
  };

  //////////////////////////////////////////////////////
  // 🔥 BUY PRODUCT FUNCTION
  //////////////////////////////////////////////////////
  const handleBuy = async (item) => {
    try {
      const result = await buyProduct({
        productName: item.productName,
        farmerName: item.farmerName,
        buyerPhone: currentUser.phone,
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
          <View key={item.id} style={styles.card}>

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