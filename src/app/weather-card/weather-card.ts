import { Component, computed, inject, signal } from '@angular/core';
import { WeatherStore } from '../store/weather.store';
import { WeatherView } from '../store/weather-view';

@Component({
  selector: 'app-weather-card',
  imports: [],
  templateUrl: './weather-card.html',
})
export class WeatherCard {
  protected store = inject(WeatherStore);
  protected view = inject(WeatherView);

  readonly today = signal(
    new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
  );

  readonly temperature = computed(() => {
    const value = this.store.forecast()?.current?.temperature_2m;
    const unit = this.store.units().temperature === 'celsius' ? '°C' : '°F';

    return `${value} ${unit}`;
  });
}
