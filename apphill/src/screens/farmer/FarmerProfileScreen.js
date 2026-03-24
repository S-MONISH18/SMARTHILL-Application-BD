import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import AppCard from '../../components/AppCard';
import { useAuth } from '../../context/AuthContext';

export default function FarmerProfileScreen() {
  const { currentUser, logout } = useAuth();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'F'}
            </Text>
          </View>

          <Text style={[typography.h2, styles.name]}>
            {currentUser?.name || 'Farmer'}
          </Text>

          <Text style={[typography.body, styles.role]}>
            Farmer Account
          </Text>
        </View>

        <AppCard style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={[typography.label, styles.infoLabel]}>Phone Number</Text>
            <Text style={[typography.body, styles.infoValue]}>
              {currentUser?.phone || 'Not Available'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[typography.label, styles.infoLabel]}>Role</Text>
            <Text style={[typography.body, styles.infoValue]}>
              {currentUser?.role || 'farmer'}
            </Text>
          </View>
        </AppCard>

        <TouchableOpacity style={styles.accountButton}>
          <Text style={styles.accountButtonText}>Account Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signOutButton} onPress={logout}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  avatarText: {
    color: colors.surface,
    fontSize: 30,
    fontWeight: '700',
  },
  name: {
    color: colors.text,
    marginBottom: spacing.xs,
  },
  role: {
    color: colors.textSecondary,
  },
  infoCard: {
    marginBottom: spacing.xl,
  },
  infoRow: {
    marginBottom: spacing.lg,
  },
  infoLabel: {
    color: colors.textSecondary,
    marginBottom: spacing.xs / 2,
  },
  infoValue: {
    color: colors.text,
  },
  accountButton: {
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  accountButtonText: {
    color: colors.text,
    fontWeight: '700',
  },
  signOutButton: {
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutText: {
    color: colors.surface,
    fontWeight: '700',
  },
});