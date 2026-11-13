// AI-assisted: see docs/AI_LOG.md #22
import { Platform, PermissionsAndroid } from 'react-native';
import messaging, { getMessaging, setBackgroundMessageHandler } from '@react-native-firebase/messaging';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const messagingInstance = getMessaging();

// Registrar manejador en segundo plano
setBackgroundMessageHandler(messagingInstance, async (remoteMessage) => {
  console.log('Notificación en segundo plano:', remoteMessage?.notification?.title);
});

export async function requestNotificationPermission() {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      return false;
    }
  }

  const authStatus = await messagingInstance.requestPermission();
  return (
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL
  );
}

export async function registerDriverFcmToken(driverId) {
  if (!driverId) return null;

  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) return null;

  const token = await messagingInstance.getToken();
  if (token) {
    await updateDoc(doc(db, 'drivers', driverId), {
      fcmToken: token,
      fcmUpdatedAt: new Date(),
    });
  }
  return token;
}

export function subscribeForegroundNotifications(onMessageReceived) {
  return messagingInstance.onMessage(async (remoteMessage) => {
    if (onMessageReceived) {
      onMessageReceived(remoteMessage);
    }
  });
}

export function subscribeNotificationOpened(onNotificationOpen) {
  return messagingInstance.onNotificationOpenedApp((remoteMessage) => {
    if (onNotificationOpen && remoteMessage) {
      onNotificationOpen(remoteMessage);
    }
  });
}

export async function getInitialNotification() {
  return await messagingInstance.getInitialNotification();
}