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

import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

import { loginUser } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';

const roles = [
  { label: 'Farmer', value: 'farmer' },
  { label: 'Tractor Owner', value: 'tractor_owner' },
  { label: 'Customer', value: 'customer' },
];

export default function LoginScreen({ navigation }) {
  const { setCurrentUser } = useAuth();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('farmer');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert('Missing Information', 'Enter phone and password');
      return;
    }

    setLoading(true);

    try {
      const result = await loginUser(phone, password);

      if (result.success) {
        if (result.user.role !== role) {
          Alert.alert('Error ❌', 'Wrong role selected');
          setLoading(false);
          return;
        }

        setCurrentUser(result.user);
        // ✅ RootNavigator will automatically render the correct navigator based on user role

      } else {
        Alert.alert('Login Failed ❌', result.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error ❌', 'Something went wrong');
    }

    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <Text style={[typography.h1, styles.title]}>Login</Text>

            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Phone"
            />

            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholder="Password"
                placeholderTextColor={colors.textSecondary}
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.passwordToggleText}>
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Role</Text>
            <View style={styles.roleList}>
              {roles.map(r => (
                <TouchableOpacity
                  key={r.value}
                  style={[
                    styles.roleButton,
                    role === r.value && styles.roleButtonActive,
                  ]}
                  onPress={() => setRole(r.value)}
                >
                  <Text
                    style={[
                      styles.roleText,
                      role === r.value && styles.roleTextActive,
                    ]}
                  >
                    {r.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>
                {loading ? 'Loading...' : 'Login'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.link}>Go to Signup</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

//////////////////////////////////////////////////////
// STYLES (IMPORTANT)
//////////////////////////////////////////////////////
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5',
  },

  keyboardAvoiding: { flex: 1 },

  content: { 
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },

  title: { 
    marginBottom: spacing.lg,
    color: colors.primary,
    fontSize: 32,
    fontWeight: '700',
  },

  label: { 
    marginTop: spacing.lg,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },

  input: {
    borderWidth: 1.5,
    padding: spacing.md,
    borderRadius: 12,
    marginTop: spacing.sm,
    backgroundColor: '#fff',
    borderColor: '#e0e0e0',
    fontSize: 16,
    color: colors.text,
  },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    marginTop: spacing.sm,
    paddingRight: spacing.sm,
    backgroundColor: '#fff',
    borderColor: '#e0e0e0',
  },

  passwordInput: {
    flex: 1,
    padding: spacing.md,
    fontSize: 16,
    color: colors.text,
  },

  passwordToggle: {
    padding: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },

  passwordToggleText: {
    fontSize: 20,
  },

  roleList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.md,
    gap: spacing.sm,
  },

  roleButton: {
    borderWidth: 2,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 24,
    backgroundColor: '#fff',
    borderColor: colors.primary,
  },

  roleButtonActive: {
    backgroundColor: colors.primary,
  },

  roleText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },

  roleTextActive: {
    color: '#fff',
  },

  button: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  link: {
    marginTop: spacing.lg,
    textAlign: 'center',
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});