import { Component, inject } from '@angular/core';

import { Header } from './header/header';
import { SearchBar } from './search-bar/search-bar';

import { WeatherCard } from './weather-card/weather-card';
import { HourlyForecastCard } from './hourly-forecast-card/hourly-forecast-card';

import { WeatherView } from './store/weather-view';
import { WeatherStore } from './store/weather.store';

@Component({
  selector: 'app-root',
  imports: [Header, SearchBar, WeatherCard, HourlyForecastCard],
  providers: [WeatherView],
  templateUrl: './app.html',
})
export class App {
  protected store = inject(WeatherStore);
}
