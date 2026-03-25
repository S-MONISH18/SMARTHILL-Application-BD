import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { registerTractor } from '../../services/apiService';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import AppCard from '../../components/AppCard';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';
import Badge from '../../components/Badge';

export default function RegisterTractorScreen() {
  const navigation = useNavigation();
  const { currentUser } = useAuth();
  const [available, setAvailable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    location: '',
    model: '',
    number: '',
    dailyRate: '',
  });

  const handleSubmit = async () => {
    const requiredFields = ['location', 'model', 'number', 'dailyRate'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    if (!currentUser?.phone) {
      Alert.alert('Error', 'User phone not available');
      return;
    }

    setLoading(true);

    try {
      const tractorData = {
        ownerPhone: currentUser.phone,
        model: formData.model,
        number: formData.number,
        location: formData.location,
        dailyRate: formData.dailyRate,
        status: available ? 'Available' : 'Unavailable',
      };

      const response = await registerTractor(tractorData);

      if (response.success) {
        Alert.alert(
          'Registration Successful ✅',
          'Your tractor has been registered and is now available for rent!',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        Alert.alert('Error', response.message || 'Failed to register tractor');
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={[typography.h1, styles.pageTitle]}>Register Your Tractor</Text>
          <Text style={[typography.body, styles.pageSubtitle]}>
            List your tractor for rent and start earning money
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[typography.h3, styles.sectionTitle]}>Tractor Details</Text>
          <AppCard>
            <InputField
              label="Tractor Model *"
              placeholder="e.g. Mahindra 575 DI"
              value={formData.model}
              onChangeText={value => updateFormData('model', value)}
              icon={<Text>🚜</Text>}
            />
            <InputField
              label="Registration Number *"
              placeholder="e.g. TN-36K-8077"
              value={formData.number}
              onChangeText={value => updateFormData('number', value)}
              icon={<Text>🆔</Text>}
            />
            <InputField
              label="Location *"
              placeholder="City, State"
              value={formData.location}
              onChangeText={value => updateFormData('location', value)}
              icon={<Text>📍</Text>}
            />
          </AppCard>
        </View>

        <View style={styles.section}>
          <Text style={[typography.h3, styles.sectionTitle]}>Rental Pricing</Text>
          <AppCard>
            <InputField
              label="Daily Rate (₹) *"
              placeholder="3500"
              value={formData.dailyRate}
              onChangeText={value => updateFormData('dailyRate', value)}
              keyboardType="numeric"
              icon={<Text>📅</Text>}
            />

            {formData.dailyRate ? (
              <View style={styles.pricePreview}>
                <Text style={[typography.bodySmall, styles.previewLabel]}>Price Preview</Text>
                <View style={styles.previewRow}>
                  <View style={styles.previewItem}>
                    <Text style={[typography.caption, styles.previewType]}>Daily</Text>
                    <Text style={[typography.h4, styles.previewPrice]}>₹{formData.dailyRate}</Text>
                  </View>
                </View>
              </View>
            ) : null}
          </AppCard>
        </View>

        <View style={styles.section}>
          <Text style={[typography.h3, styles.sectionTitle]}>Availability</Text>
          <AppCard>
            <View style={styles.availabilityRow}>
              <View style={styles.availabilityInfo}>
                <Text style={[typography.label, styles.availabilityLabel]}>
                  Make tractor available for rent
                </Text>
                <Text style={[typography.caption, styles.availabilityHint]}>
                  Turn this off if you want to pause rentals temporarily
                </Text>
              </View>
              <Switch
                value={available}
                onValueChange={setAvailable}
                trackColor={{ false: colors.textMuted, true: colors.successLight }}
                thumbColor={available ? colors.success : colors.surface}
              />
            </View>

            <View style={styles.statusIndicator}>
              <Badge
                text={available ? 'Available for Rent' : 'Not Available'}
                variant={available ? 'success' : 'default'}
              />
            </View>
          </AppCard>
        </View>

        <View style={styles.submitSection}>
          <PrimaryButton
            title={loading ? 'Registering...' : 'Register Tractor'}
            onPress={handleSubmit}
            style={styles.submitButton}
            disabled={loading}
          />
          <Text style={[typography.caption, styles.disclaimer]}>
            By registering, you agree to our terms and conditions. All rentals are subject to verification.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  pageTitle: {
    marginBottom: spacing.sm,
    color: colors.primary,
  },
  pageSubtitle: {
    color: colors.textSecondary,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    marginBottom: spacing.lg,
    color: colors.primary,
  },
  pricePreview: {
    marginTop: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.surfaceSecondary || '#F5F7F6',
    borderRadius: 12,
  },
  previewLabel: {
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  previewItem: {
    alignItems: 'center',
  },
  previewType: {
    color: colors.textMuted,
    marginBottom: spacing.xs / 2,
  },
  previewPrice: {
    color: colors.primary,
  },
  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  availabilityInfo: {
    flex: 1,
    marginRight: spacing.lg,
  },
  availabilityLabel: {
    color: colors.text,
    marginBottom: spacing.xs,
  },
  availabilityHint: {
    color: colors.textSecondary,
  },
  statusIndicator: {
    alignItems: 'center',
  },
  submitSection: {
    marginTop: spacing.lg,
  },
  submitButton: {
    marginBottom: spacing.lg,
  },
  disclaimer: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
});