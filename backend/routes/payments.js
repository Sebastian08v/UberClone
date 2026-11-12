// AI-assisted: see docs/AI_LOG.md
const express = require('express');
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
    external_reference: tripId, // sirve para saber qué viaje se pagó (commit 33)
  };

  // Las URLs de retorno se agregan solo si APP_URL está definida (commit 33)
  if (process.env.APP_URL) {
    preference.back_urls = {
      success: `${process.env.APP_URL}/payments/return`,
      failure: `${process.env.APP_URL}/payments/return`,
      pending: `${process.env.APP_URL}/payments/return`,
    };
    preference.auto_return = 'approved';
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

module.exports = router;