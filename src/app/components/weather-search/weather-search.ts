import { Component, output, signal, afterNextRender } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-weather-search',
  imports: [
    InputTextModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule
  ],
  templateUrl: './weather-search.html',
  styleUrl: './weather-search.css'
})
export class WeatherSearch {
  searchQuery = signal('');
  selectedUnit = signal<'metric' | 'imperial'>('metric');
  searchTriggered = output<{city: string, unit: 'metric' | 'imperial'}>();
  isBrowser = signal(false);

  constructor() {
    afterNextRender(() => {
      this.isBrowser.set(true);
    });
  }

  onSearch() {
    const query = this.searchQuery().trim();
    if (query) {
      this.searchTriggered.emit({
        city: query,
        unit: this.selectedUnit()
      });
    }
  }

  onInputChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }

  toggleUnit() {
    this.selectedUnit.set(this.selectedUnit() === 'metric' ? 'imperial' : 'metric');
  }
}
