import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HourlyForecastCard } from './hourly-forecast';

describe('HourlyForecastCard', () => {
  let component: HourlyForecastCard;
  let fixture: ComponentFixture<HourlyForecastCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HourlyForecastCard],
    }).compileComponents();

    fixture = TestBed.createComponent(HourlyForecastCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
