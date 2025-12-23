import { Injectable, computed, inject } from '@angular/core';
import { WeatherStore } from './weather.store';

import { addDays, format, isSameDay, parseISO, startOfDay } from 'date-fns';

export type HourlyForecastItem = {
  time: Date;
  temperature: number;
  weathercode: number;
  displayTime: string;
};

@Injectable()
export class WeatherView {
  private store = inject(WeatherStore);

  readonly showLocationDropdown = computed(
    () => this.store.locationQuery().trim().length >= 2 && this.store.locationResults().length > 0,
  );

  readonly hourlyForecast = computed<HourlyForecastItem[]>(() => {
    const forecast = this.store.forecast();
    const hourly = forecast?.hourly;

    if (!hourly?.time?.length || !hourly.temperature_2m?.length) return [];

    const selectedDayIndex = this.store.selectedForecastDay();
    const currentCode = forecast?.current?.weathercode ?? 0;
    const targetDate = addDays(startOfDay(new Date()), selectedDayIndex - 1);

    const rows = hourly.time
      .map((timestampIso, index) => ({ timestampIso, index }))
      .filter(({ timestampIso }) => isSameDay(parseISO(timestampIso), targetDate))
      .map(({ timestampIso, index }) => {
        const date = parseISO(timestampIso);

        return {
          time: date,
          temperature: hourly.temperature_2m[index],
          weathercode: hourly.weathercode?.[index] ?? currentCode,
          displayTime: format(date, 'h a'),
        };
      });

    return rows.slice(0, 8);
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

  getDayName(day: number): string {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    return days[day - 1] || 'Monday';
  }
}
