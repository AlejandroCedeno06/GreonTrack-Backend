const { createClient } = require('@supabase/supabase-js');
const { buscarDispositivoPorToken } = require('../data/mockStore');

const DATA_MODE = process.env.DATA_MODE || 'supabase';

// Cliente con service_role: este flujo no tiene sesión de usuario (el Agente
// no inicia sesión), por lo que se usa la service_role key para saltar RLS
// y poder buscar el dispositivo por su token.
// Solo se crea en modo 'supabase': en modo 'mock' todavía no existe el
// proyecto real y estas credenciales pueden no estar configuradas.
let supabaseAdmin = null;

if (DATA_MODE === 'supabase') {
  supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

async function requireAgentToken(req, res, next) {
  const deviceToken = req.headers['x-device-token'];

  if (!deviceToken) {
    return res.status(401).json({ error: 'Falta x-device-token' });
  }

  let dispositivo = null;

  if (DATA_MODE === 'mock') {
    dispositivo = buscarDispositivoPorToken(deviceToken);
  } else {
    const { data, error } = await supabaseAdmin
      .from('dispositivos')
      .select('*')
      .eq('device_token', deviceToken)
      .single();

    if (!error && data) {
      dispositivo = data;
    }
  }

  if (!dispositivo) {
    return res.status(401).json({ error: 'device_token inválido' });
  }

  if (dispositivo.origen !== 'agente') {
    return res.status(403).json({
      error: 'Este dispositivo no está configurado para reportar vía agente',
    });
  }

  req.dispositivo = dispositivo;
  req.supabaseAdmin = supabaseAdmin;
  next();
}

module.exports = { requireAgentToken };
