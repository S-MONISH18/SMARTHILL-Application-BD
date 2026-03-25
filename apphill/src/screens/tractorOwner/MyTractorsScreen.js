import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { getTractors } from '../../services/apiService';

import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import AppCard from '../../components/AppCard';
import Badge from '../../components/Badge';

export default function MyTractorsScreen() {
  const navigation = useNavigation();
  const { currentUser } = useAuth();
  const [tractors, setTractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTractors();
  }, []);

  const fetchTractors = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!currentUser?.phone) {
        setError('User phone not available');
        setLoading(false);
        return;
      }

      const response = await getTractors(currentUser.phone);

      if (response.success) {
        setTractors(response.data || []);
      } else {
        setError(response.message || 'Failed to load tractors');
      }
    } catch (err) {
      console.error('Fetch tractors error:', err);
      setError('Failed to load tractors');
    } finally {
      setLoading(false);
    }
  };

  const renderBadge = status => {
    if (status === 'Available') return <Badge text={status} variant="success" />;
    return <Badge text={status} variant="default" />;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[typography.body, styles.loadingText]}>
            Loading tractors...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[typography.h2, styles.title]}>My Tractors</Text>
        <Text style={[typography.body, styles.subtitle]}>
          View and manage all your registered tractors
        </Text>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={fetchTractors}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {tractors.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[typography.body, styles.emptyText]}>
              No tractors registered yet
            </Text>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => navigation.navigate('RegisterTractor')}
            >
              <Text style={styles.registerButtonText}>Register Tractor</Text>
            </TouchableOpacity>
          </View>
        ) : (
          tractors.map(item => (
            <AppCard key={item.tractorId} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.modelWrap}>
                  <Text style={[typography.h4, styles.model]}>
                    {item.model}
                  </Text>
                  <Text style={[typography.caption, styles.number]}>
                    {item.number}
                  </Text>
                </View>
                {renderBadge(item.status)}
              </View>

              <View style={styles.detailRow}>
                <Text style={[typography.label, styles.detailLabel]}>
                  Location
                </Text>
                <Text style={[typography.body, styles.detailValue]}>
                  {item.location}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={[typography.label, styles.detailLabel]}>
                  Daily Rate
                </Text>
                <Text style={[typography.body, styles.detailValue]}>
                  ₹{item.dailyRate}
                </Text>
              </View>

              {/* 🔥 BOOK BUTTON */}
              {item.status === 'Available' && (
                <TouchableOpacity
                  style={styles.bookButton}
                  onPress={() =>
                    navigation.navigate('BookTractor', { tractor: item })
                  }
                >
                  <Text style={styles.bookButtonText}>Book</Text>
                </TouchableOpacity>
              )}
            </AppCard>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  title: {
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  card: {
    marginBottom: spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  modelWrap: {
    flex: 1,
    marginRight: spacing.md,
  },
  model: {
    color: colors.text,
    marginBottom: spacing.xs / 2,
  },
  number: {
    color: colors.textSecondary,
  },
  detailRow: {
    marginBottom: spacing.md,
  },
  detailLabel: {
    color: colors.textSecondary,
    marginBottom: spacing.xs / 2,
  },
  detailValue: {
    color: colors.text,
  },
  bookButton: {
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    borderRadius: 8,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  errorText: {
    color: '#c62828',
    marginBottom: spacing.md,
  },
  retryButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: '#c62828',
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyText: {
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  registerButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  registerButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
});