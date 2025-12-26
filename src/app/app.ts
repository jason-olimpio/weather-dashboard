import { Component, inject } from '@angular/core';

import { Header } from './header/header';
import { SearchBar } from './search-bar/search-bar';

import { WeatherCard } from './weather-card/weather-card';
import { HourlyForecastCard as HourlyForecast } from './hourly-forecast/hourly-forecast';
import { Highlights } from './highlights/highlights';
import { DailyForecast } from './daily-forecast/daily-forecast';
import { PageError } from './page-error/page-error';

import { WeatherView } from './store/weather-view';
import { WeatherStore } from './store/weather.store';

@Component({
  selector: 'app-root',
  imports: [Header, SearchBar, PageError, WeatherCard, Highlights, HourlyForecast, DailyForecast],
  providers: [WeatherView],
  templateUrl: './app.html',
})
export class App {
  protected store = inject(WeatherStore);
  protected view = inject(WeatherView);
}
