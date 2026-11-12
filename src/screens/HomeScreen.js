import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { createTestTrip } from '../services/tripService';
import { SessionContext } from '../context/SessionContext';
import useDriverLocation from '../hooks/useDriverLocation';
import useTripRequests from '../hooks/useTripRequests';
import {
  updateDriverAvailability,
  updateDriverLocation,
} from '../services/driverService';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { driver, approvalStatus, setApprovalStatus } =
    useContext(SessionContext);
  const driverId = driver?.id;

  const [available, setAvailable] = useState(false);
  const { location, error } = useDriverLocation(available);
  const isApproved = approvalStatus === 'approved';
  const { requests } = useTripRequests(available);
  const seenIds = useRef(new Set());

  useEffect(() => {
  // Busca la primera solicitud que todavía no se ha mostrado
    const next = requests.find((r) => !seenIds.current.has(r.id));
    if (next) {
      seenIds.current.add(next.id);
      navigation.navigate('IncomingRequestScreen', { request: next });
    }
  }, [requests, navigation]);

  // Escucha en tiempo real el estado de aprobación en Firestore
  useEffect(() => {
    if (!driverId) return;
    const unsubscribe = onSnapshot(doc(db, 'drivers', driverId), (snap) => {
      const status = snap.data()?.approvalStatus;
      if (status) setApprovalStatus(status);
    });
    return unsubscribe;
  }, [driverId]);

  // Guarda la ubicación solo mientras está Disponible
  useEffect(() => {
    if (driverId && available && location) {
      updateDriverLocation(driverId, location.latitude, location.longitude);
    }
  }, [available, location, driverId]);

  const toggleAvailability = (value) => {
    setAvailable(value);
    if (driverId) updateDriverAvailability(driverId, value);
  };

  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          ...location,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
      >
        <Marker coordinate={location} />
      </MapView>

      <View style={styles.panel}>
        <Text style={styles.status}>
          {available ? 'Disponible' : 'No disponible'}
        </Text>
        <Switch
          value={available}
          onValueChange={toggleAvailability}
          disabled={!isApproved}
        />
        {!isApproved && (
          <Text style={styles.hint}>Pendiente de aprobación</Text>
        )}
        {/* TEMPORAL: para desarrollo agil */}
        <TouchableOpacity style={styles.testBtn} onPress={createTestTrip}>
          <Text style={styles.testBtnText}>+ Solicitud de prueba</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  panel: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 4,
  },
  status: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  hint: { marginTop: 8, color: 'gray' },
  testBtn: {
    marginTop: 12,
    backgroundColor: '#eee',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  testBtnText: { color: '#333' },
});