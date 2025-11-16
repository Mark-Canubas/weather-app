import { Component, signal, afterNextRender } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
    selector: 'app-loading-spinner',
    imports: [ProgressSpinnerModule],
    templateUrl: './loading-spinner.html'
})
export class LoadingSpinner {
    isBrowser = signal(false);

    constructor() {
        afterNextRender(() => {
            this.isBrowser.set(true);
        });
    }
}
