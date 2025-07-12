import { Component } from '@angular/core';
import { TabataTimerComponent } from './tabata-timer/tabata-timer.component';

@Component({
  selector: 'app-root',
  imports: [TabataTimerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'mitt-projekt';
}
