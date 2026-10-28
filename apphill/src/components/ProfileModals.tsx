import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import typography from '../theme/typography';
import { updateProfile, changePassword } from '../services/apiService';

//////////////////////////////////////////////////////
// ✏️ EDIT PROFILE MODAL
//////////////////////////////////////////////////////
interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  currentUser: any;
  onSuccess: (updatedUser: any) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  onClose,
  currentUser,
  onSuccess,
}) => {
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [location, setLocation] = useState(currentUser?.location || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && currentUser) {
      setName(currentUser?.name || '');
      setEmail(currentUser?.email || '');
      setLocation(currentUser?.location || '');
    }
  }, [visible, currentUser]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Required Field', 'Please enter your name.');
      return;
    }

    setLoading(true);
    try {
      const userId = currentUser?.userId || currentUser?.phone;
      const res = await updateProfile({
        userId,
        name: name.trim(),
        email: email.trim(),
        location: location.trim(),
      });

      if (res.success && res.user) {
        onSuccess(res.user);
        Alert.alert('Success', 'Profile updated successfully!');
        onClose();
      } else {
        Alert.alert('Update Failed', res.message || 'Could not update profile.');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}
      >
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={[typography.h3, styles.modalTitle]}>✏️ Edit Profile</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="e.g. Rajesh Kumar"
              placeholderTextColor={colors.textMuted}
            />

            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="e.g. rajesh@gmail.com"
              placeholderTextColor={colors.textMuted}
            />

            <Text style={styles.inputLabel}>Location / Farm Region</Text>
            <TextInput
              style={styles.textInput}
              value={location}
              onChangeText={setLocation}
              placeholder="e.g. Kodaikanal Hills, Tamil Nadu"
              placeholderTextColor={colors.textMuted}
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.btn, styles.cancelBtn]}
                onPress={onClose}
                disabled={loading}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, styles.saveBtn]}
                onPress={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={colors.white} size="small" />
                ) : (
                  <Text style={styles.saveBtnText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

//////////////////////////////////////////////////////
// 🔒 CHANGE PASSWORD MODAL
//////////////////////////////////////////////////////
interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
  userId: string;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  visible,
  onClose,
  userId,
}) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!oldPassword) {
      Alert.alert('Validation Error', 'Please enter your current password.');
      return;
    }
    if (newPassword.length < 4) {
      Alert.alert('Validation Error', 'New password must be at least 4 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Validation Error', 'New passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await changePassword({
        userId,
        oldPassword,
        newPassword,
      });

      if (res.success) {
        Alert.alert('Success', 'Password changed successfully!');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        onClose();
      } else {
        Alert.alert('Failed', res.message || 'Could not change password.');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}
      >
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={[typography.h3, styles.modalTitle]}>🔒 Change Password</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.inputLabel}>Current Password</Text>
            <TextInput
              style={styles.textInput}
              value={oldPassword}
              onChangeText={setOldPassword}
              secureTextEntry
              placeholder="Enter current password"
              placeholderTextColor={colors.textMuted}
            />

            <Text style={styles.inputLabel}>New Password</Text>
            <TextInput
              style={styles.textInput}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              placeholder="Enter new password (min 4 chars)"
              placeholderTextColor={colors.textMuted}
            />

            <Text style={styles.inputLabel}>Confirm New Password</Text>
            <TextInput
              style={styles.textInput}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholder="Re-enter new password"
              placeholderTextColor={colors.textMuted}
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.btn, styles.cancelBtn]}
                onPress={onClose}
                disabled={loading}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, styles.saveBtn]}
                onPress={handleUpdate}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={colors.white} size="small" />
                ) : (
                  <Text style={styles.saveBtnText}>Update Password</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

//////////////////////////////////////////////////////
// 📞 SUPPORT MODAL
//////////////////////////////////////////////////////
interface SupportModalProps {
  visible: boolean;
  onClose: () => void;
  onOpenChat?: () => void;
  onOpenFAQ?: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({
  visible,
  onClose,
  onOpenChat,
  onOpenFAQ,
}) => {
  const handleCall = () => {
    Linking.openURL('tel:18004197627').catch(() => {
      Alert.alert('Helpline', 'Call our toll-free support at 1800-419-7627');
    });
  };

  const handleEmail = () => {
    Linking.openURL('mailto:support@smarthill.farm?subject=SmartHill%20Support%20Request').catch(() => {
      Alert.alert('Email Support', 'Send an email to support@smarthill.farm');
    });
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={[typography.h3, styles.modalTitle]}>🤝 Help & Support</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.supportSubtitle}>
            How can we help you today? Our team and AI assistant are available 24/7.
          </Text>

          <TouchableOpacity style={styles.supportOption} onPress={handleCall}>
            <Text style={styles.supportOptionIcon}>📞</Text>
            <View style={styles.supportOptionContent}>
              <Text style={styles.supportOptionTitle}>Toll-Free Helpline</Text>
              <Text style={styles.supportOptionDesc}>1800-419-7627 (Free across India)</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.supportOption} onPress={handleEmail}>
            <Text style={styles.supportOptionIcon}>📧</Text>
            <View style={styles.supportOptionContent}>
              <Text style={styles.supportOptionTitle}>Email Support</Text>
              <Text style={styles.supportOptionDesc}>support@smarthill.farm</Text>
            </View>
          </TouchableOpacity>

          {onOpenChat && (
            <TouchableOpacity
              style={styles.supportOption}
              onPress={() => {
                onClose();
                onOpenChat();
              }}
            >
              <Text style={styles.supportOptionIcon}>💬</Text>
              <View style={styles.supportOptionContent}>
                <Text style={styles.supportOptionTitle}>SmartHill AI Assistant</Text>
                <Text style={styles.supportOptionDesc}>Instant help with crops, orders & tools</Text>
              </View>
            </TouchableOpacity>
          )}

          {onOpenFAQ && (
            <TouchableOpacity
              style={styles.supportOption}
              onPress={() => {
                onClose();
                onOpenFAQ();
              }}
            >
              <Text style={styles.supportOptionIcon}>❓</Text>
              <View style={styles.supportOptionContent}>
                <Text style={styles.supportOptionTitle}>Frequently Asked Questions</Text>
                <Text style={styles.supportOptionDesc}>Answers to common questions</Text>
              </View>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={[styles.btn, styles.singleCloseBtn]} onPress={onClose}>
            <Text style={styles.cancelBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

//////////////////////////////////////////////////////
// ℹ️ ABOUT APP MODAL
//////////////////////////////////////////////////////
interface AboutModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={[typography.h3, styles.modalTitle]}>🌱 About SmartHill</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.aboutContent}>
            <Text style={styles.aboutHeading}>SmartHill Agriculture Platform</Text>
            <Text style={styles.aboutText}>
              Version 1.0.0 (Production Ready)
            </Text>
            <Text style={styles.aboutText}>
              Cloud Database: MongoDB Atlas Real-Time Sync
            </Text>
            <Text style={styles.aboutText}>
              AI Engine: Random Forest Crop Prediction & Smart Assistance
            </Text>
            <Text style={[styles.aboutText, { marginTop: spacing.md }]}>
              Built with precision for Hill Farmers, Machinery Owners, and Organic Produce Consumers.
            </Text>
          </View>

          <TouchableOpacity style={[styles.btn, styles.singleCloseBtn]} onPress={onClose}>
            <Text style={styles.cancelBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.xl,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    color: colors.text,
  },
  closeBtn: {
    padding: spacing.xs,
  },
  closeBtnText: {
    fontSize: 20,
    color: colors.textSecondary,
    fontWeight: 'bold',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.sm,
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 15,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  btn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtn: {
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  cancelBtnText: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 14,
  },
  saveBtn: {
    backgroundColor: colors.primary,
  },
  saveBtnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  singleCloseBtn: {
    backgroundColor: colors.surfaceSecondary,
    marginTop: spacing.lg,
  },
  supportSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  supportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 14,
    backgroundColor: colors.surfaceSecondary,
    marginBottom: spacing.sm,
  },
  supportOptionIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  supportOptionContent: {
    flex: 1,
  },
  supportOptionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  supportOptionDesc: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  aboutContent: {
    paddingVertical: spacing.sm,
  },
  aboutHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  aboutText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 2,
  },
});
