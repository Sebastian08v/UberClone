import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import useTripRequests from '../hooks/useTripRequests';
import MapView, { Marker } from 'react-native-maps';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { SessionContext } from '../context/SessionContext';
import useDriverLocation from '../hooks/useDriverLocation';
import {
  updateDriverAvailability,
  updateDriverLocation,
} from '../services/driverService';

export default function HomeScreen() {
  const { driver, approvalStatus, setApprovalStatus } =
    useContext(SessionContext);
  const driverId = driver?.id;

  const [available, setAvailable] = useState(false);
  const { location, error } = useDriverLocation(available);
  const isApproved = approvalStatus === 'approved';
  const { requests, error1 } = useTripRequests(available);

  useEffect(() => {
    console.log('Solicitudes:', requests.length, error1);
  }, [requests, error1]);
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
});