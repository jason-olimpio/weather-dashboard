import { Component, inject, signal } from '@angular/core';
import { SlicePipe } from '@angular/common';

import { WeatherStore } from '../store/weather.store';
import { WeatherView } from '../store/weather-view';

@Component({
  selector: 'app-search-bar',
  imports: [SlicePipe],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css'
})
export class SearchBar {
  protected store = inject(WeatherStore);
  protected view = inject(WeatherView);
}
