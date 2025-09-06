import { Component, inject, OnInit, resource, signal } from '@angular/core';
import { Weather } from '../../services/weather/weather';
import { SampleCard } from '../../components/sample-card/sample-card';
import { SearchBar } from '../../components/search-bar/search-bar';

@Component({
  selector: 'app-home',
  imports: [
    SampleCard,
    SearchBar
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  private readonly weatherService = inject(Weather);

  city = signal('Makati');

  weatherDataResource = resource({
    loader: () => this.weatherService.getWeather(this.city())
  });

  onCitySearch(city: string) {
    this.city.set(city);
    this.weatherDataResource.reload();
  }
}
