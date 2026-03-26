import React, { useState, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { useAuth } from '../../context/AuthContext';
import { getOrders } from '../../services/apiService';
import AppCard from '../../components/AppCard';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function MyCustomerBookingsScreen() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    if (!currentUser?.phone) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const result = await getOrders(currentUser.phone);
      if (result.success) {
        setOrders(result.data || []);
      } else {
        console.warn('Customer orders fetch failed', result.message);
        setOrders([]);
      }
    } catch (err) {
      console.error('Customer orders fetch error', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useFocusEffect(
    React.useCallback(() => {
      fetchOrders();
      const interval = setInterval(fetchOrders, 5000);
      return () => clearInterval(interval);
    }, [fetchOrders])
  );

  const renderOrder = ({ item }) => {
    const statusColor =
      item.status === 'Approved'
        ? 'green'
        : item.status === 'Rejected'
        ? 'red'
        : 'orange';

    return (
      <AppCard style={styles.card}>
        <Text style={[typography.h4, styles.title]}>{item.productName}</Text>
        <Text style={styles.text}>Farmer: {item.farmerName}</Text>
        <Text style={styles.text}>Quantity: {item.quantity}</Text>
        <Text style={styles.text}>Price: ₹{item.price}</Text>
        <Text style={[styles.status, { color: statusColor }]}>Status: {item.status || 'Pending'}</Text>
      </AppCard>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={[typography.h2, styles.header]}>My Bookings</Text>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : orders.length === 0 ? (
          <Text style={styles.empty}>No bookings found</Text>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.orderId}
            renderItem={renderOrder}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, padding: spacing.lg },
  header: { color: colors.primary, marginBottom: spacing.lg },
  card: { marginBottom: spacing.lg },
  title: { marginBottom: spacing.sm },
  text: { color: colors.text, marginBottom: spacing.xs },
  status: { fontWeight: 'bold', marginTop: spacing.sm },
  empty: { textAlign: 'center', marginTop: 50, color: colors.textSecondary },
});