import { Component, input, signal, afterNextRender } from '@angular/core';
import { IWeather } from '../../models/weather.model';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-sample-card',
  imports: [CardModule, DividerModule, DatePipe, DecimalPipe],
  templateUrl: './sample-card.html',
  styleUrl: './sample-card.css'
})
export class SampleCard {
  readonly weatherData = input<IWeather>();
  readonly unitSystem = input<'metric' | 'imperial'>('metric');
  isBrowser = signal(false);

  constructor() {
    afterNextRender(() => {
      this.isBrowser.set(true);
    });
  }

  getWeatherIconUrl(icon: string): string {
    return `https://openweathermap.org/img/wn/${icon}@4x.png`;
  }

  getTemperatureUnit(): string {
    return this.unitSystem() === 'imperial' ? '°F' : '°C';
  }

  getFormattedTime(timestamp: number): Date {
    return new Date(timestamp * 1000);
  }
}
