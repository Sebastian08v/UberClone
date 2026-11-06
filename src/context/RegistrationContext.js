import React, { createContext, useState } from 'react';
import {required,validateFullName,validateIdNumber,validatePhone,validateBirthDate,validateEmail,
validatePlate,validateMaxLength,validateYear,validateCapacity} from '../utils/validators';

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
};

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
};

export function RegistrationProvider({ children }) {
  const [forms, setForms] = useState(initialForms);
  const [touched, setTouched] = useState({});

  const setField = (section, field, value) =>
    setForms((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));

  const touch = (section, field) =>
    setTouched((prev) => ({ ...prev, [`${section}.${field}`]: true }));

  // Para selectores (foto, fecha, lista): se marca como tocado al cambiar
  const setAndTouch = (section, field, value) => {
    setField(section, field, value);
    touch(section, field);
  };

  // Devuelve la clave del error solo si el campo ya fue tocado
  const getError = (section, field) => {
    if (!touched[`${section}.${field}`]) return null;
    return validators[section][field](forms[section]);
  };

  const isSectionValid = (section) =>
    Object.values(validators[section]).every(
      (validate) => validate(forms[section]) === null
    );

  const isRegistrationValid = () =>
    Object.keys(validators).every(isSectionValid);

  // Marca todos los campos como tocados para mostrar todos los errores
  const touchAll = () => {
    const all = {};
    Object.keys(validators).forEach((section) => {
      Object.keys(validators[section]).forEach((field) => {
        all[`${section}.${field}`] = true;
      });
    });
    setTouched(all);
  };

  return (
    <RegistrationContext.Provider
      value={{
        forms,
        setField,
        touch,
        setAndTouch,
        getError,
        isSectionValid,
        isRegistrationValid,
        touchAll,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
}