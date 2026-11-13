import { collection, addDoc, serverTimestamp, doc, updateDoc, writeBatch, increment } from 'firebase/firestore';
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