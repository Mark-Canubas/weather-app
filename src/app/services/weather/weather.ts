import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { lastValueFrom } from 'rxjs';
import { IWeatherService } from '../../interfaces/weather.interface';
import { IWeather } from '../../models/weather.model';

@Injectable({
  providedIn: 'root'
})
export class Weather implements IWeatherService {

  private readonly http = inject(HttpClient);
  private readonly apiKey = environment.weatherApiKey;
  private readonly baseUrl = environment.weatherBaseUrl;

  getWeather(city: string, units: 'metric' | 'imperial' | 'standard' = 'metric'): Promise<IWeather> {
    return lastValueFrom(this.http.get<IWeather>(`${this.baseUrl}?q=${city}&appid=${this.apiKey}&units=${units}`));
  }

}
