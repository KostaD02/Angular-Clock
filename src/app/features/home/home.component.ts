import { Component, computed, effect, signal } from '@angular/core';
import { interval, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

interface Time {
  value: string;
  degree: string;
}

export type TimeSafe = Time | null;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export default class HomeComponent {
  readonly hour = signal<TimeSafe>(null);
  readonly minutes = signal<TimeSafe>(null);
  readonly seconds = signal<TimeSafe>(null);

  readonly logs = signal<[TimeSafe, TimeSafe, TimeSafe][]>([]);

  readonly currentTime = computed(
    () =>
      `${this.convertedNumber(this.hour()?.value)}:${this.convertedNumber(
        this.minutes()?.value
      )}:${this.convertedNumber(this.seconds()?.value)}`
  );

  constructor() {
    interval(1000)
      .pipe(
        takeUntilDestroyed(),
        tap(() => {
          const current = new Date();
          this.hour.set({
            value: ` ${current.getHours()} `.repeat(3),
            degree: `rotate(${
              (current.getHours() / 12) * 360 +
              (current.getMinutes() / 60) * 30 +
              90
            }deg)`,
          });
          this.minutes.set({
            value: ` ${current.getMinutes()} `.repeat(4),
            degree: `rotate(${
              (current.getMinutes() / 60) * 360 +
              (current.getSeconds() / 60) * 6 +
              90
            }deg)`,
          });
          this.seconds.set({
            value: ` ${current.getSeconds()} `.repeat(6),
            degree: `rotate(${(current.getSeconds() / 60) * 360 + 90}deg)`,
          });
          this.logs.update((prevLog) => [
            ...prevLog.slice(prevLog.length >= 10 ? 10 : 0),
            [this.hour(), this.minutes(), this.seconds()],
          ]);
        })
      )
      .subscribe();
    effect(() => {
      console.log(`${this.currentTime}`);
    });
  }

  private convertedNumber(text: string | undefined) {
    if (text) {
      const numbers = text.match(/\d+/g);
      return numbers ? numbers[0] : '';
    }
    return '';
  }
}
