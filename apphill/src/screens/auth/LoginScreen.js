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
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Password"
            />

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
// ✅ STYLES (IMPORTANT)
//////////////////////////////////////////////////////
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  keyboardAvoiding: { flex: 1 },

  content: { padding: 20 },

  title: { marginBottom: 20 },

  label: { marginTop: 10 },

  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
  },

  roleList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },

  roleButton: {
    borderWidth: 1,
    padding: 8,
    marginRight: 10,
    borderRadius: 20,
  },

  roleButtonActive: {
    backgroundColor: 'green',
  },

  roleText: {},

  roleTextActive: {
    color: '#fff',
  },

  button: {
    backgroundColor: 'green',
    padding: 12,
    marginTop: 20,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
  },

  link: {
    marginTop: 15,
    textAlign: 'center',
  },
});