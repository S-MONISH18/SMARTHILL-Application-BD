import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { tractorListings } from '../../data/mockData';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import { getAvailableTractors } from '../../services/apiService';

export default function AvailableTractorsScreen() {
  const navigation = useNavigation();
  const [tractors, setTractors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTractors();
  }, []);

  const fetchTractors = async () => {
    try {
      const result = await getAvailableTractors();
      if (result.success) {
        setTractors(result.data);
      } else {
        console.log('Failed to fetch tractors:', result.message);
        setTractors(tractorListings); // fallback to mock
      }
    } catch (error) {
      console.error('Error fetching tractors:', error);
      setTractors(tractorListings); // fallback to mock
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading tractors...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[typography.h2, styles.title]}>
          Available Tractors
        </Text>

        {tractors.map(item => (
          <View key={item.tractorId || item.id || `${item.model}-${item.ownerPhone}`} style={styles.card}>
            <Text style={styles.name}>{item.model || item.tractorModel}</Text>

            <Text style={styles.text}>Owner: {item.ownerName || 'Unknown'}</Text>
            <Text style={styles.text}>Number: {item.number || item.tractorNumber}</Text>
            <Text style={styles.text}>Location: {item.location}</Text>
            <Text style={styles.text}>
              Daily Rate: ₹{item.dailyRate}
            </Text>

            <Text
              style={[
                styles.text,
                {
                  color: item.status === 'Available' ? 'green' : 'red',
                  fontWeight: '600',
                },
              ]}
            >
              Status: {item.status || 'Available'}
            </Text>

            {/* 🔥 BOOK BUTTON */}
            {(item.status === 'Available' || !item.status) && (
              <TouchableOpacity
                style={styles.bookButton}
                onPress={() =>
                  navigation.navigate('BookTractor', {
                    tractor: {
                      model: item.model || item.tractorModel,
                      number: item.number || item.tractorNumber,
                      location: item.location,
                      dailyRate: item.dailyRate,
                      ownerName: item.ownerName || 'Unknown',
                      ownerPhone: item.ownerPhone || item.phone,
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