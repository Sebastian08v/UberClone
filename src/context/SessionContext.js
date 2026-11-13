import React, { createContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import {
  getLanguage,
  saveLanguage,
  getSession,
  saveSession,
  clearSession,
} from '../services/storage';
import { getDriverStatus } from '../services/driverService';
import {
  registerDriverFcmToken,
  subscribeForegroundNotifications,
  subscribeNotificationOpened,
  getInitialNotification,
} from '../services/notificationService';
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

  // AI-assisted: see docs/AI_LOG.md #41
  // Registra el token FCM y escucha notificaciones cuando hay un conductor activo
  useEffect(() => {
    if (!driver?.id) return;

    registerDriverFcmToken(driver.id).catch((err) =>
      console.warn('Error registrando token FCM:', err)
    );

    const unsubscribeForeground = subscribeForegroundNotifications((remoteMessage) => {
      Alert.alert(
        remoteMessage.notification?.title || 'Nueva solicitud de viaje',
        remoteMessage.notification?.body || 'Tienes una solicitud pendiente.'
      );
    });

    const unsubscribeOpened = subscribeNotificationOpened((remoteMessage) => {
      console.log('App abierta desde notificación:', remoteMessage.data);
    });

    getInitialNotification().then((remoteMessage) => {
      if (remoteMessage) {
        console.log('App iniciada desde notificación cerrada:', remoteMessage.data);
      }
    });

    return () => {
      unsubscribeForeground();
      unsubscribeOpened();
    };
  }, [driver?.id]);

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