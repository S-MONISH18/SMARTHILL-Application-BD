import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

import { createUser } from '../../services/apiService';

const roles = [
  { label: 'Farmer', value: 'farmer' },
  { label: 'Tractor Owner', value: 'tractor_owner' },
  { label: 'Customer', value: 'customer' },
];

export default function SignupScreen({ navigation }) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    password: '',
    location: '',
    role: 'farmer',
  });

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSignup = async () => {
    if (!form.name || !form.phone || !form.password || !form.location) {
      Alert.alert('Missing Information', 'Please fill in all fields.');
      return;
    }

    const user = {
      userId: `user-${Date.now()}`,
      name: form.name,
      phone: form.phone,
      password: form.password,
      location: form.location,
      role: form.role,
      createdAt: Date.now(),
    };

    try {
      const result = await createUser(user);

      if (result.success) {
        Alert.alert('Success ✅', 'Account created successfully');
        navigation.navigate('Login');
      } else {
        Alert.alert('Error ❌', result.message || 'Signup failed');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error ❌', 'Something went wrong');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[typography.h1, styles.title]}>Sign Up</Text>
        <Text style={[typography.body, styles.subtitle]}>
          Create your account and choose your role
        </Text>

        {/* Name */}
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={form.name}
          onChangeText={value => updateField('name', value)}
          placeholder="Enter full name"
          placeholderTextColor={colors.textMuted}
        />

        {/* Phone */}
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={form.phone}
          onChangeText={value => updateField('phone', value)}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
          placeholderTextColor={colors.textMuted}
        />

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={form.password}
          onChangeText={value => updateField('password', value)}
          placeholder="Create password"
          secureTextEntry
          placeholderTextColor={colors.textMuted}
        />

        {/* Location */}
        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          value={form.location}
          onChangeText={value => updateField('location', value)}
          placeholder="Enter location"
          placeholderTextColor={colors.textMuted}
        />

        {/* Role */}
        <Text style={styles.label}>Role</Text>
        <View style={styles.roleList}>
          {roles.map(item => {
            const selected = form.role === item.value;
            return (
              <TouchableOpacity
                key={item.value}
                style={[styles.roleButton, selected && styles.roleButtonActive]}
                onPress={() => updateField('role', item.value)}
              >
                <Text style={[styles.roleText, selected && styles.roleTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Button */}
        <TouchableOpacity style={styles.primaryButton} onPress={handleSignup}>
          <Text style={styles.primaryButtonText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl },
  title: { color: colors.primary, marginBottom: spacing.sm, marginTop: spacing.lg },
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
    marginBottom: spacing.xl,
  },
});