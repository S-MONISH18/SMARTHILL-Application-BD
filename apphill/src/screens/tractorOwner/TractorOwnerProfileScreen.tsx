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

export default function TractorOwnerProfileScreen() {
  const { currentUser, setCurrentUser, logout } = useAuth();
  const navigation = useNavigation<any>();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [supportModalVisible, setSupportModalVisible] = useState(false);
  const [aboutModalVisible, setAboutModalVisible] = useState(false);

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'T'}
            </Text>
          </View>

          <Text style={[typography.h2, styles.name]}>
            {currentUser?.name || 'Tractor Owner'}
          </Text>

          <Text style={[typography.body, styles.role]}>
            🚜 Certified Tractor Partner
          </Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>100%</Text>
            <Text style={styles.statLabel}>Atlas Verified</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>4.9 ★</Text>
            <Text style={styles.statLabel}>Partner Rating</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>Active</Text>
            <Text style={styles.statLabel}>Fleet Status</Text>
          </View>
        </View>

        {/* Information Card */}
        <View style={styles.section}>
          <Text style={[typography.h4, styles.sectionTitle]}>📋 Account Information</Text>
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
              <Text style={[typography.label, styles.infoLabel]}>📍 Service Region / Hub</Text>
              <Text style={[typography.body, styles.infoValue]}>
                {currentUser?.location || 'Not Added Yet'}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={[typography.label, styles.infoLabel]}>🧑‍💼 Role</Text>
              <Text style={[typography.body, styles.infoValue]}>
                {currentUser?.role || 'tractor_owner'}
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

        {/* Fleet & Management Actions */}
        <View style={styles.section}>
          <Text style={[typography.h4, styles.sectionTitle]}>⚙️ Actions & Management</Text>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setEditModalVisible(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonIcon}>✏️</Text>
            <View style={styles.actionContent}>
              <Text style={styles.actionButtonTitle}>Edit Profile</Text>
              <Text style={styles.actionButtonSubtitle}>Update your name, email & service region</Text>
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
              <Text style={styles.actionButtonSubtitle}>Keep your partner account secure</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              try {
                navigation.navigate('Tractors');
              } catch {
                Alert.alert('Machinery', 'View your machinery under the Tractors tab.');
              }
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonIcon}>🚜</Text>
            <View style={styles.actionContent}>
              <Text style={styles.actionButtonTitle}>My Machinery Fleet</Text>
              <Text style={styles.actionButtonSubtitle}>View and register tractors & attachments</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              try {
                navigation.navigate('RentalRequests');
              } catch {
                Alert.alert('Requests', 'View rental requests under the Requests tab.');
              }
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonIcon}>📩</Text>
            <View style={styles.actionContent}>
              <Text style={styles.actionButtonTitle}>Rental Requests</Text>
              <Text style={styles.actionButtonSubtitle}>Manage booking requests from farmers</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setAboutModalVisible(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonIcon}>ℹ️</Text>
            <View style={styles.actionContent}>
              <Text style={styles.actionButtonTitle}>About SmartHill Platform</Text>
              <Text style={styles.actionButtonSubtitle}>Version 1.0.0 • Connected to MongoDB Atlas</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Buttons */}
        <TouchableOpacity
          style={styles.accountButton}
          onPress={() => setSupportModalVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.accountButtonText}>📧 Partner Support & Helpline</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
          activeOpacity={0.8}
        >
          <Text style={styles.signOutText}>🚪 Sign Out</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={[typography.caption, styles.versionText]}>SmartHill Partner App v1.0.0</Text>
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
            Alert.alert('AI Assistant', 'AI Assistant ready.');
          }
        }}
        onOpenFAQ={() => {
          try {
            navigation.navigate('FAQ');
          } catch {
            Alert.alert('FAQ', 'FAQ Help Center available.');
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
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    elevation: 6,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  avatarText: {
    color: colors.surface,
    fontSize: 36,
    fontWeight: '700',
  },
  name: {
    color: colors.text,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  role: {
    color: colors.textSecondary,
    textAlign: 'center',
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
    fontSize: 18,
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
    marginBottom: spacing.xs / 2,
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
  },
  signOutText: {
    color: colors.surface,
    fontWeight: '700',
    fontSize: 16,
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  versionText: {
    color: colors.textSecondary,
  },
});
