import React, { useState, useEffect, useMemo } from 'react';
import { View } from 'react-native';
import RequestCard from '../components/RequestCard';
import { calculateFare } from '../utils/calculateFare';

export default function IncomingRequestScreen({ route, navigation }) {
  const { request } = route.params;
  const [secondsLeft, setSecondsLeft] = useState(15);

  // Misma función pura que usa el cierre del viaje
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

  // Temporizador de 15 s con función de limpieza
  useEffect(() => {
    if (secondsLeft === 0) {
      // Rechazo automático: la lógica real se conecta en el commit 26
      console.log('Tiempo agotado: solicitud rechazada', request.id);
      navigation.goBack();
      return;
    }
    const timeoutId = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timeoutId);
  }, [secondsLeft]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#eee' }}>
      <RequestCard
        request={request}
        fare={fare}
        driverEarnings={driverEarnings}
        secondsLeft={secondsLeft}
        onAccept={() => console.log('Aceptar (commit 26)')}
        onReject={() => console.log('Rechazar (commit 26)')}
      />
    </View>
  );
}