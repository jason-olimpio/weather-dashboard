import { Component, inject } from '@angular/core';

import { WeatherStore } from '../store/weather.store';

@Component({
  selector: 'app-page-error',
  imports: [],
  templateUrl: './page-error.html',
})
export class PageError {
  readonly store = inject(WeatherStore)
}
