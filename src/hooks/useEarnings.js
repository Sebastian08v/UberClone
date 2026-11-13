import { useEffect, useMemo, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { getDateRange } from '../utils/dateFilters';

const PERIODS = ['today', 'week', 'month'];

export default function useEarnings(driverId) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!driverId) return;
    const q = query(
      collection(db, 'trips'),
      where('driverId', '==', driverId),
      where('status', 'in', ['completed', 'paid'])
    );
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setTrips(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      },
      (error) => {
        console.log('useEarnings error:', error);
        setLoading(false);
      }
    );
    return unsubscribe; // limpieza de la suscripción
  }, [driverId]);

  const summaries = useMemo(() => {
    const result = {};
    PERIODS.forEach((period) => {
      const { start, end } = getDateRange(period);
      const list = trips.filter((trip) => {
        const date = trip.completedAt?.toDate?.();
        return date && date >= start && date < end;
      });
      const count = list.length;
      const net = list.reduce((acc, t) => acc + (t.driverEarnings || 0), 0);
      result[period] = {
        count,
        billed: list.reduce((acc, t) => acc + (t.fare || 0), 0),
        commissions: list.reduce((acc, t) => acc + (t.commission || 0), 0),
        tips: list.reduce((acc, t) => acc + (t.tip || 0), 0),
        net,
        average: count ? Math.round(net / count) : 0,
      };
    });
    return result;
  }, [trips]);

  // Saldo: viajes pagados por pasarela suman la ganancia; en efectivo se resta la comisión
  const balance = useMemo(
    () =>
      trips
        .filter((t) => t.status === 'paid')
        .reduce(
          (acc, t) =>
            t.paymentMethod === 'cash'
              ? acc - (t.commission || 0)
              : acc + (t.driverEarnings || 0),
          0
        ),
    [trips]
  );

  return { summaries, balance, loading };
}