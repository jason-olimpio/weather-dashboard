import { Component, computed, inject } from '@angular/core';
import { WeatherStore } from '../store/weather.store';

type HighlightItem = {
  id: string;
  label: string;
  value: string | number | undefined;
};

@Component({
  selector: 'app-highlights',
  templateUrl: './highlights.html',
})
export class Highlights {
  protected store = inject(WeatherStore);

  protected readonly items = computed<HighlightItem[]>(() => {
    const current = this.store.forecast()?.current;
    const units = this.store.units();
    const loading = this.store.isForecasting();

    const unitLabel = {
      temperature: units.temperature === 'celsius' ? '°C' : '°F',
      wind:
        units.wind === 'kmh'
          ? 'km/h'
          : units.wind === 'mph'
            ? 'mph'
            : units.wind === 'ms'
              ? 'm/s'
              : 'kn',
      precipitation: units.precipitation === 'mm' ? 'mm' : 'in',
    };

    const makeDisplay = (value: string | number | undefined, unit?: string) => {
      if (loading || value == undefined) return '-';

      return `${value} ${unit}`;
    };

    return [
      {
        id: 'feelsLike',
        label: 'Feels Like',
        value: makeDisplay(current?.apparent_temperature, unitLabel.temperature),
      },
      {
        id: 'humidity',
        label: 'Humidity',
        value: makeDisplay(current?.relative_humidity_2m, '%'),
      },
      {
        id: 'wind',
        label: 'Wind',
        value: makeDisplay(current?.wind_speed_10m, unitLabel.wind),
      },
      {
        id: 'precipitation',
        label: 'Precipitation',
        value: makeDisplay(current?.precipitation, unitLabel.precipitation),
      },
    ];
  });
}
