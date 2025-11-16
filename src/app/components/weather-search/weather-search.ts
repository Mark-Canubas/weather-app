import { Component, output, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ButtonDirective } from "primeng/button";

@Component({
  selector: 'app-weather-search',
  imports: [ButtonDirective],
  templateUrl: './weather-search.html'
})

export class WeatherSearch {
  private platformId = inject(PLATFORM_ID);
  
  public readonly searchQuery = signal<string>('');
  public readonly searchTriggered = output<{ city: string; units: 'metric' | 'imperial' }>();

  public isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  public onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
  }

  public onSearch(): void {
    const query = this.searchQuery().trim();
    if (query) {
      this.searchTriggered.emit({ 
        city: query, 
        units: 'metric'
      });
    }
  }
}