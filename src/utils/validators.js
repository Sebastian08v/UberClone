// Cada validador devuelve null si es válido, o una clave de traducción si no.

export const required = (value) => {
  if (value === null || value === undefined) return 'required';
  if (typeof value === 'string' && value.trim() === '') return 'required';
  return null;
};

export const validateFullName = (value) => {
  const empty = required(value);
  if (empty) return empty;
  if (value.length > 50) return 'nameTooLong';
  if (!/^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ ]+$/.test(value)) return 'nameInvalid';
  return null;
};

export const validateIdNumber = (value) => {
  const empty = required(value);
  if (empty) return empty;
  if (!/^\d{6,10}$/.test(value)) return 'idInvalid';
  return null;
};

export const validatePhone = (value) => {
  const empty = required(value);
  if (empty) return empty;
  if (!/^\d{10}$/.test(value)) return 'phoneInvalid';
  return null;
};

export const validateBirthDate = (date) => {
  const empty = required(date);
  if (empty) return empty;
  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const hadBirthday =
    today.getMonth() > date.getMonth() ||
    (today.getMonth() === date.getMonth() && today.getDate() >= date.getDate());
  if (!hadBirthday) age -= 1;
  if (age < 18) return 'underage';
  return null;
};

export const validateEmail = (value) => {
  const empty = required(value);
  if (empty) return empty;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'emailInvalid';
  return null;
};

export const validatePlate = (value) => {
  const empty = required(value);
  if (empty) return empty;
  const plate = value.trim().toUpperCase();
  if (!/^[A-Z]{3}\d{3}$/.test(plate)) return 'plateInvalid';
  return null;
};

export const validateMaxLength = (value, max) => {
  const empty = required(value);
  if (empty) return empty;
  if (value.length > max) return 'textTooLong';
  return null;
};

export const validateYear = (value) => {
  const empty = required(value);
  if (empty) return empty;
  if (!/^\d{4}$/.test(value)) return 'yearInvalid';
  if (Number(value) > new Date().getFullYear()) return 'yearFuture';
  return null;
};

export const validateCapacity = (value, category) => {
  const empty = required(value);
  if (empty) return empty;
  if (!/^\d+$/.test(value)) return 'capacityInvalid';
  if (category === 'xl' && Number(value) < 6) return 'capacityXl';
  return null;
};

export const validateExpiryDate = (date) => {
  const empty = required(date);
  if (empty) return empty;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(date);
  expiry.setHours(0, 0, 0, 0);
  if (expiry <= today) return 'expired';
  return null;
};