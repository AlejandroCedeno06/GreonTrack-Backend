# GreonTrack — Backend

API del Sistema Inteligente de Análisis del Consumo Energético.

## Qué hace

Backend en Node.js (Express) que recibe, calcula y sirve los datos de
consumo energético de los dispositivos registrados por cada usuario:
kWh estimado, costo eléctrico y huella de carbono, además de las horas
de uso capturadas manualmente o reportadas automáticamente por el
Agente GreonTrack.

## Stack

- Node.js (CommonJS)
- Express
- Supabase (Postgres)

## Setup

```bash
npm install
cp .env.example .env
# Configurar las variables según la sección de abajo
npm start
```

## Variables de entorno

- PORT — puerto del servidor (default 3000)
- DATA_MODE — 'mock' o 'supabase'. En 'mock' los datos se guardan en
  memoria (útil para probar sin base de datos real); en 'supabase' se
  usa la base de datos real.
- SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY — usadas por el endpoint del
  Agente para verificar el device_token y escribir directo en la base
  de datos sin pasar por sesión de usuario.
- SUPABASE_ANON_KEY — no la usa el código actual (el login/registro se
  maneja directo desde el Frontend contra Supabase, no desde este
  Backend); queda declarada por si el Backend gana su propio flujo de
  autenticación más adelante.

## Endpoints

### Agente
- POST /agent/uso — recibe el reporte de uso que manda el Agente
  GreonTrack desde la laptop del usuario. Requiere el header
  x-device-token, que identifica a qué dispositivo pertenece el reporte.
- GET /agent/debug/registros — solo funciona en modo mock, sirve para
  ver en el navegador los datos que el agente ha ido mandando.

## Notas

DATA_MODE=mock es temporal, solo mientras no está lista la base de datos
real. Antes de la entrega hay que cambiarlo a DATA_MODE=supabase.

El endpoint del agente usa SUPABASE_SERVICE_ROLE_KEY porque no hay una
sesión de usuario detrás del reporte — solo un token del dispositivo.
