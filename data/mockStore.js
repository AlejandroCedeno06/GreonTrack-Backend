// TODO: quitar modo MOCK cuando Supabase esté listo.

const registrosUso = [];

const dispositivosMock = [
  {
    id: 'mock-device-1',
    usuario_id: 'mock-user-1',
    nombre: 'Laptop de prueba',
    origen: 'agente',
    device_token: 'test-token-123',
  },
];

let siguienteRegistroId = 1;

function buscarDispositivoPorToken(token) {
  return dispositivosMock.find((d) => d.device_token === token) || null;
}

function insertarRegistroUso({ dispositivo_id, horas_uso, fuente, fecha }) {
  const registro = {
    id: siguienteRegistroId++,
    dispositivo_id,
    horas_uso,
    fuente,
    fecha,
  };

  registrosUso.push(registro);

  return registro;
}

function listarRegistrosUso() {
  return registrosUso;
}

module.exports = {
  registrosUso,
  dispositivosMock,
  buscarDispositivoPorToken,
  insertarRegistroUso,
  listarRegistrosUso,
};
