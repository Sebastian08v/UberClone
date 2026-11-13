// AI-assisted: see docs/AI_LOG.md
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { SessionContext } from '../context/SessionContext';
import { getTripById } from '../services/tripService';
import decodePolyline from '../utils/decodePolyline';
import formatCurrency from '../utils/formatCurrency';

function Row({ label, value, bold }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={bold ? styles.bold : null}>{value}</Text>
    </View>
  );
}

export default function TripDetailScreen({ route }) {
  const { tripId } = route.params;
  const { t, language } = useContext(SessionContext);
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    getTripById(tripId)
      .then(setTrip)
      .catch((e) => console.log('TripDetail error:', e))
      .finally(() => setLoading(false));
  }, [tripId]);

  // La ruta sale del texto guardado: no se llama a Directions
  const coordinates = useMemo(
    () => (trip?.routePolyline ? decodePolyline(trip.routePolyline) : []),
    [trip]
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!trip) {
    return (
      <View style={styles.center}>
        <Text>{t.tripDetail.notFound}</Text>
      </View>
    );
  }

  const origin = { latitude: trip.origin.lat, longitude: trip.origin.lng };
  const destination = { latitude: trip.destination.lat, longitude: trip.destination.lng };
  const fitPoints = coordinates.length ? coordinates : [origin, destination];

  const date = trip.createdAt?.toDate?.();
  const dateText = date
    ? date.toLocaleString(language === 'es' ? 'es-CO' : 'en-US', {
        dateStyle: 'short',
        timeStyle: 'short',
      })
    : '';

  return (
    <ScrollView>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{ ...origin, latitudeDelta: 0.05, longitudeDelta: 0.05 }}
        onMapReady={() =>
          mapRef.current?.fitToCoordinates(fitPoints, {
            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
            animated: false,
          })
        }
      >
        <Marker coordinate={origin} title={t.tripDetail.origin} description={trip.origin.address} />
        <Marker coordinate={destination} title={t.tripDetail.destination} description={trip.destination.address} />
        {coordinates.length > 0 && (
          <Polyline coordinates={coordinates} strokeWidth={5} strokeColor="#1a73e8" />
        )}
      </MapView>

      <View style={styles.info}>
        <Text style={styles.date}>{dateText}</Text>
        <Text style={styles.route}>
          {trip.origin.address} → {trip.destination.address}
        </Text>
        {coordinates.length === 0 && <Text style={styles.warn}>{t.tripDetail.noRoute}</Text>}

        <Row label={t.tripDetail.duration} value={`${trip.durationMin} min`} />
        <Row label={t.tripDetail.distance} value={`${trip.distanceKm} km`} />
        <Row label={t.history.fare} value={formatCurrency(trip.fare || 0)} />
        <Row
          label={`${t.tripDetail.commission} (${Math.round((trip.commissionRate || 0) * 100)}%)`}
          value={formatCurrency(trip.commission || 0)}
        />
        <Row label={t.tripDetail.tip} value={formatCurrency(trip.tip || 0)} />
        <Row label={t.history.net} value={formatCurrency(trip.driverEarnings || 0)} bold />
        <Row label={t.tripDetail.rating} value={trip.rating ? `${trip.rating} / 5` : '—'} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  map: { height: 300 },
  info: { padding: 16 },
  date: { color: '#777', fontSize: 12 },
  route: { fontSize: 16, fontWeight: '600', marginVertical: 8 },
  warn: { color: '#c62828', marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  label: { color: '#555' },
  bold: { fontWeight: 'bold' },
});