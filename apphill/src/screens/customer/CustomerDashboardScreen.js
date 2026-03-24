import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function CustomerDashboardScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={[typography.h2, styles.title]}>
        Customer Dashboard
      </Text>

      <Text style={[typography.body, styles.subtitle]}>
        Browse products from farmers and rent tractors from owners.
      </Text>

      {/* ✅ Buy Products */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('BuyProducts')}
      >
        <Text style={styles.cardTitle}>Buy Products</Text>
        <Text style={styles.cardText}>
          Fresh farm products uploaded by farmers.
        </Text>
      </TouchableOpacity>

      {/* ✅ Rent Tractors */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('CustomerRentTractor')}
      >
        <Text style={styles.cardTitle}>Rent Tractors</Text>
        <Text style={styles.cardText}>
          Tractor listings available for rent.
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  title: {
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.md,
  },
  cardTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  cardText: {
    ...typography.body,
    color: colors.textSecondary,
  },
});