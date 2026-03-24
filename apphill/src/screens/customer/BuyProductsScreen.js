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

export default function BuyProductsScreen() {
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [products, setProducts] = useState(farmerProducts);
  const [currentIP, setCurrentIP] = useState(null);
  const [connectedIP, setConnectedIP] = useState(null);

  const LOCAL_IP = '192.168.1.100';
  const LOCAL_API = `http://${LOCAL_IP}:3000`;

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      console.log('📡 Network State:', state);
      if (state.isConnected && state.details) {
        const ip = state.details.ipAddress || null;
        console.log('🌐 Detected IP:', ip);
        setCurrentIP(ip);
        setConnectedIP(ip);
      } else {
        setCurrentIP(null);
        console.log('❌ No network connection');
      }
    });

    // Fetch network info immediately
    NetInfo.fetch().then((state) => {
      console.log('Initial Network State:', state);
      if (state.isConnected && state.details) {
        const ip = state.details.ipAddress || null;
        setCurrentIP(ip);
        setConnectedIP(ip);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    fetchProductData();
  }, [isOfflineMode, currentIP]);

  const fetchProductData = async () => {
    console.log(`📍 Fetching: Offline=${isOfflineMode}, IP=${currentIP}`);

    if (isOfflineMode) {
      console.log('✅ Using offline mock data');
      setProducts(farmerProducts);
      return;
    }

    // Check if connected to local IP
    const isLocalIP = currentIP === LOCAL_IP;
    console.log(`🔗 Is Local IP? ${isLocalIP} (current: ${currentIP}, target: ${LOCAL_IP})`);

    if (isLocalIP) {
      console.log(`📥 Fetching from local endpoint: ${LOCAL_API}`);
      try {
        const response = await fetch(`${LOCAL_API}/products`);
        if (response.ok) {
          const data = await response.json();
          console.log('✨ Fetched from local:', data?.length || 0, 'items');
          if (Array.isArray(data)) {
            setProducts(data);
            return;
          }
        }
      } catch (error) {
        console.warn('⚠️ Local fetch failed:', error.message);
      }
    }

    // Fallback to mock data
    console.log('↩️ Falling back to mock data');
    setProducts(farmerProducts);
  };

  const getModeLabel = () => {
    if (isOfflineMode) return '🔴 OFFLINE';
    if (currentIP === LOCAL_IP) return '🟢 LOCAL IP';
    if (currentIP) return `🟡 REMOTE (${currentIP})`;
    return '⚫ NO NETWORK';
  };

  const getModeColor = () => {
    if (isOfflineMode) return '#DC2626';
    if (currentIP === LOCAL_IP) return '#16A34A';
    if (currentIP) return '#F59E0B';
    return '#6B7280';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Enhanced Header with Toggle */}
        <View style={[styles.headerBox, { borderLeftColor: getModeColor(), borderLeftWidth: 4 }]}>
          <View style={styles.headerContent}>
            <View style={styles.modeSection}>
              <Text style={[styles.modeLabel, { color: getModeColor() }]}>
                {getModeLabel()}
              </Text>
              <Text style={styles.modeDetails}>
                {isOfflineMode ? 'Using cached data' : currentIP ? `Connected: ${currentIP}` : 'Detecting...'}
              </Text>
            </View>

            <View style={styles.toggleSection}>
              <Text style={styles.toggleText}>Offline</Text>
              <Switch
                value={isOfflineMode}
                onValueChange={(newValue) => {
                  console.log('🎛️ Toggle switched:', newValue);
                  setIsOfflineMode(newValue);
                }}
                thumbColor={isOfflineMode ? colors.primary : '#CCC'}
                trackColor={{ false: '#E5E7EB', true: colors.primaryLight }}
              />
            </View>
          </View>
        </View>

        <Text style={[typography.h2, styles.title]}>
          Buy Products
        </Text>

        {products.map(item => (
          <View key={item.id} style={styles.card}>

            {/* Image */}
            <Image source={{ uri: item.image }} style={styles.image} />

            {/* Name */}
            <Text style={styles.name}>{item.productName}</Text>

            {/* Details */}
            <Text style={styles.text}>Farmer: {item.farmerName}</Text>
            <Text style={styles.text}>Category: {item.category}</Text>
            <Text style={styles.text}>Quantity: {item.quantity}</Text>
            <Text style={styles.text}>Price: ₹{item.price}</Text>
            <Text style={styles.text}>Location: {item.location}</Text>

            {/* ✅ BUY BUTTON */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                Alert.alert(
                  'Order Placed ✅',
                  `Farmer ${item.farmerName} has been notified!`
                );
              }}
            >
              <Text style={styles.buttonText}>Buy Now</Text>
            </TouchableOpacity>

          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  content: {
    flexGrow: 1,
    minHeight: '100%',
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },

  headerBox: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },

  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  modeSection: {
    flex: 1,
    marginRight: spacing.md,
  },

  modeLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },

  modeDetails: {
    fontSize: 12,
    color: colors.textSecondary,
  },

  toggleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: spacing.md,
    borderLeftWidth: 1,
    borderLeftColor: colors.borderLight,
  },

  toggleText: {
    marginRight: spacing.sm,
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
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