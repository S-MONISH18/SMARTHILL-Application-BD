import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import AppCard from '../../components/AppCard';
import { useAuth } from '../../context/AuthContext';

export default function CustomerProfileScreen({ navigation }) {
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const MenuOption = ({ icon, label, onPress, showArrow = true }) => (
    <TouchableOpacity style={styles.menuOption} onPress={onPress}>
      <View style={styles.menuLeft}>
        <Icon name={icon} size={24} color={colors.primary} style={styles.menuIcon} />
        <Text style={[typography.body, styles.menuLabel]}>{label}</Text>
      </View>
      {showArrow && <Icon name="chevron-right" size={24} color={colors.textSecondary} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'C'}
            </Text>
          </View>

          <Text style={[typography.h2, styles.name]}>
            {currentUser?.name || 'Customer'}
          </Text>

          <View style={styles.roleTag}>
            <Icon name="account-check" size={16} color={colors.primary} />
            <Text style={[typography.label, styles.roleText]}>
              {currentUser?.role ? currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1) : 'Customer'}
            </Text>
          </View>
        </View>

        {/* Account Information Card */}
        <AppCard style={styles.section}>
          <Text style={[typography.h4, styles.sectionTitle]}>Account Information</Text>
          
          <View style={styles.infoRow}>
            <Icon name="phone" size={22} color={colors.primary} style={styles.infoIcon} />
            <View style={styles.infoContent}>
              <Text style={[typography.label, styles.infoLabel]}>Phone Number</Text>
              <Text style={[typography.body, styles.infoValue]}>
                {currentUser?.phone || 'Not Available'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Icon name="email" size={22} color={colors.primary} style={styles.infoIcon} />
            <View style={styles.infoContent}>
              <Text style={[typography.label, styles.infoLabel]}>Email</Text>
              <Text style={[typography.body, styles.infoValue]}>
                {currentUser?.email || 'Not Available'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Icon name="calendar" size={22} color={colors.primary} style={styles.infoIcon} />
            <View style={styles.infoContent}>
              <Text style={[typography.label, styles.infoLabel]}>Member Since</Text>
              <Text style={[typography.body, styles.infoValue]}>
                {currentUser?.joinDate || 'Jan 2024'}
              </Text>
            </View>
          </View>
        </AppCard>

        {/* Quick Actions */}
        <AppCard style={styles.section}>
          <Text style={[typography.h4, styles.sectionTitle]}>Quick Actions</Text>
          <MenuOption icon="pencil-outline" label="Edit Profile" onPress={() => {}} />
          <MenuOption icon="map-marker" label="Saved Addresses" onPress={() => {}} />
          <MenuOption icon="heart-outline" label="Favorites" onPress={() => {}} />
          <MenuOption icon="history" label="Order History" onPress={() => {}} showArrow={true} />
        </AppCard>

        {/* Settings & Support */}
        <AppCard style={styles.section}>
          <Text style={[typography.h4, styles.sectionTitle]}>Settings & Support</Text>
          <MenuOption icon="bell-outline" label="Notifications" onPress={() => {}} />
          <MenuOption icon="lock-outline" label="Privacy & Security" onPress={() => {}} />
          <MenuOption icon="help-circle-outline" label="Help & Support" onPress={() => {}} />
          <MenuOption icon="information-outline" label="About" onPress={() => {}} showArrow={true} />
        </AppCard>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.editButton}>
            <Icon name="pencil-outline" size={20} color={colors.primary} />
            <Text style={[typography.body, styles.editButtonText]}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signOutButton} onPress={handleLogout}>
            <Icon name="power" size={20} color={colors.surface} />
            <Text style={[typography.body, styles.signOutText]}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarText: {
    color: colors.surface,
    fontSize: 40,
    fontWeight: '700',
  },
  name: {
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  roleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '15',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    gap: spacing.xs,
  },
  roleText: {
    color: colors.primary,
    fontWeight: '600',
  },
  section: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  sectionTitle: {
    color: colors.text,
    marginBottom: spacing.md,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
    gap: spacing.md,
  },
  infoIcon: {
    marginTop: spacing.xs,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    color: colors.textSecondary,
    marginBottom: spacing.xs / 2,
  },
  infoValue: {
    color: colors.text,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.sm,
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginHorizontal: -spacing.md,
    borderRadius: 12,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  menuIcon: {
    width: 24,
  },
  menuLabel: {
    color: colors.text,
    fontWeight: '500',
    flex: 1,
  },
  buttonContainer: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  editButton: {
    height: 50,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  editButtonText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 16,
  },
  signOutButton: {
    height: 50,
    borderRadius: 14,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  signOutText: {
    color: colors.surface,
    fontWeight: '700',
    fontSize: 16,
  },
  footer: {
    height: spacing.xl,
  },
});