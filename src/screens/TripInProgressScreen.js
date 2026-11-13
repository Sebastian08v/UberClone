import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { TripContext } from '../context/TripContext';
import useDriverLocation from '../hooks/useDriverLocation';
import { getRoute } from '../services/mapService';
import { updateTripStatus, completeTrip } from '../services/tripService';
import { calculateFare } from '../utils/calculateFare';
import {COMMISSION_RATE} from '../config/pricing';

export default function TripInProgressScreen() {
  const navigation = useNavigation();
  const { activeTrip, setActiveTrip } = useContext(TripContext);
  const { location, error } = useDriverLocation(true);

  const [route, setRoute] = useState(null);
  const [routeError, setRouteError] = useState(null);
  const [busy, setBusy] = useState(false);
  const routeRequested = useRef(false);
  const mapRef = useRef(null);

  const isOnBoard = activeTrip?.status === 'in_progress';
  const target = activeTrip
    ? isOnBoard
      ? activeTrip.destination
      : activeTrip.origin
    : null;

  // 1. Al entrar: accepted -> driver_arriving
  useEffect(() => {
    if (!activeTrip || activeTrip.status !== 'accepted') return;
    updateTripStatus(activeTrip.id, 'driver_arriving')
      .then(() => setActiveTrip({ ...activeTrip, status: 'driver_arriving' }))
      .catch((e) => setRouteError(e.message));
  }, [activeTrip?.id]);

  // 2. Primera ruta (UNA sola vez)
  useEffect(() => {
    if (!location || !target || routeRequested.current) return;
    routeRequested.current = true;
    getRoute(location, { latitude: target.lat, longitude: target.lng })
      .then(setRoute)
      .catch((e) => setRouteError(e.message));
  }, [location, target]);

  // 3. Ajustar el mapa para que se vea toda la ruta
  useEffect(() => {
    if (route && mapRef.current) {
      mapRef.current.fitToCoordinates(route.coordinates, {
        edgePadding: { top: 80, right: 50, bottom: 220, left: 50 },
        animated: true,
      });
    }
  }, [route]);

  // 4. Pasajero a bordo: in_progress y ruta nueva hacia el destino
  const handlePassengerOnBoard = useCallback(async () => {
    if (!location || busy) return;
    setBusy(true);
    setRouteError(null);
    try {
      await updateTripStatus(activeTrip.id, 'in_progress');
      setActiveTrip({ ...activeTrip, status: 'in_progress' });
      const newRoute = await getRoute(location, {
        latitude: activeTrip.destination.lat,
        longitude: activeTrip.destination.lng,
      });
      setRoute(newRoute);
    } catch (e) {
      setRouteError(e.message);
    } finally {
      setBusy(false);
    }
  }, [location, busy, activeTrip, setActiveTrip]);

  // 5. Finalizar viaje: calcula tarifa, guarda commissionRate y pasa a completed
   // 5. Finalizar viaje: calcula tarifa, guarda commissionRate y la ruta, y pasa a completed
  const handleFinishTrip = useCallback(async () => {
    console.log('Finalizar presionado');
    if (busy) return;
    setBusy(true);
    setRouteError(null);
    try {
      const tip = 0;
      const { fare, commission, driverEarnings } = calculateFare({
        distanceKm: activeTrip.distanceKm,
        durationMin: activeTrip.durationMin,
        category: activeTrip.category,
        tip,
      });
      const data = {
        fare,
        commission,
        tip,
        driverEarnings,
        commissionRate: COMMISSION_RATE,
        // AI-assisted: see docs/AI_LOG.md
        ...(route?.encodedPolyline ? { routePolyline: route.encodedPolyline } : {}),
      };
      await completeTrip(activeTrip.id, data);
      setActiveTrip({ ...activeTrip, ...data, status: 'completed' });
      navigation.navigate('PaymentSummary', { tripId: activeTrip.id });
    } catch (e) {
      console.log('Error al finalizar:', e.message);
      setRouteError(e.message);
      setBusy(false);
    }
  }, [busy, activeTrip, setActiveTrip, navigation, route]);

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
          coordinate={{ latitude: target.lat, longitude: target.lng }}
          title={isOnBoard ? 'Destino' : 'Punto de recogida'}
          description={target.address}
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
        <Text style={styles.title}>
          {isOnBoard ? 'Hacia el destino' : 'Hacia el punto de recogida'}
        </Text>
        <Text>{target.address}</Text>
        {route && (
          <Text style={styles.info}>
            {route.distanceKm} km · {route.durationMin} min
          </Text>
        )}
        {routeError && <Text style={styles.error}>{routeError}</Text>}

        {!isOnBoard ? (
          <TouchableOpacity
            style={[styles.btn, busy && styles.btnDisabled]}
            onPress={handlePassengerOnBoard}
            disabled={busy}
          >
            <Text style={styles.btnText}>Pasajero a bordo</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.btn, styles.btnFinish, busy && styles.btnDisabled]}
            onPress={handleFinishTrip}
            disabled={busy}
          >
            <Text style={styles.btnText}>Finalizar viaje</Text>
          </TouchableOpacity>
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
    elevation: 4,
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  info: { marginTop: 6, fontWeight: 'bold' },
  error: { marginTop: 6, color: '#c62828' },
  btn: {
    marginTop: 12,
    backgroundColor: '#1a7f37',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnFinish: { backgroundColor: '#c62828' },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: '#fff', fontWeight: 'bold' },
});