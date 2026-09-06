require('dotenv').config();
const express = require('express');
const agentRoutes = require('./routes/agent.routes');

const app = express();

app.use(express.json());

app.use('/agent', agentRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

module.exports = app;
