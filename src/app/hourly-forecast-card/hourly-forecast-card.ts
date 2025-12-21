import { Component, inject } from '@angular/core';

import { WeatherView } from '../store/weather-view';
import { WeatherStore } from '../store/weather.store';

@Component({
  selector: 'app-hourly-forecast-card',
  imports: [],
  templateUrl: './hourly-forecast-card.html',
})
export class HourlyForecastCard {
  protected store = inject(WeatherStore)
  protected view = inject(WeatherView);
}
