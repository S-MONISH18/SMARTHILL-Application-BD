import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function BookTractorScreen({ route, navigation }) {
  const { tractor } = route.params;

  const [fromDateTime, setFromDateTime] = useState(null);
  const [toDateTime, setToDateTime] = useState(null);

  const [showFromDate, setShowFromDate] = useState(false);
  const [showFromTime, setShowFromTime] = useState(false);

  const [showToDate, setShowToDate] = useState(false);
  const [showToTime, setShowToTime] = useState(false);

  const formatDateTime = date =>
    date
      ? `${date.toISOString().split('T')[0]} ${date.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}`
      : 'Select Date & Time';

  // FROM DATE
  const onChangeFromDate = (e, selected) => {
    setShowFromDate(false);
    if (selected) {
      const updated = new Date(selected);
      setFromDateTime(prev =>
        prev ? new Date(updated.setHours(prev.getHours(), prev.getMinutes())) : updated
      );
      setShowFromTime(true);
    }
  };

  // FROM TIME
  const onChangeFromTime = (e, selected) => {
    setShowFromTime(false);
    if (selected && fromDateTime) {
      const updated = new Date(fromDateTime);
      updated.setHours(selected.getHours(), selected.getMinutes());
      setFromDateTime(updated);
    }
  };

  // TO DATE
  const onChangeToDate = (e, selected) => {
    setShowToDate(false);
    if (selected) {
      const updated = new Date(selected);
      setToDateTime(prev =>
        prev ? new Date(updated.setHours(prev.getHours(), prev.getMinutes())) : updated
      );
      setShowToTime(true);
    }
  };

  // TO TIME
  const onChangeToTime = (e, selected) => {
    setShowToTime(false);
    if (selected && toDateTime) {
      const updated = new Date(toDateTime);
      updated.setHours(selected.getHours(), selected.getMinutes());
      setToDateTime(updated);
    }
  };

  // CALCULATE HOURS
  const calculateHours = () => {
    if (!fromDateTime || !toDateTime) return 0;
    const diff =
      (toDateTime.getTime() - fromDateTime.getTime()) / (1000 * 60 * 60);
    return diff > 0 ? Math.ceil(diff) : 0;
  };

  const hours = calculateHours();

  const total =
    hours > 0
      ? hours * parseInt(tractor.hourlyRate || 0) ||
        Math.ceil(hours / 24) * parseInt(tractor.dailyRate)
      : 0;

  const handleBooking = () => {
    if (!fromDateTime || !toDateTime) {
      Alert.alert('Error', 'Select date & time');
      return;
    }

    if (hours <= 0) {
      Alert.alert('Error', 'Invalid time selection');
      return;
    }

    Alert.alert(
      'Booking Confirmed',
      `Hours: ${hours}\nTotal: ₹${total}`
    );

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book Tractor</Text>

      <Text style={styles.label}>Model</Text>
      <Text style={styles.value}>{tractor.model}</Text>

      <Text style={styles.label}>Daily Rate</Text>
      <Text style={styles.value}>₹{tractor.dailyRate}</Text>

      {/* FROM */}
      <Text style={styles.label}>From</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowFromDate(true)}
      >
        <Text>{formatDateTime(fromDateTime)}</Text>
      </TouchableOpacity>

      {showFromDate && (
        <DateTimePicker
          value={fromDateTime || new Date()}
          mode="date"
          onChange={onChangeFromDate}
        />
      )}

      {showFromTime && (
        <DateTimePicker
          value={fromDateTime || new Date()}
          mode="time"
          onChange={onChangeFromTime}
        />
      )}

      {/* TO */}
      <Text style={styles.label}>To</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowToDate(true)}
      >
        <Text>{formatDateTime(toDateTime)}</Text>
      </TouchableOpacity>

      {showToDate && (
        <DateTimePicker
          value={toDateTime || new Date()}
          mode="date"
          onChange={onChangeToDate}
        />
      )}

      {showToTime && (
        <DateTimePicker
          value={toDateTime || new Date()}
          mode="time"
          onChange={onChangeToTime}
        />
      )}

      {/* SUMMARY */}
      <View style={styles.summary}>
        <Text>Hours: {hours}</Text>
        <Text>Total: ₹{total}</Text>
      </View>

      {/* BUTTON */}
      <TouchableOpacity style={styles.button} onPress={handleBooking}>
        <Text style={styles.buttonText}>Confirm Booking</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  label: { marginTop: 15, fontWeight: '600' },
  value: { marginBottom: 10 },
  input: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 5,
  },
  summary: { marginTop: 20 },
  button: {
    marginTop: 30,
    backgroundColor: '#2e7d32',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '600' },
});