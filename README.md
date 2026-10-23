# Route Weather Explorer

Route Weather Explorer is a full-stack travel planning app that combines road routing with weather forecasts along your route.

## Features

- React + TypeScript + Vite frontend with Tailwind CSS styling
- Interactive Leaflet map with route polyline, start/end markers, and weather markers
- Geocoding search with OpenStreetMap Nominatim (debounced + cached)
- Backend Express proxy endpoint for openrouteservice routing API
- Route summary (distance + estimated duration)
- Weather forecast sampling every ~20 km along the route
- Arrival-time-aware forecast selection for each sampled point
- Weather details sidebar with hourly preview and unit toggle (°C/°F)
- Request cancellation, bounded weather concurrency, deduplication, and short-lived cache
- Focused unit tests for core utilities and backend payload validation

## Tech stack

- Frontend: React, TypeScript, Vite, Tailwind CSS
- Map: Leaflet + React Leaflet
- Routing: openrouteservice Directions API (backend-only key)
- Geocoding: OpenStreetMap Nominatim
- Weather: Open-Meteo Forecast API
- Backend: Node.js + Express
- Tests: Vitest + Supertest

## Prerequisites

- Node.js 20+
- npm 10+

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment file:

```bash
cp .env.example .env
```

3. Edit `.env` and set your openrouteservice key:

- `ORS_API_KEY=YOUR_REAL_KEY`

### Getting an openrouteservice key

1. Create an account: https://openrouteservice.org/dev/#/signup
2. Open dashboard: https://openrouteservice.org/dev/#/home
3. Create an API key.
4. Put the key into `.env` as `ORS_API_KEY`.

> `ORS_API_KEY` is read only by the backend. It is never exposed to the frontend bundle.

## Environment variables

Required/used variables are documented in `.env.example`:

- `VITE_APP_NAME`
- `VITE_WEATHER_API_BASE_URL`
- `VITE_GEOCODING_API_BASE_URL`
- `VITE_TILE_LAYER_URL`
- `ORS_API_KEY`
- `ORS_API_BASE_URL`
- `PORT`
- `CORS_ORIGIN`

## Run locally

Start frontend + backend together:

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:8787

## Build and test

```bash
npm run typecheck
npm run build
npm run test
```

## Troubleshooting

- **Missing ORS key**: backend throws a clear startup/config error.
- **401/403 routing errors**: invalid ORS key.
- **429 routing/weather errors**: API quota/rate limit exceeded.
- **No route found**: locations may not have a valid driving route.
- **Nominatim issues**: retry with more specific place names.

## API usage and attribution notes

- Open-Meteo free API generally does **not** require an API key for qualifying non-commercial use.
- Weather shown is forecast data; not guaranteed live/actual measurements.
- Respect OpenStreetMap Nominatim usage policy and usage limits.
- Respect OpenStreetMap tile and attribution requirements.
- Respect openrouteservice plan limits (free-tier quotas apply).
- For commercial deployment, review provider terms and upgrade plans as required.

## Project structure

```text
src/
  components/
  hooks/
  services/
  types/
  utils/
  config/
server/
  config/
  middleware/
  routes/
  services/
  utils/
```
