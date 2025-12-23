import { AfterViewInit, Component, inject } from '@angular/core';
import { initFlowbite } from 'flowbite';

import { WeatherView } from '../store/weather-view';
import { WeatherStore } from '../store/weather.store';

@Component({
  selector: 'app-hourly-forecast-card',
  imports: [],
  templateUrl: './hourly-forecast-card.html',
})
export class HourlyForecastCard implements AfterViewInit {
  protected store = inject(WeatherStore);
  protected view = inject(WeatherView);

  ngAfterViewInit() {
    initFlowbite();
  }
}
