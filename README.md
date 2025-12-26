# Weather Dashboard

A responsive weather dashboard built with Angular and Tailwind CSS.  
It uses Angular Signals (including `computed()`) for derived UI state.  
Weather data and geocoding are powered by Open‑Meteo (no API key required).

## Features

- Location search via Open‑Meteo Geocoding API (`/v1/search`) with a dropdown of matching locations.
- Forecast display using the Open‑Meteo Forecast API (`/v1/forecast`) based on selected coordinates.
- Responsive layout using Tailwind’s mobile-first breakpoint system.

## Tech stack

- Angular + Signals (`signal`, `computed`) for reactive state and derived values.
- Tailwind CSS for styling and responsive design utilities.

## Getting started

### Prerequisites
- Node.js + npm (or pnpm/yarn).

### Install
```
npm install
```

### Run locally
```
npm start
# or (if using Angular CLI)
ng serve
```

### Production build
```
npm run build
```

## API notes

- Geocoding endpoint: `https://geocoding-api.open-meteo.com/v1/search`
  - 1 character returns empty; 2 characters only exact matches; 3+ enables fuzzy matching.
- Forecast endpoint: `https://api.open-meteo.com/v1/forecast`
  - Configure variables/units via query parameters.

