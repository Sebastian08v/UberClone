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

// AI-assisted: see docs/AI_LOG.md
export async function getDriverProfile(driverId) {
  const snap = await getDoc(doc(db, 'drivers', driverId));
  return snap.exists() ? snap.data() : null;
}

// Solo sube a Cloudinary las fotos nuevas (uri local); las que ya son URL se conservan
const uploadIfNew = (uri, folder, label) =>
  uri && !uri.startsWith('http')
    ? uploadImage(uri, folder, label)
    : Promise.resolve(uri);

// AI-assisted: see docs/AI_LOG.md
export async function updateDriverProfile(driverId, f, language) {
  const email = f.email.trim().toLowerCase();

  const existing = await getDocs(
    query(driversRef, where('email', '==', email), limit(1))
  );
  if (!existing.empty && existing.docs[0].id !== driverId) {
    throw new Error('emailTaken');
  }

  const rtmRequired = isRtmRequired(f.year);

  const [profilePhotoUrl, vehiclePhotoUrl, licensePhotoUrl, soatPhotoUrl, rtmPhotoUrl] =
    await Promise.all([
      uploadIfNew(f.profilePhoto, IMAGE_FOLDERS.profile, 'profile'),
      uploadIfNew(f.vehiclePhoto, IMAGE_FOLDERS.vehicle, 'vehicle'),
      uploadIfNew(f.licensePhoto, IMAGE_FOLDERS.documents, 'license'),
      uploadIfNew(f.soatPhoto, IMAGE_FOLDERS.documents, 'soat'),
      rtmRequired
        ? uploadIfNew(f.rtmPhoto, IMAGE_FOLDERS.documents, 'technical-review')
        : Promise.resolve(null),
    ]);

  await updateDoc(doc(db, 'drivers', driverId), {
    fullName: f.fullName.trim(),
    idNumber: f.idNumber,
    phone: f.phone,
    birthDate: f.birthDate,
    gender: f.gender,
    email,
    language,
    profilePhotoUrl,
    'vehicle.category': f.category,
    'vehicle.plate': f.plate.trim().toUpperCase(),
    'vehicle.brand': f.brand.trim(),
    'vehicle.model': f.model.trim(),
    'vehicle.year': Number(f.year),
    'vehicle.color': f.color,
    'vehicle.capacity': Number(f.capacity),
    'vehicle.photoUrl': vehiclePhotoUrl,
    'documents.license': {
      number: f.licenseNumber.trim(),
      photoUrl: licensePhotoUrl,
      expiryDate: f.licenseExpiry,
    },
    'documents.soat': { photoUrl: soatPhotoUrl, expiryDate: f.soatExpiry },
    'documents.technicalReview': rtmRequired
      ? { required: true, photoUrl: rtmPhotoUrl, expiryDate: f.rtmExpiry }
      : { required: false },
    mercadoPagoEmail: f.mercadoPagoEmail.trim().toLowerCase(),
    updatedAt: serverTimestamp(),
  });
}