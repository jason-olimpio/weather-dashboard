# Weather Dashboard

A responsive weather dashboard built with Angular and Tailwind CSS. The application supports location search via Open‑Meteo’s Geocoding API and displays weather forecasts using Open‑Meteo’s Forecast API. Reactive UI state is implemented with Angular Signals, including `computed()` for derived state. No API key is required.

## Features

- Location search backed by Open‑Meteo Geocoding (`/v1/search`), with a dropdown list of matching results.
- Forecast retrieval and display via Open‑Meteo Forecast (`/v1/forecast`) using selected coordinates.
- Responsive layout implemented with Tailwind CSS (mobile‑first breakpoint system).

## Technology

- Angular with Signals (`signal`, `computed`) for state management and derived values.
- Tailwind CSS for styling and responsive utilities.

## Getting started

### Prerequisites

- Node.js and npm (pnpm/yarn also supported)

### Install dependencies

```bash
npm install
```

### Development server

```bash
npm start
# or (Angular CLI)
ng serve
```

### Production build

```bash
npm run build
```

## API reference

### Geocoding
Endpoint: `https://geocoding-api.open-meteo.com/v1/search`

Behavior notes:
- Queries with 1 character return empty results.
- Queries with 2 characters return only exact matches.
- Queries with 3+ characters enable fuzzy matching.

### Forecast
Endpoint: `https://api.open-meteo.com/v1/forecast`

Notes:
- Forecast variables and units are configured via query parameters.