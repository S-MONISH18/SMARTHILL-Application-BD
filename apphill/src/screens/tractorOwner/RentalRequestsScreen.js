import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';

import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

import AppCard from '../../components/AppCard';
import Badge from '../../components/Badge';

import { useAuth } from '../../context/AuthContext';
import {
  getOwnerRequests,
  updateBookingStatus,
  deleteBooking,
} from '../../services/apiService';

export default function RentalRequestsScreen() {
  const { currentUser } = useAuth();

  const [requests, setRequests] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  //////////////////////////////////////////////////////
  // 🔥 LOAD DATA
  //////////////////////////////////////////////////////
  const loadRequests = async () => {
    const ownerId = currentUser.phone || currentUser.name;
    console.log('📲 LOADING REQUESTS FOR OWNER:', ownerId);
    const res = await getOwnerRequests(ownerId);

    if (res.success) {
      console.log('📥 RECEIVED REQUESTS:', JSON.stringify(res.data, null, 2));
      // Sort: Pending first, then Accepted, then Rejected at bottom
      const sorted = (res.data || []).sort((a, b) => {
        const statusOrder = { 'Pending': 0, 'Accepted': 1, 'Rejected': 2 };
        return (statusOrder[a.status] || 999) - (statusOrder[b.status] || 999);
      });
      setRequests(sorted);
    }
  };

  //////////////////////////////////////////////////////
  // 🔥 AUTO REFRESH
  //////////////////////////////////////////////////////
  useEffect(() => {
    loadRequests();

    const interval = setInterval(() => {
      loadRequests();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  //////////////////////////////////////////////////////
  // 🔥 UPDATE STATUS
  //////////////////////////////////////////////////////
  const handleAction = async (bookingId, status) => {
    setLoadingId(bookingId);

    const res = await updateBookingStatus(bookingId, status);

    setLoadingId(null);

    if (res.success) {
      Alert.alert('Success', `Booking ${status}`);
      loadRequests();
    } else {
      Alert.alert('Error', 'Failed to update booking');
    }
  };

  //////////////////////////////////////////////////////
  // 🗑️ DELETE BOOKING
  //////////////////////////////////////////////////////
  const handleDelete = async (bookingId) => {
    Alert.alert(
      'Delete Request',
      'Are you sure you want to delete this booking request?',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            if (!bookingId) {
              console.error('Delete action failed: bookingId missing');
              Alert.alert('Error', 'Booking ID missing, cannot delete.');
              return;
            }

            setLoadingId(bookingId);
            console.log('📤 Deleting booking:', bookingId);
            const res = await deleteBooking(bookingId);
            console.log('📤 Delete booking response:', res);
            setLoadingId(null);

            if (res.success) {
              Alert.alert('Success', 'Booking deleted');
              loadRequests();
            } else {
              Alert.alert('Error', `Failed to delete booking: ${res.message || 'Unknown'}`);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  //////////////////////////////////////////////////////
  // FORMAT DATE 🔥 FIX
  //////////////////////////////////////////////////////
  const formatDate = (date) => {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleString();
  };

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[typography.h2, styles.title]}>
          Rental Requests
        </Text>

        <Text style={[typography.body, styles.subtitle]}>
          Review incoming booking requests
        </Text>

        {requests.length === 0 && (
          <Text style={styles.empty}>No requests found</Text>
        )}

        {requests.map(item => (
          <AppCard key={item.bookingId} style={styles.card}>
            
            {/* HEADER */}
            <View style={styles.headerRow}>
              <View style={styles.headerInfo}>
                <Text style={[typography.h4, styles.requester]}>
                  {item.farmerName || 'Unknown Farmer'}
                </Text>
                <Text style={[typography.body, styles.phone]}>
                  📞 {item.farmerPhone}
                </Text>
                <Text style={[typography.caption, styles.role]}>
                  Booking Request
                </Text>
              </View>

              <View style={styles.headerActions}>
                <View style={styles.badgeWrapper}>
                  <Badge
                    text={item.status}
                    variant={
                      item.status === 'Accepted'
                        ? 'success'
                        : item.status === 'Rejected'
                        ? 'danger'
                        : 'default'
                    }
                  />
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item.bookingId || item.id)}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* TRACTOR */}
            <View style={styles.infoBlock}>
              <Text style={styles.label}>Tractor</Text>
              <Text style={styles.value}>{item.tractorModel}</Text>
            </View>

            {/* DATE RANGE 🔥 FIX */}
            <View style={styles.infoBlock}>
              <Text style={styles.label}>From</Text>
              <Text style={styles.value}>{formatDate(item.fromDate)}</Text>
            </View>

            <View style={styles.infoBlock}>
              <Text style={styles.label}>To</Text>
              <Text style={styles.value}>{formatDate(item.toDate)}</Text>
            </View>

            {/* HOURS */}
            <View style={styles.infoBlock}>
              <Text style={styles.label}>Hours</Text>
              <Text style={styles.value}>{item.hours}</Text>
            </View>

            {/* TOTAL */}
            <View style={styles.infoBlock}>
              <Text style={styles.label}>Total</Text>
              <Text style={styles.value}>₹{item.total}</Text>
            </View>

            {/* ACTION BUTTONS */}
            {item.status === 'Pending' && (
              <View style={styles.actionRow}>
                {loadingId === item.bookingId ? (
                  <Text style={{ marginTop: 10 }}>Updating...</Text>
                ) : (
                  <>
                    <TouchableOpacity
                      style={styles.acceptButton}
                      onPress={() =>
                        handleAction(item.bookingId, 'Accepted')
                      }
                    >
                      <Text style={styles.acceptText}>Accept</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.rejectButton}
                      onPress={() =>
                        handleAction(item.bookingId, 'Rejected')
                      }
                    >
                      <Text style={styles.rejectText}>Reject</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            )}
          </AppCard>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

//////////////////////////////////////////////////////
// STYLES
//////////////////////////////////////////////////////
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },

  title: {
    color: colors.primary,
    marginBottom: spacing.sm,
  },

  subtitle: {
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },

  card: {
    marginBottom: spacing.lg,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },

  headerInfo: {
    flex: 1,
  },

  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },

  badgeWrapper: {
    marginRight: spacing.sm,
  },

  requester: {
    color: colors.text,
  },

  phone: {
    color: colors.primary,
    fontWeight: '600',
    marginVertical: spacing.xs,
  },

  role: {
    color: colors.textSecondary,
  },

  deleteButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 70,
  },

  deleteButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  infoBlock: {
    marginBottom: spacing.md,
  },

  label: {
    color: colors.textSecondary,
  },

  value: {
    color: colors.text,
    fontWeight: '500',
  },

  actionRow: {
    flexDirection: 'row',
    marginTop: spacing.md,
  },

  acceptButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },

  rejectButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  acceptText: {
    color: '#fff',
    fontWeight: '700',
  },

  rejectText: {
    color: '#000',
    fontWeight: '700',
  },

  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: colors.textSecondary,
  },
});