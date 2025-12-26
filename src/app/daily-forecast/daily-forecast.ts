import { Component, computed, inject } from '@angular/core';

import { WeatherStore } from '../store/weather.store';
import { WeatherView } from '../store/weather-view';

type DailyForecastCard = {
  key: string;
  displayDay: string;
  weatherCode: number;
  temperatureMin: string;
  temperatureMax: string;
  isPlaceholder: boolean;
};

@Component({
  selector: 'app-daily-forecast',
  templateUrl: './daily-forecast.html',
})
export class DailyForecast {
  protected store = inject(WeatherStore);
  protected view = inject(WeatherView);

  readonly cards = computed<DailyForecastCard[]>(() => {
    if (this.store.isForecasting())
      return Array.from({ length: 8 }, (_, i) => ({
        key: `p-${i}`,
        displayDay: '',
        weatherCode: 0,
        temperatureMin: '',
        temperatureMax: '',
        isPlaceholder: true,
      }));

    return this.view
      .dailyForecast()
      .slice(0, 8)
      .map(({ date, displayDay, weatherCode, temperatureMin, temperatureMax }) => ({
        key: date.toISOString(),
        displayDay,
        weatherCode,
        temperatureMin,
        temperatureMax,
        isPlaceholder: false,
      }));
  });
}
