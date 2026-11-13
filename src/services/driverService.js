import {collection,addDoc,getDocs,query,where,limit,serverTimestamp,doc,updateDoc, getDoc} from 'firebase/firestore';
import { db } from '../config/firebase';
import { uploadImage, IMAGE_FOLDERS } from './imageService';
import { isRtmRequired } from '../utils/validators';
import { COMMISSION_RATE } from '../config/pricing';

const driversRef = collection(db, 'drivers');

// Guarda al conductor con estado 'pending', las URL de sus fotos y documentos.
// Lanza Error('emailTaken') si el correo ya está registrado.
export async function registerDriver({ personal, vehicle, documents, language }) {
  const email = personal.email.trim().toLowerCase();

  const existing = await getDocs(
    query(driversRef, where('email', '==', email), limit(1))
  );
  if (!existing.empty) {
    throw new Error('emailTaken');
  }

  const rtmRequired = isRtmRequired(vehicle.year);

  const [
    profilePhotoUrl,
    vehiclePhotoUrl,
    licensePhotoUrl,
    soatPhotoUrl,
    rtmPhotoUrl,
  ] = await Promise.all([
    uploadImage(personal.photo, IMAGE_FOLDERS.profile, 'profile'),
    uploadImage(vehicle.photo, IMAGE_FOLDERS.vehicle, 'vehicle'),
    uploadImage(documents.licensePhoto, IMAGE_FOLDERS.documents, 'license'),
    uploadImage(documents.soatPhoto, IMAGE_FOLDERS.documents, 'soat'),
    rtmRequired
      ? uploadImage(documents.rtmPhoto, IMAGE_FOLDERS.documents, 'technical-review')
      : Promise.resolve(null),
  ]);

  const docRef = await addDoc(driversRef, {
    fullName: personal.fullName.trim(),
    idNumber: personal.idNumber,
    phone: personal.phone,
    birthDate: personal.birthDate, 
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
    documents: {
      license: {
        number: documents.licenseNumber.trim(),
        photoUrl: licensePhotoUrl,
        expiryDate: documents.licenseExpiry,
      },
      soat: {
        photoUrl: soatPhotoUrl,
        expiryDate: documents.soatExpiry,
      },
      technicalReview: rtmRequired
        ? {
            required: true,
            photoUrl: rtmPhotoUrl,
            expiryDate: documents.rtmExpiry,
          }
        : { required: false },
    },
    mercadoPagoEmail: documents.mercadoPagoEmail.trim().toLowerCase(),
    termsAccepted: true,
    commissionAccepted: COMMISSION_RATE,
    approvalStatus: 'pending',
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}
export const updateDriverAvailability = (driverId, available) =>
  updateDoc(doc(db, 'drivers', driverId), {
    available,
    updatedAt: serverTimestamp(),
  });

export const updateDriverLocation = (driverId, latitude, longitude) =>
  updateDoc(doc(db, 'drivers', driverId), {
    location: { latitude, longitude },
    locationUpdatedAt: serverTimestamp(),
  });
export async function getDriverStatus(driverId) {
  const snap = await getDoc(doc(db, 'drivers', driverId));
  if (!snap.exists()) return null;
  return { approvalStatus: snap.data().approvalStatus };
}