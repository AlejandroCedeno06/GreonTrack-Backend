const { insertarRegistroUso } = require('../data/mockStore');

const DATA_MODE = process.env.DATA_MODE || 'supabase';

async function reportarUso(req, res) {
  const { uso_segundos, sesion_activa, hostname, usuario_windows, fecha } = req.body;

  if (uso_segundos === undefined || uso_segundos === null) {
    return res.status(400).json({ error: 'uso_segundos es requerido' });
  }

  const horas_uso = Math.round((uso_segundos / 3600) * 10000) / 10000;
  const dispositivo = req.dispositivo;

  let registroId;

  if (DATA_MODE === 'mock') {
    const registro = insertarRegistroUso({
      dispositivo_id: dispositivo.id,
      horas_uso,
      fuente: 'agente',
      fecha: fecha || new Date().toISOString(),
    });

    registroId = registro.id;
  } else {
    const { data, error } = await req.supabaseAdmin
      .from('registros_uso')
      .insert({
        dispositivo_id: dispositivo.id,
        horas_uso,
        fuente: 'agente',
        fecha: fecha || new Date().toISOString(),
      })
      .select('id')
      .single();

    if (error) {
      return res.status(500).json({
        error: 'No se pudo guardar el registro de uso',
        detalle: error.message,
      });
    }

    registroId = data.id;
  }

  console.log(
    `[agent] Reporte recibido - dispositivo: ${dispositivo.id}, hostname: ${hostname}, horas: ${horas_uso}`
  );

  return res.status(200).json({ ok: true, registro_id: registroId });
}

module.exports = { reportarUso };
