const express = require('express');
const { requireAgentToken } = require('../middlewares/agentAuth.middleware');
const agentController = require('../controllers/agent.controller');
const { listarRegistrosUso } = require('../data/mockStore');

const DATA_MODE = process.env.DATA_MODE || 'supabase';

const router = express.Router();

router.post('/uso', requireAgentToken, agentController.reportarUso);

// Endpoint de debug solo disponible en modo mock, para verificar que los
// reportes del Agente sí están llegando mientras no existe el proyecto
// real de Supabase.
router.get('/debug/registros', (req, res) => {
  if (DATA_MODE !== 'mock') {
    return res.status(404).json({ error: 'No encontrado' });
  }

  return res.status(200).json(listarRegistrosUso());
});

module.exports = router;
