import React, { createContext, useState, useEffect } from 'react';
import { getLanguage, saveLanguage } from '../services/storage';
import es from '../locales/es';
import en from '../locales/en';

const TRANSLATIONS = { es, en };

export const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [driver, setDriver] = useState(null);
  // null = sin registro | 'pending' | 'approved'
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [language, setLanguage] = useState('es');

  // Al arrancar, carga el idioma guardado
  useEffect(() => {
    getLanguage().then(setLanguage);
  }, []);

  // Cambia el idioma en pantalla y lo guarda en AsyncStorage
  const changeLanguage = async (newLanguage) => {
    setLanguage(newLanguage);
    await saveLanguage(newLanguage);
  };

  const t = TRANSLATIONS[language];

  return (
    <SessionContext.Provider
      value={{
        driver,
        setDriver,
        approvalStatus,
        setApprovalStatus,
        language,
        changeLanguage,
        t,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}