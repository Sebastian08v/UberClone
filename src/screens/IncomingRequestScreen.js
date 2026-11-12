import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
  useRef,
} from 'react';
import { View } from 'react-native';
import RequestCard from '../components/RequestCard';
import { calculateFare } from '../utils/calculateFare';
import { SessionContext } from '../context/SessionContext';
import { TripContext } from '../context/TripContext';
import { acceptTrip, rejectTrip } from '../services/tripService';

export default function IncomingRequestScreen({ route, navigation }) {
  const { request } = route.params;
  const { driver } = useContext(SessionContext);
  const { setActiveTrip } = useContext(TripContext);

  const [secondsLeft, setSecondsLeft] = useState(15);
  // Evita que se ejecute dos veces (por ejemplo, tocar Aceptar justo cuando llega a 0)
  const handled = useRef(false);

  const { fare, driverEarnings } = useMemo(
    () =>
      calculateFare({
        distanceKm: request.distanceKm,
        durationMin: request.durationMin,
        category: request.category,
        tip: 0,
      }),
    [request]
  );

  const handleAccept = useCallback(async () => {
    if (handled.current) return;
    handled.current = true;
    try {
      await acceptTrip(request.id, driver?.id);
      setActiveTrip({ ...request, status: 'accepted', driverId: driver?.id });
      navigation.replace('TripInProgress');
    } catch (e) {
      handled.current = false;
      console.log('Error al aceptar:', e.message);
    }
  }, [request, driver, navigation, setActiveTrip]);

  const handleReject = useCallback(async () => {
    if (handled.current) return;
    handled.current = true;
    try {
      await rejectTrip(request.id);
    } catch (e) {
      console.log('Error al rechazar:', e.message);
    }
    navigation.goBack();
  }, [request, navigation]);

  // Temporizador de 15 s con función de limpieza; a 0 se rechaza sola
  useEffect(() => {
    if (secondsLeft === 0) {
      handleReject();
      return;
    }
    const timeoutId = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timeoutId);
  }, [secondsLeft, handleReject]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#eee' }}>
      <RequestCard
        request={request}
        fare={fare}
        driverEarnings={driverEarnings}
        secondsLeft={secondsLeft}
        onAccept={handleAccept}
        onReject={handleReject}
      />
    </View>
  );
}