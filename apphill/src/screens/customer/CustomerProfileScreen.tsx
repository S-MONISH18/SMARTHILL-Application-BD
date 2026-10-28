import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import AppCard from '../../components/AppCard';
import { useAuth } from '../../context/AuthContext';
import {
  EditProfileModal,
  ChangePasswordModal,
  SupportModal,
  AboutModal,
} from '../../components/ProfileModals';

const MenuOption = ({ icon, label, onPress, showArrow = true }: any) => (
  <TouchableOpacity style={styles.menuOption} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.menuLeft}>
      <Icon name={icon} size={24} color={colors.primary} style={styles.menuIcon} />
      <Text style={[typography.body, styles.menuLabel]}>{label}</Text>
    </View>
    {showArrow && <Icon name="chevron-right" size={24} color={colors.textSecondary} />}
  </TouchableOpacity>
);

export default function CustomerProfileScreen() {
  const { currentUser, setCurrentUser, logout } = useAuth();
  const navigation = useNavigation<any>();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [supportModalVisible, setSupportModalVisible] = useState(false);
  const [aboutModalVisible, setAboutModalVisible] = useState(false);

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  const handleSavedAddresses = () => {
    Alert.alert(
      '📍 Delivery Address',
      currentUser?.location
        ? `Current Saved Address:\n\n${currentUser.location}`
        : 'No delivery address saved yet. Tap "Edit Profile" to add your primary delivery location.',
      [
        { text: 'Edit Address', onPress: () => setEditModalVisible(true) },
        { text: 'OK', style: 'default' },
      ]
    );
  };

  const handleFavorites = () => {
    Alert.alert(
      '❤️ Favorite Items',
      'You have saved 3 hill produce favorites:\n\n• Organic Kodaikanal Garlic (1kg)\n• Hill Farm Honey (500g)\n• Fresh Nilgiri Tea (250g)',
      [
        {
          text: 'Browse Market',
          onPress: () => {
            try {
              navigation.navigate('BuyProducts');
            } catch {
              // fallback
            }
          },
        },
        { text: 'Close', style: 'cancel' },
      ]
    );
  };

  const handleOrderHistory = () => {
    try {
      navigation.navigate('MyBookings');
    } catch {
      Alert.alert('Order History', 'You can track all active orders under Bookings.');
    }
  };

  const handleNotifications = () => {
    try {
      navigation.navigate('Notifications');
    } catch {
      Alert.alert('Notifications', 'No new alerts at this time.');
    }
  };

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
                {currentUser?.email || 'Not Added Yet'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Icon name="map-marker" size={22} color={colors.primary} style={styles.infoIcon} />
            <View style={styles.infoContent}>
              <Text style={[typography.label, styles.infoLabel]}>Delivery Address</Text>
              <Text style={[typography.body, styles.infoValue]}>
                {currentUser?.location || 'Not Added Yet'}
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
          <MenuOption
            icon="pencil-outline"
            label="Edit Profile"
            onPress={() => setEditModalVisible(true)}
          />
          <MenuOption
            icon="map-marker"
            label="Saved Addresses"
            onPress={handleSavedAddresses}
          />
          <MenuOption
            icon="heart-outline"
            label="Favorites"
            onPress={handleFavorites}
          />
          <MenuOption
            icon="history"
            label="Order History"
            onPress={handleOrderHistory}
            showArrow={true}
          />
        </AppCard>

        {/* Settings & Support */}
        <AppCard style={styles.section}>
          <Text style={[typography.h4, styles.sectionTitle]}>Settings & Support</Text>
          <MenuOption
            icon="bell-outline"
            label="Notifications"
            onPress={handleNotifications}
          />
          <MenuOption
            icon="lock-outline"
            label="Privacy & Security"
            onPress={() => setPasswordModalVisible(true)}
          />
          <MenuOption
            icon="help-circle-outline"
            label="Help & Support"
            onPress={() => setSupportModalVisible(true)}
          />
          <MenuOption
            icon="information-outline"
            label="About SmartHill"
            onPress={() => setAboutModalVisible(true)}
            showArrow={true}
          />
        </AppCard>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditModalVisible(true)}
            activeOpacity={0.7}
          >
            <Icon name="pencil-outline" size={20} color={colors.primary} />
            <Text style={[typography.body, styles.editButtonText]}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Icon name="power" size={20} color={colors.surface} />
            <Text style={[typography.body, styles.signOutText]}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer} />
      </ScrollView>

      {/* Modals */}
      <EditProfileModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        currentUser={currentUser}
        onSuccess={(updatedUser) => {
          if (setCurrentUser) {
            setCurrentUser((prev: any) => ({ ...prev, ...updatedUser }));
          }
        }}
      />

      <ChangePasswordModal
        visible={passwordModalVisible}
        onClose={() => setPasswordModalVisible(false)}
        userId={currentUser?.userId || currentUser?.phone || ''}
      />

      <SupportModal
        visible={supportModalVisible}
        onClose={() => setSupportModalVisible(false)}
        onOpenChat={() => {
          try {
            navigation.navigate('ChatBox');
          } catch {
            Alert.alert('AI Assistant', 'AI Assistant is ready.');
          }
        }}
        onOpenFAQ={() => {
          try {
            navigation.navigate('FAQ');
          } catch {
            Alert.alert('FAQ', 'FAQ Help Center is available.');
          }
        }}
      />

      <AboutModal
        visible={aboutModalVisible}
        onClose={() => setAboutModalVisible(false)}
      />
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
