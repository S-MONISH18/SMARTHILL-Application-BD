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
import { getAvailableTractors } from '../../services/apiService';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function RentTractorScreen() {
  const navigation = useNavigation();
  const [tractors, setTractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTractors = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getAvailableTractors();

        if (response.success && Array.isArray(response.data)) {
          setTractors(response.data);
        } else {
          // fallback to static mock data if backend is not ready
          setError(response.message || 'Unable to fetch tractors, showing mock data');
          setTractors(tractorListings);
        }
      } catch (err) {
        console.error('Error fetching available tractors:', err);
        setError('Unable to fetch tractors, using offline mock data');
        setTractors(tractorListings);
      } finally {
        setLoading(false);
      }
    };

    loadTractors();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[typography.body, styles.loadingText]}>Loading tractors...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        {/* Title */}
        <Text style={[typography.h2, styles.title]}>
          Available Tractors
        </Text>

        {error ? (
          <Text style={[typography.body, styles.errorText]}>{error}</Text>
        ) : null}

        {tractors.length === 0 ? (
          <Text style={[typography.body, styles.emptyText]}>No tractors available</Text>
        ) : (
          tractors.map(item => (
            <View key={item.tractorId || item.id || item.number || `${item.model}-${item.ownerPhone}`} style={styles.card}>
            
            {/* Tractor Name */}
            <Text style={styles.name}>{item.model || item.tractorModel}</Text>

            {/* Details */}
            <Text style={styles.text}>Owner: {item.ownerName || item.owner}</Text>
            <Text style={styles.text}>Number: {item.number || item.tractorNumber}</Text>
            <Text style={styles.text}>Location: {item.location}</Text>
            <Text style={styles.text}>Hourly Rate: ₹{item.hourlyRate || item.dailyRate}</Text>
            <Text style={styles.text}>Daily Rate: ₹{item.dailyRate}</Text>

            {/* Status */}
            <Text
              style={[
                styles.status,
                {
                  color:
                    (item.status || (item.available ? 'Available' : 'Not Available')) === 'Available'
                      ? 'green'
                      : 'red',
                },
              ]}
            >
              Status: {(item.status || (item.available ? 'Available' : 'Not Available'))}
            </Text>

            {/* ✅ Book Button */}
            {((item.status || (item.available ? 'Available' : 'Not Available')) === 'Available') && (
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  navigation.navigate('BookTractorScreen', {
                    tractor: {
                      id: item.tractorId || item.id,
                      tractorModel: item.model || item.tractorModel,
                      ownerName: item.ownerName || item.owner || item.ownerPhone || 'Unknown Owner',
                      phone: item.ownerPhone || item.phone,
                      location: item.location,
                      hourlyRate: item.hourlyRate || item.dailyRate,
                      dailyRate: item.dailyRate,
                      status: item.status || 'Available',
                    },
                  })
                }
              >
                <Text style={styles.buttonText}>Book</Text>
              </TouchableOpacity>
            )}
          </View>
        ))) }

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

  loadingCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: spacing.sm,
    color: colors.textSecondary,
  },

  errorText: {
    color: 'red',
    marginBottom: spacing.sm,
  },

  emptyText: {
    color: colors.textSecondary,
    marginBottom: spacing.md,
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