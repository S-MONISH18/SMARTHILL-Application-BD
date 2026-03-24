import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

const roles = [
  { label: 'Farmer', value: 'farmer' },
  { label: 'Tractor Owner', value: 'tractor_owner' },
  { label: 'Customer', value: 'customer' },
];

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('farmer');

  const handleLogin = () => {
    if (!phone || !password || !role) {
      Alert.alert('Missing Information', 'Please fill in all fields.');
      return;
    }

    const result = login({ phone, password, role });

    if (!result.success) {
      Alert.alert('Login Failed', result.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <Text style={[typography.h1, styles.title]}>Login</Text>
            <Text style={[typography.body, styles.subtitle]}>
              Sign in with your phone number and role
            </Text>

            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter phone number"
              placeholderTextColor={colors.textMuted}
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
            />

            <Text style={styles.label}>Role</Text>
            <View style={styles.roleList}>
              {roles.map(item => {
                const selected = role === item.value;
                return (
                  <TouchableOpacity
                    key={item.value}
                    style={[styles.roleButton, selected && styles.roleButtonActive]}
                    onPress={() => setRole(item.value)}
                  >
                    <Text style={[styles.roleText, selected && styles.roleTextActive]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
              <Text style={styles.primaryButtonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.linkText}>Don&apos;t have an account? Sign Up</Text>
            </TouchableOpacity>

            <View style={styles.demoCard}>
              <Text style={styles.demoTitle}>Demo Accounts</Text>
              <Text style={styles.demoText}>Farmer: 9876543210 / 1234</Text>
              <Text style={styles.demoText}>Tractor Owner: 9876500000 / 1234</Text>
              <Text style={styles.demoText}>Customer: 9000000000 / 1234</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  keyboardAvoiding: { flex: 1 },
  content: {
    flexGrow: 1,
    minHeight: '100%',
    padding: spacing.xl,
    justifyContent: 'center',
  },
  title: { color: colors.primary, marginBottom: spacing.sm },
  subtitle: { color: colors.textSecondary, marginBottom: spacing.xl },
  label: {
    ...typography.label,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 14,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    marginBottom: spacing.lg,
    color: colors.text,
  },
  roleList: { marginBottom: spacing.xl },
  roleButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  roleButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  roleText: {
    textAlign: 'center',
    fontWeight: '600',
    color: colors.text,
  },
  roleTextActive: {
    color: colors.surface,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  primaryButtonText: {
    color: colors.surface,
    fontWeight: '700',
    fontSize: 16,
  },
  linkText: {
    textAlign: 'center',
    color: colors.primary,
    fontWeight: '600',
  },
  demoCard: {
    marginTop: spacing.xxl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 16,
    padding: spacing.lg,
  },
  demoTitle: {
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  demoText: {
    color: colors.textSecondary,
    marginBottom: 4,
  },
});