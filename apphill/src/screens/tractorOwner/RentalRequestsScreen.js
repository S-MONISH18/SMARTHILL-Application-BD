import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import AppCard from '../../components/AppCard';
import Badge from '../../components/Badge';

const requests = [
  {
    id: '1',
    requester: 'Ramesh Kumar',
    role: 'Farmer',
    tractor: 'Mahindra 575 DI',
    location: 'Coimbatore',
    duration: '2 days',
    status: 'Pending',
  },
  {
    id: '2',
    requester: 'Priya',
    role: 'Customer',
    tractor: 'Swaraj 744 FE',
    location: 'Salem',
    duration: '1 day',
    status: 'Pending',
  },
];

export default function RentalRequestsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[typography.h2, styles.title]}>Rental Requests</Text>
        <Text style={[typography.body, styles.subtitle]}>
          Review incoming booking requests from farmers and customers
        </Text>

        {requests.map(item => (
          <AppCard key={item.id} style={styles.card}>
            <View style={styles.headerRow}>
              <View style={styles.headerInfo}>
                <Text style={[typography.h4, styles.requester]}>{item.requester}</Text>
                <Text style={[typography.caption, styles.role]}>{item.role}</Text>
              </View>
              <Badge text={item.status} variant="default" />
            </View>

            <View style={styles.infoBlock}>
              <Text style={[typography.label, styles.label]}>Requested Tractor</Text>
              <Text style={[typography.body, styles.value]}>{item.tractor}</Text>
            </View>

            <View style={styles.infoBlock}>
              <Text style={[typography.label, styles.label]}>Location</Text>
              <Text style={[typography.body, styles.value]}>{item.location}</Text>
            </View>

            <View style={styles.infoBlock}>
              <Text style={[typography.label, styles.label]}>Duration</Text>
              <Text style={[typography.body, styles.value]}>{item.duration}</Text>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.acceptButton}>
                <Text style={styles.acceptText}>Accept</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.rejectButton}>
                <Text style={styles.rejectText}>Reject</Text>
              </TouchableOpacity>
            </View>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  headerInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  requester: {
    color: colors.text,
    marginBottom: spacing.xs / 2,
  },
  role: {
    color: colors.textSecondary,
  },
  infoBlock: {
    marginBottom: spacing.md,
  },
  label: {
    color: colors.textSecondary,
    marginBottom: spacing.xs / 2,
  },
  value: {
    color: colors.text,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  acceptButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  rejectButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.surfaceSecondary || '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptText: {
    color: colors.surface,
    fontWeight: '700',
  },
  rejectText: {
    color: colors.text,
    fontWeight: '700',
  },
});