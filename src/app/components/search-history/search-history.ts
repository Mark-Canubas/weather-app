import { Component, output, input, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DialogModule } from 'primeng/dialog';

export interface SearchHistoryItem {
    city: string;
    country: string;
    timestamp: Date;
    units: 'metric' | 'imperial';
}

@Component({
    selector: 'app-search-history',
    imports: [DialogModule],
    templateUrl: './search-history.html'
})
export class SearchHistory {
    private platformId = inject(PLATFORM_ID);

    public readonly isVisible = signal<boolean>(false);
    public readonly history = signal<SearchHistoryItem[]>([]);

    public readonly itemSelected = output<SearchHistoryItem>();
    public readonly historyCleared = output<void>();

    ngOnInit() {
        this.loadHistory();
    }

    public isBrowser(): boolean {
        return isPlatformBrowser(this.platformId);
    }

    public toggle(): void {
        this.isVisible.set(!this.isVisible());
    }

    public show(): void {
        this.isVisible.set(true);
    }

    public hide(): void {
        this.isVisible.set(false);
    }

    public addItem(city: string, country: string, units: 'metric' | 'imperial'): void {
        const currentHistory = this.history();

        const filtered = currentHistory.filter(item => !(item.city.toLowerCase() === city.toLowerCase() && item.country === country));
        
        const newHistory = [
            { city, country, timestamp: new Date(), units },
            ...filtered
        ].slice(0, 10); // Keep only last 10 searches

        this.history.set(newHistory);
        this.saveHistory(newHistory);
    }

    public selectItem(item: SearchHistoryItem): void {
        this.itemSelected.emit(item);
        this.hide();
    }

    public clear(): void {
        this.history.set([]);
        if (this.isBrowser() && typeof window !== 'undefined' && window.localStorage) {
            localStorage.removeItem('weatherSearchHistory');
        }
        this.historyCleared.emit();
    }

    public getTimeAgo(date: Date): string {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);

        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    }

    private loadHistory(): void {
        if (this.isBrowser() && typeof window !== 'undefined' && window.localStorage) {
            const stored = localStorage.getItem('weatherSearchHistory');
            if (stored) {
                try {
                    const history = JSON.parse(stored).map((item: any) => ({
                        ...item,
                        timestamp: new Date(item.timestamp)
                    }));
                    this.history.set(history);
                } catch (error) {
                    console.error('Failed to load search history:', error);
                }
            }
        }
    }

    private saveHistory(history: SearchHistoryItem[]): void {
        if (this.isBrowser() && typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('weatherSearchHistory', JSON.stringify(history));
        }
    }
}
