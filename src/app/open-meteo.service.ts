import { HttpClient, HttpParams } from '@angular/common/http';
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

export type ForecastResponse = {
  current: CurrentWeather;
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation: number[];
    wind_speed_10m: number[];
    weathercode: number[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
  };
};

type CurrentWeather = {
  time: string;
  temperature_2m: number;
  weathercode: number;
  wind_speed_10m?: number;
  precipitation?: number;
};

@Injectable({ providedIn: 'root' })
export class OpenMeteoService {
  private http = inject(HttpClient);

  geocode(name: string, count = 10) {
    const params = new HttpParams().set('name', name).set('count', count);

    return this.http
      .get<{ results?: LocationResult[] }>('https://geocoding-api.open-meteo.com/v1/search', {
        params,
      })
      .pipe(map(({ results }) => results ?? []));
  }

  forecast(latitude: number, longitude: number, units: UnitsState) {
    const params = new HttpParams()
      .set('latitude', latitude)
      .set('longitude', longitude)
      .set('timezone', 'auto')
      .set('current', 'temperature_2m,weathercode,wind_speed_10m')
      .set('hourly', 'temperature_2m,precipitation,wind_speed_10m')
      .set('daily', 'temperature_2m_max,temperature_2m_min,precipitation_sum')
      .set('temperature_unit', units.temperature)
      .set('wind_speed_unit', units.wind === 'kmh' ? 'kmh' : 'mph')
      .set('precipitation_unit', units.precipitation === 'mm' ? 'mm' : 'inch');

    return this.http.get<ForecastResponse>('https://api.open-meteo.com/v1/forecast', { params });
  }
}
