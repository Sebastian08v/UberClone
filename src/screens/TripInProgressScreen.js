import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { TripContext } from '../context/TripContext';
import useDriverLocation from '../hooks/useDriverLocation';
import { getRoute } from '../services/mapService';
import { updateTripStatus } from '../services/tripService';

export default function TripInProgressScreen() {
  const { activeTrip, setActiveTrip } = useContext(TripContext);
  const { location, error } = useDriverLocation(true);

  const [route, setRoute] = useState(null);
  const [routeError, setRouteError] = useState(null);
  const routeRequested = useRef(false);
  const mapRef = useRef(null);

  // 1. Al entrar: accepted -> driver_arriving
  useEffect(() => {
    if (!activeTrip || activeTrip.status !== 'accepted') return;
    updateTripStatus(activeTrip.id, 'driver_arriving')
      .then(() => setActiveTrip({ ...activeTrip, status: 'driver_arriving' }))
      .catch((e) => setRouteError(e.message));
  }, [activeTrip?.id]);

  // 2. Cuando hay ubicación: pedir la ruta UNA sola vez
  useEffect(() => {
    if (!location || !activeTrip || routeRequested.current) return;
    routeRequested.current = true;
    getRoute(location, {
      latitude: activeTrip.origin.lat,
      longitude: activeTrip.origin.lng,
    })
      .then(setRoute)
      .catch((e) => setRouteError(e.message));
  }, [location, activeTrip]);

  // 3. Ajustar el mapa para que se vea toda la ruta
  useEffect(() => {
    if (route && mapRef.current) {
      mapRef.current.fitToCoordinates(route.coordinates, {
        edgePadding: { top: 80, right: 50, bottom: 200, left: 50 },
        animated: true,
      });
    }
  }, [route]);

  if (!activeTrip) {
    return (
      <View style={styles.center}>
        <Text>No hay un viaje activo</Text>
      </View>
    );
  }

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
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          ...location,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        showsUserLocation
      >
        <Marker
          coordinate={{
            latitude: activeTrip.origin.lat,
            longitude: activeTrip.origin.lng,
          }}
          title="Punto de recogida"
          description={activeTrip.origin.address}
        />
        {route && (
          <Polyline
            coordinates={route.coordinates}
            strokeWidth={5}
            strokeColor="#1a73e8"
          />
        )}
      </MapView>

      <View style={styles.panel}>
        <Text style={styles.title}>Hacia el punto de recogida</Text>
        <Text>{activeTrip.origin.address}</Text>
        {route && (
          <Text style={styles.info}>
            {route.distanceKm} km · {route.durationMin} min
          </Text>
        )}
        {routeError && <Text style={styles.error}>{routeError}</Text>}
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
    elevation: 4,
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  info: { marginTop: 6, fontWeight: 'bold' },
  error: { marginTop: 6, color: '#c62828' },
});