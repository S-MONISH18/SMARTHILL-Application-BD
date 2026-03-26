import React, { useCallback, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native'; // 🔥 NEW

import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import AppCard from '../../components/AppCard';
import { useAuth } from '../../context/AuthContext';

// 🔥 API
import {
  getFarmerOrders,
  updateOrderStatus,
} from '../../services/apiService';

export default function FarmerOrderRequestsScreen() {
  const { currentUser } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  //////////////////////////////////////////////////////
  // FETCH ORDERS
  //////////////////////////////////////////////////////
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);

      const farmerKey = currentUser?.phone || currentUser?.name;
      const result = await getFarmerOrders(farmerKey);

      if (result.success) {
        setOrders(result.data || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  //////////////////////////////////////////////////////
  // 🔄 AUTO REFRESH (BEST METHOD)
  //////////////////////////////////////////////////////
  useFocusEffect(
    React.useCallback(() => {
      fetchOrders();

      const interval = setInterval(() => {
        fetchOrders();
      }, 5000); // every 5 sec

      return () => clearInterval(interval);
    }, [fetchOrders])
  );

  //////////////////////////////////////////////////////
  // STATUS COLOR
  //////////////////////////////////////////////////////
  const getStatusColor = (status) => {
    if (status === 'Approved') return 'green';
    if (status === 'Rejected') return 'red';
    return 'orange';
  };

  //////////////////////////////////////////////////////
  // UPDATE STATUS
  //////////////////////////////////////////////////////
  const handleAction = async (orderId, status) => {
    const result = await updateOrderStatus(orderId, status);

    if (result.success) {
      Alert.alert('✅ Updated', `Order ${status}`);
      fetchOrders(); // refresh immediately
    } else {
      Alert.alert('❌ Failed');
    }
  };

  //////////////////////////////////////////////////////
  // ITEM UI
  //////////////////////////////////////////////////////
  const renderItem = ({ item }) => (
    <AppCard style={styles.card}>
      <Text style={[typography.h4, styles.title]}>
        {item.productName}
      </Text>

      {item.buyerName ? (
        <Text style={styles.text}>👤 Buyer Name: {item.buyerName}</Text>
      ) : null}

      <Text style={styles.text}>
        👤 Buyer Phone: {item.buyerPhone}
      </Text>

      <Text style={styles.text}>
        📦 Quantity: {item.quantity}
      </Text>

      <Text style={styles.text}>
        💰 Price: ₹{item.price}
      </Text>

      <Text style={[styles.status, { color: getStatusColor(item.status) }]}> 
        {item.status || 'Pending'}
      </Text>

      {/* ACTION BUTTONS */}
      {item.status === 'Pending' && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.acceptBtn}
            onPress={() => handleAction(item.orderId, 'Approved')}
          >
            <Text style={styles.btnText}>Accept</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.rejectBtn}
            onPress={() => handleAction(item.orderId, 'Rejected')}
          >
            <Text style={styles.rejectText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
    </AppCard>
  );

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={[typography.h2, styles.header]}>
          Product Orders
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : orders.length === 0 ? (
          <Text style={styles.empty}>
            No orders found
          </Text>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.orderId}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

//////////////////////////////////////////////////////
// STYLES
//////////////////////////////////////////////////////
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  content: {
    flex: 1,
    padding: spacing.lg,
  },

  header: {
    color: colors.primary,
    marginBottom: spacing.lg,
  },

  card: {
    marginBottom: spacing.lg,
  },

  title: {
    marginBottom: spacing.sm,
  },

  text: {
    color: colors.text,
    marginBottom: spacing.xs,
  },

  status: {
    marginTop: spacing.sm,
    fontWeight: 'bold',
  },

  actions: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },

  acceptBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: spacing.sm,
  },

  rejectBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: spacing.md,
    borderRadius: 10,
    alignItems: 'center',
  },

  btnText: {
    color: '#fff',
    fontWeight: '600',
  },

  rejectText: {
    color: colors.text,
    fontWeight: '600',
  },

  empty: {
    textAlign: 'center',
    marginTop: 50,
    color: colors.textSecondary,
  },
});