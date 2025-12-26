import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs/operators';

export type LocationResult = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
  timezone?: string;
};

export type UnitsState = {
  system: SystemUnit;
  temperature: TemperatureUnit;
  wind: WindUnit;
  precipitation: PrecipitationUnit;
};

export type SystemUnit = 'metric' | 'imperial';
export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type WindUnit = 'kmh' | 'mph';
export type PrecipitationUnit = 'mm' | 'in';

const CURRENT_VARS = [
  'temperature_2m',
  'weather_code',
  'apparent_temperature',
  'relative_humidity_2m',
  'wind_speed_10m',
  'precipitation',
] as const;

const HOURLY_VARS = ['temperature_2m', 'weather_code'] as const;

const DAILY_VARS = ['weather_code', 'temperature_2m_max', 'temperature_2m_min'] as const;

export type ForecastResponse = {
  current: {
    temperature_2m: number;
    weather_code: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    precipitation: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
};

@Injectable({ providedIn: 'root' })
export class OpenMeteoService {
  private http = inject(HttpClient);

  geocode(name: string, count = 10) {
    const params = { name, count };

    return this.http
      .get<{
        results?: LocationResult[];
      }>('https://geocoding-api.open-meteo.com/v1/search', { params })
      .pipe(map(({ results }) => results ?? []));
  }

  forecast = (latitude: number, longitude: number, units: UnitsState) =>
    this.http.get<ForecastResponse>('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude,
        longitude,
        timezone: 'auto',
        current: CURRENT_VARS.join(','),
        hourly: HOURLY_VARS.join(','),
        daily: DAILY_VARS.join(','),
        temperature_unit: units.temperature,
        windspeed_unit: units.wind,
        precipitation_unit: units.precipitation === 'mm' ? 'mm' : 'inch',
      },
    });
}
