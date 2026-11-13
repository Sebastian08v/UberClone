// AI-assisted: see docs/AI_LOG.md
const express = require('express');
const path = require('path');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

const serviceAccount = require(
  path.resolve(__dirname, '..', process.env.FIREBASE_SERVICE_ACCOUNT_PATH)
);

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();
const router = express.Router();

router.post('/create-preference', async (req, res) => {
  const { tripId, amount } = req.body;

  // Validaciones básicas
  if (!tripId || typeof tripId !== 'string') {
    return res.status(400).json({ error: 'tripId es obligatorio' });
  }
  if (!Number.isInteger(amount) || amount <= 0) {
    return res.status(400).json({ error: 'amount debe ser un entero positivo en COP' });
  }

  const preference = {
    items: [
      {
        title: `Viaje UberClone ${tripId}`,
        quantity: 1,
        unit_price: amount,
        currency_id: 'COP',
      },
    ],
    external_reference: tripId, // sirve para saber qué viaje se pagó
  };

  // Las URLs de retorno se agregan solo si APP_URL está definida
  if (process.env.APP_URL) {
    preference.back_urls = {
      success: `${process.env.APP_URL}/payments/return`,
      failure: `${process.env.APP_URL}/payments/return`,
      pending: `${process.env.APP_URL}/payments/return`,
    };
  }

  try {
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(preference),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error de Mercado Pago:', data);
      return res.status(502).json({ error: 'No se pudo crear la preferencia' });
    }

    res.json({ preferenceId: data.id, checkoutUrl: data.init_point });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/return', async (req, res) => {
  const { payment_id } = req.query;

  if (!payment_id || payment_id === 'null') {
    return res.status(400).send('No se recibió el identificador del pago.');
  }

  try {
    // Se consulta el pago directamente a Mercado Pago (no se confía en la URL)
    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${payment_id}`,
      { headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` } }
    );
    const payment = await response.json();

    if (!response.ok) {
      console.error('Error consultando el pago:', payment);
      return res.status(502).send('No se pudo verificar el pago.');
    }

    const tripId = payment.external_reference;
    const tripRef = db.collection('trips').doc(tripId);

    // Transacción: evita sumar dos veces si se abre la dirección de retorno otra vez
    await db.runTransaction(async (t) => {
      const snap = await t.get(tripRef);
      const trip = snap.data();

      const update = {
        paymentStatus: payment.status,
        paymentId: String(payment.id),
        paymentMethod: 'mercadopago',
      };

      if (payment.status === 'approved') {
        update.status = 'paid';
        if (trip.status !== 'paid' && trip.driverId && trip.driverEarnings) {
          t.update(db.collection('drivers').doc(trip.driverId), {
            balance: FieldValue.increment(trip.driverEarnings),
          });
        }
      }

  t.update(tripRef, update);
});

    res.send('<h2>Pago recibido</h2><p>Ya puedes volver a la aplicación.</p>');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error interno del servidor.');
  }
});

module.exports = router;