import React, { createContext, useState, useEffect } from 'react';
import {
  getLanguage,
  saveLanguage,
  getSession,
  saveSession,
  clearSession,
} from '../services/storage';
import { getDriverStatus } from '../services/driverService';
import es from '../locales/es';
import en from '../locales/en';

const TRANSLATIONS = { es, en };

export const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [driver, setDriver] = useState(null);
  // null = sin registro | 'pending' | 'approved'
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [language, setLanguage] = useState('es');
  // true mientras se restaura la sesión guardada
  const [loading, setLoading] = useState(true);

  // AI-assisted: see docs/AI_LOG.md #N
  // Al arrancar: carga idioma y restaura la última sesión
  useEffect(() => {
    const restore = async () => {
      const [savedLanguage, saved] = await Promise.all([
        getLanguage(),
        getSession(),
      ]);
      setLanguage(savedLanguage);

      if (saved?.driverId) {
        try {
          // Estado actual desde la base de datos
          const remote = await getDriverStatus(saved.driverId);
          if (remote) {
            setDriver({ id: saved.driverId });
            setApprovalStatus(remote.approvalStatus ?? 'pending');
          } else {
            await clearSession(); // el conductor ya no existe en la base
          }
        } catch (error) {
          // Sin red: usa lo último que se guardó
          setDriver({ id: saved.driverId });
          setApprovalStatus(saved.approvalStatus ?? 'pending');
        }
      }
      setLoading(false);
    };
    restore();
  }, []);

  // Guarda la sesión cada vez que cambia (después de restaurar)
  useEffect(() => {
    if (loading) return;
    if (driver?.id && approvalStatus) {
      saveSession({ driverId: driver.id, approvalStatus });
    } else {
      clearSession();
    }
  }, [driver, approvalStatus, loading]);

  // Para el botón "Cerrar sesión" (commit 40)
  const signOut = () => {
    setDriver(null);
    setApprovalStatus(null);
  };

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
        loading,
        signOut,
        t,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}