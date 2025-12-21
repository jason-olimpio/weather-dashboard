import { Component, inject } from '@angular/core';
import { WeatherStore } from '../store/weather.store';
import { TemperatureUnit, WindUnit, PrecipitationUnit } from '../open-meteo.service';

type UnitSection =
  | {
      key: 'temperature';
      title: string;
      options: readonly { value: TemperatureUnit; label: string }[];
    }
  | { key: 'wind'; title: string; options: readonly { value: WindUnit; label: string }[] }
  | {
      key: 'precipitation';
      title: string;
      options: readonly { value: PrecipitationUnit; label: string }[];
    };

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
})
export class Header {
  protected store = inject(WeatherStore);

  protected readonly unitSections = [
    {
      key: 'temperature',
      title: 'Temperature',
      options: [
        { value: 'celsius', label: 'Celsius (°C)' },
        { value: 'fahrenheit', label: 'Fahrenheit (°F)' },
      ],
    },
    {
      key: 'wind',
      title: 'Wind Speed',
      options: [
        { value: 'kmh', label: 'km/h' },
        { value: 'mph', label: 'mph' },
      ],
    },
    {
      key: 'precipitation',
      title: 'Precipitation',
      options: [
        { value: 'mm', label: 'mm' },
        { value: 'in', label: 'in' },
      ],
    },
  ] as const satisfies readonly UnitSection[];
}
