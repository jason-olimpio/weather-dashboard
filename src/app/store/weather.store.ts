import { Injectable, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, EMPTY, merge, of } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  map,
  shareReplay,
  startWith,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

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

  readonly selectedForecastDay = signal<number>(1);

  readonly isGeocoding = signal(false);
  readonly isForecasting = signal(false);

  readonly hasGeocodingError = signal(false);
  readonly hasForecastError = signal(false);

  private readonly geocodeRefresh = signal(0);
  private readonly forecastRefresh = signal(0);

  private readonly query$ = toObservable(this.locationQuery).pipe(
    map((q) => q.trim()),
    debounceTime(250),
    distinctUntilChanged(),
    startWith(''),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  private readonly geocodeTrigger$ = merge(
    this.query$.pipe(filter((queryText) => queryText.length >= 2)),
    toObservable(this.geocodeRefresh).pipe(
      withLatestFrom(this.query$),
      map(([, queryText]) => queryText),
      filter((queryText) => queryText.length >= 2),
    ),
  );

  private readonly locationResults$ = this.geocodeTrigger$.pipe(
    tap(() => {
      this.selectedLocation.set(null);
      this.isGeocoding.set(true);
      this.hasGeocodingError.set(false);
    }),
    switchMap((query) =>
      this.api.geocode(query, 10).pipe(
        catchError(() => {
          this.hasGeocodingError.set(true);

          return of([] as LocationResult[]);
        }),
        finalize(() => this.isGeocoding.set(false)),
      ),
    ),
  );

  readonly locationResults = toSignal(this.locationResults$, {
    initialValue: [] as LocationResult[],
  });

  private readonly forecast$ = combineLatest([
    toObservable(this.selectedLocation),
    toObservable(this.units),
    toObservable(this.forecastRefresh),
  ]).pipe(
    filter(([location]) => !!location),
    tap(() => {
      this.isForecasting.set(true);
      this.hasForecastError.set(false);
    }),
    switchMap(([location, units]) => {
      if (!location) return EMPTY;

      return this.api.forecast(location.latitude, location.longitude, units).pipe(
        catchError(() => {
          this.hasForecastError.set(true);

          return EMPTY;
        }),
        finalize(() => this.isForecasting.set(false)),
      );
    }),
  );

  readonly forecast = toSignal<ForecastResponse | null>(this.forecast$, {
    initialValue: null,
  });

  retry = () => {
    if (this.hasGeocodingError())
      this.geocodeRefresh.update((refreshCounter) => refreshCounter + 1);

    if (this.hasForecastError())
      this.forecastRefresh.update((refreshCounter) => refreshCounter + 1);
  };

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

  setUnit = <K extends Exclude<keyof UnitsState, 'system'>>(key: K, value: UnitsState[K]) =>
    this.units.update((prev) => ({ ...prev, [key]: value }));

  setSelectedForecastDay = (day: string | number) =>
    this.selectedForecastDay.set(typeof day === 'string' ? parseInt(day, 10) : day);

  selectLocation(location: LocationResult) {
    this.selectedLocation.set(location);
    this.locationQuery.set('');
  }
}
