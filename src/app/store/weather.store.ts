import { Injectable, signal, computed, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';

import {
  OpenMeteoService,
  LocationResult,
  UnitsState,
  ForecastResponse,
} from '../open-meteo.service';

@Injectable({ providedIn: 'root' })
export class WeatherStore {
  readonly api = inject(OpenMeteoService);

  readonly locationQuery = signal('');
  readonly selectedLocation = signal<LocationResult | null>(null);
  readonly units = signal<UnitsState>({
    system: 'metric',
    temperature: 'celsius',
    wind: 'kmh',
    precipitation: 'mm',
  });

  readonly isGeocoding = signal(false);
  readonly isForecasting = signal(false);

  readonly selectedForecastDay = signal<number>(1);
  readonly allHourly = signal<
    { time: string; dayIndex: number; temperature: number; weathercode: number }[]
  >([]);

  hourlyForSelectedDay = computed(() =>
    this.allHourly().filter((hourly) => hourly.dayIndex === this.selectedForecastDay()),
  );

  private readonly locationResults$ = toObservable(this.locationQuery).pipe(
    map((query) => query.trim()),
    debounceTime(250),
    distinctUntilChanged(),
    filter((query) => query.length >= 2),
    tap(() => this.selectedLocation.set(null)),
    switchMap((query) => {
      this.isGeocoding.set(true);

      return this.api.geocode(query, 10).pipe(tap({ complete: () => this.isGeocoding.set(false) }));
    }),
  );

  readonly locationResults = toSignal(this.locationResults$, {
    initialValue: [] as LocationResult[],
  });

  private readonly forecast$ = combineLatest([
    toObservable(this.selectedLocation),
    toObservable(this.units),
  ]).pipe(
    filter(([location]) => !!location),
    tap(() => this.isForecasting.set(true)),
    switchMap(([location, units]) =>
      this.api
        .forecast(location!.latitude, location!.longitude, units)
        .pipe(tap({ complete: () => this.isForecasting.set(false) })),
    ),
  );

  readonly forecast = toSignal<ForecastResponse | null>(this.forecast$, {
    initialValue: null,
  });

  toggleImperial = () =>
    this.units.update((previousUnit) => {
      const system = previousUnit.system === 'imperial' ? 'metric' : 'imperial';

      return {
        ...previousUnit,
        system,
        temperature: system === 'metric' ? 'celsius' : 'fahrenheit',
        wind: system === 'metric' ? 'kmh' : 'mph',
        precipitation: system === 'metric' ? 'mm' : 'in',
      };
    });

  setUnit = (key: keyof UnitsState, value: string) =>
    this.units.update((previousUnit) => ({ ...previousUnit, [key]: value }));

  setSelectedForecastDay = (day: string | number) =>
    this.selectedForecastDay.set(typeof day === 'string' ? parseInt(day) : day);

  selectLocation(location: LocationResult) {
    this.selectedLocation.set(location);
    this.locationQuery.set('');
  }
}
