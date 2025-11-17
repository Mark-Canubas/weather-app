import { Component, inject, signal, resource, ResourceRef, viewChild } from '@angular/core';
import { Weather } from '../../services/weather/weather';
import { IWeather } from '../../models/weather.model';
import { SampleCard } from '../../components/sample-card/sample-card';
import { WeatherSearch } from '../../components/weather-search/weather-search';
import { LoadingSpinner } from '../../components/loading-spinner/loading-spinner';
import { SearchHistory, SearchHistoryItem } from '../../components/search-history/search-history';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-home',
  imports: [
    SampleCard,
    WeatherSearch,
    SearchHistory,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './home.html'
})
export class Home {

  private readonly weatherService = inject(Weather);
  private readonly messageService = inject(MessageService);
  
  public readonly searchHistoryComponent = viewChild.required(SearchHistory);

  public readonly cityName = signal<string>('');
  public readonly unitSystem = signal<'metric' | 'imperial'>('metric');

  public readonly weatherDataResource: ResourceRef<IWeather | undefined> = resource({
    loader: async () => {
      try {
        const city = this.cityName();
        const units = this.unitSystem();

        if (!city) {
          return undefined;
        }

        const data = await this.weatherService.getWeather(city, units);

        this.searchHistoryComponent().addItem(data.name, data.sys.country, units);

        console.log('Full Weather Data:', data);
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
          detail: `Weather data for ${data.name}, City.`,
          life: 3000
        });

        return data;
      } catch (error: any) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:`Error fetching weather data for ${this.cityName()}`,
          life: 5000
        });
        throw error;
      }
    }
  });

  public onSearchCity(event: { city: string; units: 'metric' | 'imperial' }): void {
    this.cityName.set(event.city);
    this.unitSystem.set(event.units);
    this.weatherDataResource.reload();
  }

  public toggleUnitSystem(): void {
    const newUnit = this.unitSystem() === 'metric' ? 'imperial' : 'metric';
    this.unitSystem.set(newUnit);
    
    if (this.cityName()) {
      this.weatherDataResource.reload();
    }
  }

  public onHistoryItemSelected(item: SearchHistoryItem): void {
    this.cityName.set(item.city);
    this.unitSystem.set(item.units);
    this.weatherDataResource.reload();
  }

  public onHistoryCleared(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Cleared',
      detail: 'Search history cleared',
      life: 2000
    });
  }
}