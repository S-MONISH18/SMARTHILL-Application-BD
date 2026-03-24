import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import AppCard from '../../components/AppCard';
import Badge from '../../components/Badge';

const tractors = [
  {
    id: '1',
    model: 'Mahindra 575 DI',
    number: 'TN-36K-8077',
    location: 'Erode',
    dailyRate: '3500',
    status: 'Available',
  },
  {
    id: '2',
    model: 'Swaraj 744 FE',
    number: 'TN-28A-1122',
    location: 'Namakkal',
    dailyRate: '3800',
    status: 'Booked',
  },
  {
    id: '3',
    model: 'John Deere 5050D',
    number: 'TN-45B-9087',
    location: 'Salem',
    dailyRate: '4200',
    status: 'Maintenance',
  },
];

export default function MyTractorsScreen() {
  const navigation = useNavigation();

  const renderBadge = status => {
    if (status === 'Available') return <Badge text={status} variant="success" />;
    return <Badge text={status} variant="default" />;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[typography.h2, styles.title]}>My Tractors</Text>
        <Text style={[typography.body, styles.subtitle]}>
          View and manage all your registered tractors
        </Text>

        {tractors.map(item => (
          <AppCard key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.modelWrap}>
                <Text style={[typography.h4, styles.model]}>{item.model}</Text>
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
        ))}
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
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});