import { useEffect, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

const toCoords = (position) => ({
  latitude: position.coords.latitude,
  longitude: position.coords.longitude,
});

export default function useDriverLocation(enabled = true) {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let watchId = null;
    let cancelled = false;

    const onInitialSuccess = (position) => {
      if (cancelled) return;
      setError('');
      setLocation(toCoords(position));
    };

    const startWatching = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          setError(`Permiso de ubicación: ${granted}`);
          return;
        }
      }

      if (cancelled) return;

      // Posición inicial: primero GPS (alta precisión)...
      Geolocation.getCurrentPosition(
        onInitialSuccess,
        () => {
          // ...y si vence, segundo intento con baja precisión (Wi-Fi / antenas)
          Geolocation.getCurrentPosition(
            onInitialSuccess,
            (err) => {
              if (!cancelled) setError(err.message);
            },
            { enableHighAccuracy: false, timeout: 20000, maximumAge: 60000 }
          );
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 }
      );

      // Seguimiento continuo: solo si está Disponible
      if (!enabled) return;

      watchId = Geolocation.watchPosition(
        (position) => {
          setError('');
          setLocation(toCoords(position));
        },
        (err) => setError(err.message),
        {
          enableHighAccuracy: true,
          distanceFilter: 10,
          interval: 5000,
          fastestInterval: 3000,
        }
      );
    };

    startWatching();

    // Cleanup: stop tracking when leaving the screen or when disabled
    return () => {
      cancelled = true;
      if (watchId !== null) {
        console.log('useDriverLocation: seguimiento detenido');
        Geolocation.clearWatch(watchId);
      }
    };
  }, [enabled]);

  return { location, error };
}