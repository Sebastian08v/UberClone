import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import formatCurrency from '../utils/formatCurrency';

export default function RequestCard({
  request,
  fare,
  driverEarnings,
  secondsLeft,
  onAccept,
  onReject,
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.timer}>{secondsLeft} s</Text>

      <Text style={styles.label}>Origen</Text>
      <Text style={styles.value}>{request.origin.address}</Text>

      <Text style={styles.label}>Destino</Text>
      <Text style={styles.value}>{request.destination.address}</Text>

      <Text style={styles.value}>
        {request.distanceKm} km · {request.durationMin} min
      </Text>
      <Text style={styles.value}>Categoría: {request.category}</Text>
      <Text style={styles.value}>Pago: {request.paymentMethod}</Text>

      <Text style={styles.fare}>Tarifa estimada: {formatCurrency(fare)}</Text>
      <Text style={styles.earnings}>
        Tu ganancia neta: {formatCurrency(driverEarnings)}
      </Text>

      <View style={styles.row}>
        <TouchableOpacity style={[styles.btn, styles.reject]} onPress={onReject}>
          <Text style={styles.btnText}>Rechazar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.accept]} onPress={onAccept}>
          <Text style={styles.btnText}>Aceptar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', margin: 16, padding: 20, borderRadius: 12, elevation: 4 },
  timer: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 12 },
  label: { fontSize: 12, color: '#666', marginTop: 8 },
  value: { fontSize: 16, marginTop: 2 },
  fare: { fontSize: 18, fontWeight: 'bold', marginTop: 16 },
  earnings: { fontSize: 18, color: '#1a7f37', fontWeight: 'bold', marginTop: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  btn: { flex: 1, padding: 14, borderRadius: 8, marginHorizontal: 4, alignItems: 'center' },
  accept: { backgroundColor: '#1a7f37' },
  reject: { backgroundColor: '#c62828' },
  btnText: { color: '#fff', fontWeight: 'bold' },
});