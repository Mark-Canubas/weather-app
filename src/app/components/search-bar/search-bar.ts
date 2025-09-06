import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-search-bar',
  imports: [FormsModule, CommonModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css'
})

export class SearchBar {
  city = signal('');

  search  = output<string>();

  units = signal('');

  searchUnits = output<string>();

  onUnitsChange() {
    this.searchUnits.emit(this.units());
  }

  onSearch() {
    this.search.emit(this.city());
  }

}
