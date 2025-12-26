import { Injectable, computed, inject } from '@angular/core';
import { WeatherStore } from './weather.store';
import { addDays, format, isSameDay, parseISO, startOfDay } from 'date-fns';

type HourlyForecastItem = {
  date: Date;
  temperature: string;
  weatherCode: number;
  displayTime: string;
};

type DailyForecastItem = {
  date: Date;
  displayDay: string;
  temperatureMin: string;
  temperatureMax: string;
  weatherCode: number;
};

@Injectable()
export class WeatherView {
  protected store = inject(WeatherStore);

  readonly showLocationDropdown = computed(
    () => this.store.locationQuery().trim().length >= 2 && this.store.locationResults().length > 0,
  );

  readonly dailyForecast = computed<DailyForecastItem[]>(() => {
    const forecast = this.store.forecast();
    const daily = forecast?.daily;

    if (!daily?.time?.length) return [];

    const unit = this.store.units().temperature === 'celsius' ? '°C' : '°F';

    return daily.time
      .map((iso, i) => {
        const date = parseISO(iso);

        return {
          date,
          displayDay: format(date, 'EEE'),
          temperatureMin: `${daily.temperature_2m_min[i]} ${unit}`,
          temperatureMax: `${daily.temperature_2m_max[i]} ${unit}`,
          weatherCode: daily.weather_code[i],
        };
      })
      .slice(0, 8);
  });

  readonly hourlyForecast = computed<HourlyForecastItem[]>(() => {
    const forecast = this.store.forecast();
    const hourly = forecast?.hourly;

    if (!hourly?.time?.length || !hourly.temperature_2m?.length) return [];

    const selectedDayIndex = this.store.selectedForecastDay();
    const targetDate = addDays(startOfDay(new Date()), selectedDayIndex - 1);

    const unit = this.store.units().temperature === 'celsius' ? '°C' : '°F';

    const fallbackCode = forecast?.current?.weather_code;
    const fallback: number = typeof fallbackCode === 'number' ? fallbackCode : 0;

    const rows = hourly.time
      .map((timestampIso, index) => ({ timestampIso, index }))
      .filter(({ timestampIso }) => isSameDay(parseISO(timestampIso), targetDate))
      .map(({ timestampIso, index }) => {
        const date = parseISO(timestampIso);

        const codeSource = hourly.weather_code;
        const code: number = Array.isArray(codeSource) ? (codeSource[index] ?? fallback) : fallback;

        return {
          date,
          temperature: `${hourly.temperature_2m[index]} ${unit}`,
          weatherCode: code,
          displayTime: format(date, 'h a'),
        };
      });

    return rows.slice(0, 8);
  });

  readonly showNoResultsMessage = computed(() => {
    const queryText = this.store.locationQuery().trim();

    const canEvaluate =
      queryText.length >= 2 && !this.store.isGeocoding() && !this.store.hasGeocodingError();

    const hasResults = this.store.locationResults().length > 0;

    return canEvaluate && !hasResults;
  });

  getWeatherIcon(code: number): string {
    const iconMap: Record<number, string> = {
      0: 'icon-sunny.webp',
      1: 'icon-drizzle.webp',
      2: 'icon-drizzle.webp',
      3: 'icon-drizzle.webp',
      45: 'icon-fog.webp',
      48: 'icon-fog.webp',
      61: 'icon-rain.webp',
      63: 'icon-rain.webp',
      65: 'icon-rain.webp',
      80: 'icon-rain.webp',
      71: 'icon-snow.webp',
      73: 'icon-snow.webp',
      75: 'icon-snow.webp',
      95: 'icon-storm.webp',
      96: 'icon-storm.webp',
      99: 'icon-storm.webp',
      4: 'icon-partly-cloudy.webp',
      7: 'icon-partly-cloudy.webp',
    };

    return `./images/${iconMap[code] || 'icon-loading.svg'}`;
  }

  getForecastDayLabel(dayIndex: number): string {
    const date = addDays(startOfDay(new Date()), dayIndex - 1);

    return format(date, 'EEEE');
  }
}
