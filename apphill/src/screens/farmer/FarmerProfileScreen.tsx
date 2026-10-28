import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
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

export default function FarmerProfileScreen() {
  const { currentUser, setCurrentUser, logout } = useAuth();
  const navigation = useNavigation<any>();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [supportModalVisible, setSupportModalVisible] = useState(false);
  const [aboutModalVisible, setAboutModalVisible] = useState(false);

  // Dynamic profile completion
  const calculateCompletion = () => {
    let score = 0;
    if (currentUser?.phone) score += 25;
    if (currentUser?.name) score += 25;
    if (currentUser?.email) score += 25;
    if (currentUser?.location) score += 25;
    return score;
  };

  const profileCompletion = calculateCompletion();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out of your account?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
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
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'F'}
            </Text>
          </View>

          <Text style={[typography.h2, styles.name]}>
            {currentUser?.name || 'Farmer'}
          </Text>

          <Text style={[typography.body, styles.role]}>🌾 Farmer Account</Text>

          {/* Profile Completion Badge */}
          <View style={styles.completionBadge}>
            <View style={styles.completionBar}>
              <View style={[styles.completionFill, { width: `${profileCompletion}%` }]} />
            </View>
            <Text style={styles.completionText}>{profileCompletion}% Complete</Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>2.5</Text>
            <Text style={styles.statLabel}>Farm Area (acres)</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Active Nodes</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Products</Text>
          </View>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={[typography.h4, styles.sectionTitle]}>📋 Personal Information</Text>
          <AppCard style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={[typography.label, styles.infoLabel]}>📱 Phone Number</Text>
              <Text style={[typography.body, styles.infoValue]}>
                {currentUser?.phone || 'Not Available'}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={[typography.label, styles.infoLabel]}>📧 Email</Text>
              <Text style={[typography.body, styles.infoValue]}>
                {currentUser?.email || 'Not Added Yet'}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={[typography.label, styles.infoLabel]}>📍 Location</Text>
              <Text style={[typography.body, styles.infoValue]}>
                {currentUser?.location || 'Not Added Yet'}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={[typography.label, styles.infoLabel]}>🧑‍💼 Role</Text>
              <Text style={[typography.body, styles.infoValue]}>
                {currentUser?.role || 'farmer'}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={[typography.label, styles.infoLabel]}>📅 Member Since</Text>
              <Text style={[typography.body, styles.infoValue]}>
                {currentUser?.joinDate || 'Jan 2024'}
              </Text>
            </View>
          </AppCard>
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <Text style={[typography.h4, styles.sectionTitle]}>⚙️ Actions</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setEditModalVisible(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonIcon}>✏️</Text>
            <View style={styles.actionContent}>
              <Text style={styles.actionButtonTitle}>Edit Profile</Text>
              <Text style={styles.actionButtonSubtitle}>Update your name, email & location</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setPasswordModalVisible(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonIcon}>🔒</Text>
            <View style={styles.actionContent}>
              <Text style={styles.actionButtonTitle}>Change Password</Text>
              <Text style={styles.actionButtonSubtitle}>Secure your account with a new password</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleNotifications}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonIcon}>🔔</Text>
            <View style={styles.actionContent}>
              <Text style={styles.actionButtonTitle}>Notifications</Text>
              <Text style={styles.actionButtonSubtitle}>View booking & order updates</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setAboutModalVisible(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonIcon}>ℹ️</Text>
            <View style={styles.actionContent}>
              <Text style={styles.actionButtonTitle}>About SmartHill</Text>
              <Text style={styles.actionButtonSubtitle}>App version, cloud sync & AI engine</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Buttons */}
        <TouchableOpacity
          style={styles.accountButton}
          onPress={() => setSupportModalVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.accountButtonText}>📧 Contact Support & Helpline</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
          activeOpacity={0.8}
        >
          <Text style={styles.signOutText}>🚪 Sign Out</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={[typography.caption, styles.versionText]}>Version 1.0.0 • Connected to MongoDB Atlas</Text>
        </View>
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
            Alert.alert('Chat Assistant', 'AI Assistant is ready to help.');
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingBottom: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  avatarText: {
    color: colors.surface,
    fontSize: 40,
    fontWeight: '700',
  },
  name: {
    color: colors.text,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  role: {
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  completionBadge: {
    width: '100%',
    alignItems: 'center',
  },
  completionBar: {
    width: '80%',
    height: 8,
    backgroundColor: colors.borderLight,
    borderRadius: 4,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  completionFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  completionText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.xs / 2,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    marginBottom: spacing.md,
    color: colors.text,
  },
  infoCard: {
    marginBottom: 0,
  },
  infoRow: {
    paddingVertical: spacing.md,
  },
  infoLabel: {
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontSize: 12,
  },
  infoValue: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  actionButtonIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  actionContent: {
    flex: 1,
  },
  actionButtonTitle: {
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs / 2,
  },
  actionButtonSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  accountButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    flexDirection: 'row',
  },
  accountButtonText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 16,
  },
  signOutButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    flexDirection: 'row',
  },
  signOutText: {
    color: colors.surface,
    fontWeight: '700',
    fontSize: 16,
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  versionText: {
    color: colors.textSecondary,
  },
});
