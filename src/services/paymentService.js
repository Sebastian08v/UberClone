// AI-assisted: see docs/AI_LOG.md
import { Linking } from 'react-native';

//  IP de computador
const BACKEND_URL = 'http://192.168.1.80:3000';

export async function createPaymentPreference(tripId, amount) {
  const response = await fetch(`${BACKEND_URL}/payments/create-preference`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tripId, amount }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'No se pudo crear el pago');
  }

  return data; // { preferenceId, checkoutUrl }
}

export async function openCheckout(tripId, amount) {
  const { checkoutUrl } = await createPaymentPreference(tripId, amount);
  await Linking.openURL(checkoutUrl);
}