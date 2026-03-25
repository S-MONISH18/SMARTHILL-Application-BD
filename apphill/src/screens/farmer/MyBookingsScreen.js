import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import AppCard from '../../components/AppCard';
import { useAuth } from '../../context/AuthContext';

//////////////////////////////////////////////////////
// 🔥 API CALL
//////////////////////////////////////////////////////
const BASE_URL = 'http://10.0.2.2:3000';

const getBookings = async (phone) => {
  try {
    const res = await fetch(`${BASE_URL}/bookings/${phone}`);
    const data = await res.json();
    return data;
  } catch (e) {
    console.error(e);
    return { success: false };
  }
};

//////////////////////////////////////////////////////
// SCREEN
//////////////////////////////////////////////////////
export default function MyBookingsScreen() {
  const { currentUser } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  //////////////////////////////////////////////////////
  // FETCH BOOKINGS
  //////////////////////////////////////////////////////
  const fetchBookings = async () => {
    const result = await getBookings(currentUser.phone);

    if (result.success) {
      setBookings(result.data || []);
    }

    setLoading(false);
    setRefreshing(false);
  };

  //////////////////////////////////////////////////////
  // AUTO REFRESH 🔥
  //////////////////////////////////////////////////////
  useEffect(() => {
    fetchBookings();

    const interval = setInterval(() => {
      fetchBookings();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  //////////////////////////////////////////////////////
  // PULL TO REFRESH
  //////////////////////////////////////////////////////
  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  //////////////////////////////////////////////////////
  // STATUS COLOR
  //////////////////////////////////////////////////////
  const getStatusColor = (status) => {
    if (status === 'Accepted') return 'green';
    if (status === 'Rejected') return 'red';
    return 'orange';
  };

  //////////////////////////////////////////////////////
  // RENDER ITEM
  //////////////////////////////////////////////////////
  const renderItem = ({ item }) => (
    <AppCard style={styles.card}>
      <Text style={[typography.h4, styles.title]}>
        {item.tractorModel}
      </Text>

      <Text style={styles.text}>📍 {item.location || 'N/A'}</Text>

      <Text style={styles.text}>
        📅 {item.fromDate || item.date} → {item.toDate || ''}
      </Text>

      <Text style={styles.text}>
        ⏱ {item.hours} hrs
      </Text>

      <Text style={styles.text}>
        💰 ₹{item.total || '-'}
      </Text>

      <Text
        style={[
          styles.status,
          { color: getStatusColor(item.status) },
        ]}
      >
        {item.status || 'Pending'}
      </Text>
    </AppCard>
  );

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={[typography.h2, styles.header]}>
          My Bookings
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : bookings.length === 0 ? (
          <Text style={styles.empty}>No bookings found</Text>
        ) : (
          <FlatList
            data={bookings}
            keyExtractor={(item) => item.bookingId}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
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
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
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
    fontSize: 14,
  },
  empty: {
    textAlign: 'center',
    marginTop: 50,
    color: colors.textSecondary,
  },
});