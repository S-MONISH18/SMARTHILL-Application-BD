import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { tractorListings } from '../../data/mockData';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function RentTractorScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Title */}
        <Text style={[typography.h2, styles.title]}>
          Available Tractors
        </Text>

        {tractorListings.map(item => (
          <View key={item.id} style={styles.card}>
            
            {/* Tractor Name */}
            <Text style={styles.name}>{item.tractorModel}</Text>

            {/* Details */}
            <Text style={styles.text}>Owner: {item.ownerName}</Text>
            <Text style={styles.text}>Number: {item.tractorNumber}</Text>
            <Text style={styles.text}>Location: {item.location}</Text>
            <Text style={styles.text}>Hourly Rate: ₹{item.hourlyRate}</Text>
            <Text style={styles.text}>Daily Rate: ₹{item.dailyRate}</Text>

            {/* Status */}
            <Text
              style={[
                styles.status,
                { color: item.available ? 'green' : 'red' },
              ]}
            >
              Status: {item.available ? 'Available' : 'Not Available'}
            </Text>

            {/* ✅ Book Button */}
            {item.available && (
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  navigation.navigate('BookTractorScreen', {
                    tractor: item,
                  })
                }
              >
                <Text style={styles.buttonText}>Book</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },

  title: {
    color: colors.primary,
    marginBottom: spacing.lg,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.md,
  },

  name: {
    fontWeight: '700',
    fontSize: 16,
    color: colors.text,
    marginBottom: spacing.sm,
  },

  text: {
    color: colors.textSecondary,
    marginBottom: 4,
  },

  status: {
    marginTop: spacing.sm,
    fontWeight: '600',
  },

  button: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});