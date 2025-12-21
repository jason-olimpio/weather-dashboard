import { Component, inject, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';

import { Header } from './header/header';
import { SearchBar } from './search-bar/search-bar';

import { WeatherStore } from './store/weather.store';

import { WeatherCard } from './weather-card/weather-card';
import { HourlyForecastCard } from './hourly-forecast-card/hourly-forecast-card';
import { WeatherView } from './store/weather-view';

@Component({
  selector: 'app-root',
  imports: [Header, SearchBar, WeatherCard, HourlyForecastCard],
  providers: [WeatherView],
  templateUrl: './app.html',
})
export class App implements OnInit {
  protected store = inject(WeatherStore);

  ngOnInit = (): void => initFlowbite();
}
