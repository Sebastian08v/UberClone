import React, { createContext, useState } from 'react';
import {required,validateFullName,validateIdNumber,validatePhone,validateBirthDate,validateEmail,
  validatePlate,validateMaxLength,validateYear,validateCapacity,validateExpiryDate,validateTerms,
  isRtmRequired} from '../utils/validators';

export const RegistrationContext = createContext(null);

const initialForms = {
  personal: {
    photo: '',
    fullName: '',
    idNumber: '',
    phone: '',
    birthDate: null,
    gender: '',
    email: '',
  },
  vehicle: {
    category: '',
    plate: '',
    brand: '',
    model: '',
    year: '',
    color: '',
    capacity: '',
    photo: '',
  },
  documents: {
    licenseNumber: '',
    licensePhoto: '',
    licenseExpiry: null,
    soatPhoto: '',
    soatExpiry: null,
    rtmPhoto: '',
    rtmExpiry: null,
    mercadoPagoEmail: '',
    termsAccepted: false,
  },
};

// Cada validador recibe (formulario de su sección, todos los formularios)
const validators = {
  personal: {
    photo: (f) => required(f.photo),
    fullName: (f) => validateFullName(f.fullName),
    idNumber: (f) => validateIdNumber(f.idNumber),
    phone: (f) => validatePhone(f.phone),
    birthDate: (f) => validateBirthDate(f.birthDate),
    gender: (f) => required(f.gender),
    email: (f) => validateEmail(f.email),
  },
  vehicle: {
    category: (f) => required(f.category),
    plate: (f) => validatePlate(f.plate),
    brand: (f) => validateMaxLength(f.brand, 30),
    model: (f) => validateMaxLength(f.model, 30),
    year: (f) => validateYear(f.year),
    color: (f) => required(f.color),
    capacity: (f) => validateCapacity(f.capacity, f.category),
    photo: (f) => required(f.photo),
  },
  documents: {
    licenseNumber: (f) => required(f.licenseNumber),
    licensePhoto: (f) => required(f.licensePhoto),
    licenseExpiry: (f) => validateExpiryDate(f.licenseExpiry),
    soatPhoto: (f) => required(f.soatPhoto),
    soatExpiry: (f) => validateExpiryDate(f.soatExpiry),
    rtmPhoto: (f, all) =>
      isRtmRequired(all.vehicle.year) ? required(f.rtmPhoto) : null,
    rtmExpiry: (f, all) =>
      isRtmRequired(all.vehicle.year) ? validateExpiryDate(f.rtmExpiry) : null,
    mercadoPagoEmail: (f) => validateEmail(f.mercadoPagoEmail),
    termsAccepted: (f) => validateTerms(f.termsAccepted),
  },
};

export function RegistrationProvider({ children }) {
  const [forms, setForms] = useState(initialForms);
  const [touched, setTouched] = useState({});
  const [emailTaken, setEmailTaken] = useState(false);

  const setField = (section, field, value) =>
    setForms((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));

  const touch = (section, field) =>
    setTouched((prev) => ({ ...prev, [`${section}.${field}`]: true }));

  // Para selectores (foto, fecha, lista, checkbox): se marca como tocado al cambiar
  const setAndTouch = (section, field, value) => {
    setField(section, field, value);
    touch(section, field);
  };

  // Marca todos los campos de una sección para mostrar sus errores
  const touchSection = (section) =>
    setTouched((prev) => {
      const next = { ...prev };
      Object.keys(validators[section]).forEach((field) => {
        next[`${section}.${field}`] = true;
      });
      return next;
    });

  // Devuelve la clave del error solo si el campo ya fue tocado
  const getError = (section, field) => {
    if (!touched[`${section}.${field}`]) return null;
    return validators[section][field](forms[section], forms);
  };

  const isSectionValid = (section) =>
    Object.values(validators[section]).every(
      (validate) => validate(forms[section], forms) === null
    );

  const isRegistrationValid = () =>
    Object.keys(validators).every(isSectionValid);

  return (
    <RegistrationContext.Provider
      value={{
        forms,
        setField,
        touch,
        setAndTouch,
        touchSection,
        getError,
        isSectionValid,
        isRegistrationValid,
        emailTaken,
        setEmailTaken,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
}