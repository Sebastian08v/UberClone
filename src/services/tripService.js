import {
  collection, addDoc, serverTimestamp, doc, updateDoc, writeBatch, increment,
  query, where, orderBy, limit, startAfter, getDocs,
} from 'firebase/firestore';
import { getDateRange } from '../utils/dateFilters';
import { db } from '../config/firebase';

// TEMPORAL: solo para desarrollo. 
const TEST_PLACES = [
  { lat: 6.2087, lng: -75.5678, address: 'Parque Lleras, Medellín' },
  { lat: 6.2518, lng: -75.5636, address: 'Centro Comercial Oviedo, Medellín' },
  { lat: 6.2442, lng: -75.5812, address: 'Estadio Atanasio Girardot, Medellín' },
  { lat: 6.2308, lng: -75.5906, address: 'Unicentro Medellín' },
];
const TEST_CATEGORIES = ['economy', 'xl', 'premium'];
const TEST_PAYMENTS = ['mercadopago', 'stripe', 'cash'];
export const TRIPS_PAGE_SIZE = 20;

const pick = (list) => list[Math.floor(Math.random() * list.length)];

export async function createTestTrip() {
  const origin = pick(TEST_PLACES);
  let destination = pick(TEST_PLACES);
  while (destination.address === origin.address) destination = pick(TEST_PLACES);

  return addDoc(collection(db, 'trips'), {
    status: 'requested',
    passengerId: 'test1',
    origin,
    destination,
    distanceKm: Math.round((2 + Math.random() * 13) * 10) / 10,
    durationMin: Math.round(8 + Math.random() * 30),
    category: pick(TEST_CATEGORIES),
    paymentMethod: pick(TEST_PAYMENTS),
    createdAt: serverTimestamp(),
  });
}

export async function acceptTrip(tripId, driverId) {
  return updateDoc(doc(db, 'trips', tripId), {
    status: 'accepted',
    driverId,
  });
}

export async function rejectTrip(tripId) {
  return updateDoc(doc(db, 'trips', tripId), {
    status: 'rejected',
  });
}

export async function updateTripStatus(tripId, status) {
  return updateDoc(doc(db, 'trips', tripId), { status });
}

export async function completeTrip(tripId, data) {
  return updateDoc(doc(db, 'trips', tripId), {
    ...data,
    status: 'completed',
    completedAt: serverTimestamp(),
  });
}

// AI-assisted: see docs/AI_LOG.md
export async function markCashPaid(tripId, driverId, commission) {
  // El batch hace las dos escrituras juntas: o se guardan las dos o ninguna
  const batch = writeBatch(db);
  batch.update(doc(db, 'trips', tripId), {
    status: 'paid',
    paymentMethod: 'cash',
  });
  batch.update(doc(db, 'drivers', driverId), {
    balance: increment(-commission), // si balance no existe, parte de 0
  });
  await batch.commit();
}

// AI-assisted: see docs/AI_LOG.md
export const getDriverTripsPage = async (driverId, lastDoc = null, filters = {}) => {
  const { dateType = 'all', from = null, to = null, method = 'all' } = filters;

  const constraints = [
    where('driverId', '==', driverId),
    where('status', 'in', ['completed', 'paid']),
  ];

  if (method !== 'all') {
    constraints.push(where('paymentMethod', '==', method));
  }

  // "range" solo filtra cuando ya hay fecha inicial y final
  const useDate = dateType !== 'all' && (dateType !== 'range' || (from && to));
  if (useDate) {
    const { start, end } = getDateRange(dateType, from, to);
    constraints.push(where('createdAt', '>=', start), where('createdAt', '<', end));
  }

  constraints.push(orderBy('createdAt', 'desc'));
  if (lastDoc) constraints.push(startAfter(lastDoc));
  constraints.push(limit(TRIPS_PAGE_SIZE));

  const snap = await getDocs(query(collection(db, 'trips'), ...constraints));
  return {
    trips: snap.docs.map((d) => ({ id: d.id, ...d.data() })),
    lastDoc: snap.docs[snap.docs.length - 1] ?? null,
    hasMore: snap.docs.length === TRIPS_PAGE_SIZE,
  };
};