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

export default function AvailableTractorsScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[typography.h2, styles.title]}>
          Available Tractors
        </Text>

        {tractorListings.map(item => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.name}>{item.tractorModel}</Text>

            <Text style={styles.text}>Owner: {item.ownerName}</Text>
            <Text style={styles.text}>Number: {item.tractorNumber}</Text>
            <Text style={styles.text}>Location: {item.location}</Text>
            <Text style={styles.text}>
              Hourly Rate: ₹{item.hourlyRate}
            </Text>
            <Text style={styles.text}>
              Daily Rate: ₹{item.dailyRate}
            </Text>

            <Text
              style={[
                styles.text,
                {
                  color: item.available
                    ? colors.success || 'green'
                    : colors.error || 'red',
                  fontWeight: '600',
                },
              ]}
            >
              Status: {item.available ? 'Available' : 'Not Available'}
            </Text>

            {/* 🔥 BOOK BUTTON */}
            {item.available && (
              <TouchableOpacity
                style={styles.bookButton}
                onPress={() =>
                  navigation.navigate('BookTractor', {
                    tractor: {
                      model: item.tractorModel,
                      number: item.tractorNumber,
                      location: item.location,
                      dailyRate: item.dailyRate,
                    },
                  })
                }
              >
                <Text style={styles.bookButtonText}>Book</Text>
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
    color: colors.text,
    marginBottom: spacing.sm,
  },
  text: {
    color: colors.textSecondary,
    marginBottom: 4,
  },

  // 🔥 BUTTON STYLES
  bookButton: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});