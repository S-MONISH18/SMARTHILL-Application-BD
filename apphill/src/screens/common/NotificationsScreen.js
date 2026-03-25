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

// ✅ USE API SERVICE (better)
import { getNotifications } from '../../services/apiService';

export default function NotificationsScreen() {
  const { currentUser } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  //////////////////////////////////////////////////////
  // FETCH DATA
  //////////////////////////////////////////////////////
  const fetchNotifications = async () => {
    const result = await getNotifications(currentUser.phone);

    if (result.success) {
      setNotifications(result.data || []);
    }

    setLoading(false);
    setRefreshing(false);
  };

  //////////////////////////////////////////////////////
  // AUTO LOAD + AUTO REFRESH 🔥
  //////////////////////////////////////////////////////
  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 5000); // auto refresh every 5 sec

    return () => clearInterval(interval);
  }, []);

  //////////////////////////////////////////////////////
  // PULL TO REFRESH
  //////////////////////////////////////////////////////
  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  //////////////////////////////////////////////////////
  // RENDER ITEM
  //////////////////////////////////////////////////////
  const renderItem = ({ item }) => (
    <AppCard style={styles.card}>
      <Text style={styles.message}>{item.message}</Text>

      <Text style={styles.date}>
        {item.createdAt
          ? new Date(item.createdAt).toLocaleString()
          : '-'}
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
          🔔 Notifications
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : notifications.length === 0 ? (
          <Text style={styles.empty}>
            No notifications yet
          </Text>
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.notificationId}
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
    marginBottom: spacing.md,
    padding: spacing.md,
  },

  message: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '500',
  },

  date: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
    fontSize: 12,
  },

  empty: {
    textAlign: 'center',
    marginTop: 60,
    color: colors.textSecondary,
  },
});