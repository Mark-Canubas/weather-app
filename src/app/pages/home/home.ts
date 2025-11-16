import { Component, inject, signal, resource, ResourceRef } from '@angular/core';
import { Weather } from '../../services/weather/weather';
import { SampleCard } from '../../components/sample-card/sample-card';
import { WeatherSearch } from '../../components/weather-search/weather-search';
import { LoadingSpinner } from '../../components/loading-spinner/loading-spinner';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { IWeather } from '../../models/weather.model';

@Component({
  selector: 'app-home',
  imports: [
    SampleCard,
    WeatherSearch,
    LoadingSpinner,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  private readonly weatherService = inject(Weather);
  private readonly messageService = inject(MessageService);

  currentCity = signal('Makati');
  unitSystem = signal<'metric' | 'imperial'>('metric'); // 'metric' for Celsius, 'imperial' for Fahrenheit

  public readonly weatherDataResource: ResourceRef<IWeather | undefined> = resource({
    loader: async () => {
      const city = this.currentCity();
      const units = this.unitSystem();
      try {
        const data = await this.weatherService.getWeather(city, units);

        const tableData = {
          city: data.name,
          country: data.sys.country,
          coordinates: `Lat: ${data.coord.lat}, Lon: ${data.coord.lon}`,
          temperature: data.main.temp,
          feelsLike: data.main.feels_like,
          tempMin: data.main.temp_min,
          tempMax: data.main.temp_max,
          pressure: data.main.pressure,
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          windDegree: data.wind.deg,
          visibility: data.visibility,
          cloudiness: data.clouds?.all || 0,
          weatherMain: data.weather[0].main,
          weatherDescription: data.weather[0].description,
          weatherIcon: data.weather[0].icon,
          sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString(),
          sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString(),
          timezone: data.timezone,
          units: units
        };
        
        console.table(tableData);
      
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Weather data for ${city}`,
          life: 2000
        });
        
        return data;
      } catch (error: any) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch weather data. Please check the city name and try again.',
          life: 5000
        });
        throw error;
      }
    }
  });

  onSearchCity(event: {city: string, unit: 'metric' | 'imperial'}) {
    this.currentCity.set(event.city);
    this.unitSystem.set(event.unit);
    this.weatherDataResource.reload();
  }

  toggleUnitSystem() {
    this.unitSystem.set(this.unitSystem() === 'metric' ? 'imperial' : 'metric');
    this.weatherDataResource.reload();
  }
}
