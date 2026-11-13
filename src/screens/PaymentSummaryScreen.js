import { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { openCheckout } from '../services/paymentService';
import { markCashPaid } from '../services/tripService';
import formatCurrency from '../utils/formatCurrency';

function getPaymentLabel(trip) {
  if (trip.paymentMethod === 'cash') return 'Efectivo';
  switch (trip.paymentStatus) {
    case 'approved':
      return 'Aprobado';
    case 'rejected':
      return 'Rechazado';
    default:
      return 'Pendiente'; // pending, in_process o aún sin pago
  }
}

export default function PaymentSummaryScreen({ route }) {
  const { tripId } = route.params;
  const [trip, setTrip] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'trips', tripId),
      (snapshot) => {
        if (snapshot.exists()) {
          setTrip(snapshot.data());
        } else {
          setError('No se encontró el viaje.');
        }
      },
      (err) => setError(err.message)
    );

    return unsubscribe; // limpieza: se cierra la suscripción al salir
  }, [tripId]);

  const handlePay = async () => {
    try {
      await openCheckout(tripId, trip.fare);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCashReceived = async () => {
  if (busy) return;
  setBusy(true);
  try {
    await markCashPaid(tripId, trip.driverId, trip.commission);
  } catch (err) {
    setError(err.message);
    setBusy(false);
  }
};

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!trip) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const label = getPaymentLabel(trip);
  const canPay = trip.status === 'completed' && trip.paymentMethod !== 'cash';
const canCollectCash = trip.status === 'completed' && trip.paymentMethod === 'cash';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resumen del cobro</Text>

      <View style={styles.row}>
        <Text>Tarifa final</Text>
        <Text style={styles.value}>{formatCurrency(trip.fare)}</Text>
      </View>
      <View style={styles.row}>
        <Text>Comisión</Text>
        <Text style={styles.value}>{formatCurrency(trip.commission)}</Text>
      </View>
      <View style={styles.row}>
        <Text>Ganancia neta</Text>
        <Text style={styles.value}>{formatCurrency(trip.driverEarnings)}</Text>
      </View>
      <View style={styles.row}>
        <Text>Estado del pago</Text>
        <Text style={styles.value}>{label}</Text>
      </View>

      {canPay && <Button title="Cobrar con Mercado Pago" onPress={handlePay} />}
      {canCollectCash && (
        <Button title="Cobro recibido (efectivo)" onPress={handleCashReceived} disabled={busy} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  value: { fontWeight: '600' },
  error: { color: 'red', textAlign: 'center' },
});