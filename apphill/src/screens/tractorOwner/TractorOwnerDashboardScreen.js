import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import AppCard from '../../components/AppCard';
import { useAuth } from '../../context/AuthContext';
import Badge from '../../components/Badge';

export default function TractorOwnerDashboardScreen() {
  const tractors = 3;
  const activeListings = 2;
  const requests = 5;
  const earnings = '₹12,500';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={[typography.caption, styles.headerTag]}>Tractor Owner</Text>
          <Text style={[typography.h1, styles.title]}>Dashboard</Text>
          <Text style={[typography.body, styles.subtitle]}>
            Manage your tractors, listings, and rental requests
          </Text>
        </View>

        <View style={styles.summaryGrid}>
          <AppCard style={styles.statCard}>
            <Text style={styles.statIcon}>🚜</Text>
            <Text style={[typography.h2, styles.statValue]}>{tractors}</Text>
            <Text style={[typography.bodySmall, styles.statLabel]}>My Tractors</Text>
          </AppCard>

          <AppCard style={styles.statCard}>
            <Text style={styles.statIcon}>✅</Text>
            <Text style={[typography.h2, styles.statValue]}>{activeListings}</Text>
            <Text style={[typography.bodySmall, styles.statLabel]}>Active Listings</Text>
          </AppCard>

          <AppCard style={styles.statCard}>
            <Text style={styles.statIcon}>📩</Text>
            <Text style={[typography.h2, styles.statValue]}>{requests}</Text>
            <Text style={[typography.bodySmall, styles.statLabel]}>Requests</Text>
          </AppCard>

          <AppCard style={styles.statCard}>
            <Text style={styles.statIcon}>💰</Text>
            <Text style={[typography.h2, styles.statValue]}>{earnings}</Text>
            <Text style={[typography.bodySmall, styles.statLabel]}>Earnings</Text>
          </AppCard>
        </View>

        <AppCard style={styles.bannerCard}>
          <Text style={[typography.h3, styles.bannerTitle]}>Rental Activity</Text>
          <Text style={[typography.body, styles.bannerText]}>
            Your tractor listings are visible to farmers and customers. Keep availability updated for more bookings.
          </Text>
          <View style={styles.badgeRow}>
            <Badge text="2 Available" variant="success" />
            <View style={styles.badgeGap} />
            <Badge text="1 In Service" variant="default" />
          </View>
        </AppCard>

        <AppCard style={styles.sectionCard}>
          <Text style={[typography.h4, styles.sectionTitle]}>Quick Overview</Text>

          <View style={styles.infoRow}>
            <Text style={[typography.label, styles.infoLabel]}>Most Popular Tractor</Text>
            <Text style={[typography.body, styles.infoValue]}>Mahindra 575 DI</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[typography.label, styles.infoLabel]}>Top Rental Area</Text>
            <Text style={[typography.body, styles.infoValue]}>Erode</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[typography.label, styles.infoLabel]}>Pending Requests</Text>
            <Text style={[typography.body, styles.infoValue]}>2 New</Text>
          </View>
        </AppCard>
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
  header: {
    marginBottom: spacing.xl,
  },
  headerTag: {
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  title: {
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.textSecondary,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  statCard: {
    width: '48%',
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 26,
    marginBottom: spacing.sm,
  },
  statValue: {
    color: colors.text,
    marginBottom: spacing.xs,
  },
  statLabel: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
  bannerCard: {
    marginBottom: spacing.xl,
  },
  bannerTitle: {
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  bannerText: {
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeGap: {
    width: spacing.sm,
  },
  sectionCard: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    color: colors.primary,
    marginBottom: spacing.lg,
  },
  infoRow: {
    marginBottom: spacing.md,
  },
  infoLabel: {
    color: colors.textSecondary,
    marginBottom: spacing.xs / 2,
  },
  infoValue: {
    color: colors.text,
  },
});