// AI-assisted: see docs/AI_LOG.md
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/payments', require('./routes/payments'));

app.get('/', (req, res) => {
  res.json({ ok: true, message: 'UberClone backend funcionando' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});