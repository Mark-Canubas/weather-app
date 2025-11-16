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

  // No longer need to convert - API returns in correct units
  getTemperature(temp: number): number {
    return temp;
  }

  getFormattedTime(timestamp: number): Date {
    return new Date(timestamp * 1000);
  }

  getWindDirection(deg: number): string {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(deg / 22.5) % 16;
    return directions[index];
  }

  getWindDirectionRotation(deg: number): string {
    return `rotate(${deg}deg)`;
  }

  getUVIndexLevel(clouds: number): string {
    if (clouds < 30) return 'High';
    if (clouds < 60) return 'Moderate';
    return 'Low';
  }

  getCloudCoverage(clouds: number): string {
    if (clouds < 20) return 'Clear';
    if (clouds < 50) return 'Partly Cloudy';
    if (clouds < 80) return 'Mostly Cloudy';
    return 'Overcast';
  }
}
