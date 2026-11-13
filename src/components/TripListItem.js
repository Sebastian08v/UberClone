import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import  formatCurrency  from '../utils/formatCurrency';

const getPaymentLabel = (trip, t) => {
  if (trip.paymentMethod === 'cash') return t.history.paymentCash;
  switch (trip.paymentStatus) {
    case 'approved':
      return t.history.paymentApproved;
    case 'rejected':
      return t.history.paymentRejected;
    default:
      return t.history.paymentPending;
  }
};

export default function TripListItem({ trip, t, language, onPress }) {
  const date = trip.createdAt?.toDate?.();
  const dateText = date
    ? date.toLocaleString(language === 'es' ? 'es-CO' : 'en-US', {
        dateStyle: 'short',
        timeStyle: 'short',
      })
    : '';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.date}>{dateText}</Text>
      <Text style={styles.route} numberOfLines={2}>
        {trip.origin?.address} → {trip.destination?.address}
      </Text>
      <Text style={styles.category}>{t.vehicle[trip.category]}</Text>
      <View style={styles.row}>
        <Text>
          {t.history.fare}: {formatCurrency(trip.fare || 0)}
        </Text>
        <Text style={styles.bold}>
          {t.history.net}: {formatCurrency(trip.driverEarnings || 0)}
        </Text>
      </View>
      <Text style={styles.payment}>{getPaymentLabel(trip, t)}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2 },
  date: { color: '#777', fontSize: 12 },
  route: { fontSize: 15, fontWeight: '600', marginVertical: 4 },
  category: { color: '#555', marginBottom: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  bold: { fontWeight: 'bold' },
  payment: { marginTop: 6, color: '#333', fontWeight: '600' },
});