import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { uploadImage, IMAGE_FOLDERS } from './imageService';

const driversRef = collection(db, 'drivers');

// Guarda al conductor con estado 'pending' y las URL de sus fotos.
// Lanza Error('emailTaken') si el correo ya está registrado.
export async function registerDriver({ personal, vehicle, language }) {
  const email = personal.email.trim().toLowerCase();

  const existing = await getDocs(
    query(driversRef, where('email', '==', email), limit(1))
  );
  if (!existing.empty) {
    throw new Error('emailTaken');
  }

  const [profilePhotoUrl, vehiclePhotoUrl] = await Promise.all([
    uploadImage(personal.photo, IMAGE_FOLDERS.profile),
    uploadImage(vehicle.photo, IMAGE_FOLDERS.vehicle),
  ]);

  const docRef = await addDoc(driversRef, {
    fullName: personal.fullName.trim(),
    idNumber: personal.idNumber,
    phone: personal.phone,
    birthDate: personal.birthDate, // el SDK convierte Date a Timestamp
    gender: personal.gender,
    email,
    language,
    profilePhotoUrl,
    vehicle: {
      category: vehicle.category,
      plate: vehicle.plate.trim().toUpperCase(),
      brand: vehicle.brand.trim(),
      model: vehicle.model.trim(),
      year: Number(vehicle.year),
      color: vehicle.color,
      capacity: Number(vehicle.capacity),
      photoUrl: vehiclePhotoUrl,
    },
    approvalStatus: 'pending',
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}