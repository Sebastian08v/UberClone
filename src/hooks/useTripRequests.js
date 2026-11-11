import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function useTripRequests(enabled) {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Si el conductor no está disponible, no se escucha nada
    if (!enabled) {
      setRequests([]);
      return;
    }

    const q = query(collection(db, 'trips'), where('status', '==', 'requested'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setRequests(list);
      },
      (err) => setError(err.message)
    );

    // Función de limpieza: cierra la suscripción al salir o al pasar a No disponible
    return () => unsubscribe();
  }, [enabled]);

  return { requests, error };
}