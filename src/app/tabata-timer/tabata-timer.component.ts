import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoggerService } from '../services/logger.service';

export interface TabataSettings {
  rounds: number;
  workSeconds: number;
  restSeconds: number;
  restFrequency: number; // How often rest occurs (every N rounds)
  restBetweenRounds: number; // Rest time between complete rounds
}

export interface PreviousWorkout {
  date: string; // ISO string
  rounds: number;
  workSeconds: number;
}

@Component({
  selector: 'app-tabata-timer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSliderModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule
  ],
  templateUrl: './tabata-timer.component.html',
  styleUrl: './tabata-timer.component.css'
})
export class TabataTimerComponent implements OnInit, OnDestroy {
  settings: TabataSettings = {
    rounds: 8,
    workSeconds: 20,
    restSeconds: 10,
    restFrequency: 4,
    restBetweenRounds: 60
  };

  isRunning = false;
  isPaused = false;
  currentRound = 0;
  currentPhase: 'work' | 'rest' | 'roundRest' = 'work';
  timeRemaining = 0;
  totalTime = 0;
  private interval: any;
  previousWorkouts: PreviousWorkout[] = [];

  constructor(private snackBar: MatSnackBar, private logger: LoggerService) {}

  ngOnInit() {
    this.resetTimer();
    this.loadPreviousWorkouts();
    // Show welcome snackbar if just registered
    if (localStorage.getItem('showWelcomeSnackbar') === 'true') {
      this.snackBar.open('Welcome to Tabata Timer! 🎉', 'Close', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['success-snackbar']
      });
      localStorage.removeItem('showWelcomeSnackbar');
    }
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  startTimer() {
    this.logger.info('Timer started', this.settings);
    if (!this.isRunning) {
      this.isRunning = true;
      this.isPaused = false;
      this.runTimer();
    }
  }

  pauseTimer() {
    this.isPaused = !this.isPaused;
    this.logger.info(this.isPaused ? 'Timer paused' : 'Timer resumed');
    if (this.isPaused) {
      clearInterval(this.interval);
    } else {
      this.runTimer();
    }
  }

  stopTimer(workoutJustFinished: boolean = false) {
    this.logger.info('Timer stopped');
    this.isRunning = false;
    this.isPaused = false;
    clearInterval(this.interval);
    if (!workoutJustFinished) {
      this.resetTimer();
    }
  }

  resetTimer() {
    this.logger.info('Timer reset');
    this.currentRound = 0;
    this.currentPhase = 'work';
    this.timeRemaining = this.settings.workSeconds;
    this.totalTime = this.calculateTotalTime();
  }

  private runTimer() {
    this.interval = setInterval(() => {
      if (this.timeRemaining > 0) {
        this.timeRemaining--;
      } else {
        this.nextPhase();
      }
    }, 1000);
  }

  private nextPhase() {
    if (this.currentPhase === 'work') {
      // Check if we need a rest period
      if (this.currentRound % this.settings.restFrequency === 0 && this.currentRound > 0) {
        this.currentPhase = 'rest';
        this.timeRemaining = this.settings.restSeconds;
      } else if (this.currentRound >= this.settings.rounds) {
        // Workout complete
        this.saveWorkout();
        this.stopTimer(true); // pass a flag to indicate workout just finished
        return;
      } else {
        // Move to next round
        this.currentRound++;
        this.currentPhase = 'work';
        this.timeRemaining = this.settings.workSeconds;
      }
    } else if (this.currentPhase === 'rest') {
      // After rest, move to next round
      this.currentRound++;
      this.currentPhase = 'work';
      this.timeRemaining = this.settings.workSeconds;
    }

    // Check if we need rest between rounds
    if (this.currentRound > 0 && this.currentRound % this.settings.restFrequency === 0 && this.currentRound < this.settings.rounds) {
      this.currentPhase = 'roundRest';
      this.timeRemaining = this.settings.restBetweenRounds;
    }
  }

  calculateTotalTime(): number {
    let total = 0;
    for (let i = 0; i < this.settings.rounds; i++) {
      total += this.settings.workSeconds;
      if (i > 0 && i % this.settings.restFrequency === 0) {
        total += this.settings.restSeconds;
      }
      if (i > 0 && i % this.settings.restFrequency === 0 && i < this.settings.rounds - 1) {
        total += this.settings.restBetweenRounds;
      }
    }
    return total;
  }

  getProgress(): number {
    const totalTime = this.calculateTotalTime();
    const elapsed = totalTime - this.timeRemaining;
    return (elapsed / totalTime) * 100;
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  getPhaseText(): string {
    switch (this.currentPhase) {
      case 'work': return 'WORK';
      case 'rest': return 'REST';
      case 'roundRest': return 'ROUND REST';
      default: return '';
    }
  }

  getPhaseColor(): string {
    switch (this.currentPhase) {
      case 'work': return 'accent';
      case 'rest': return 'primary';
      case 'roundRest': return 'warn';
      default: return '';
    }
  }

  saveWorkout() {
    const workout: PreviousWorkout = {
      date: new Date().toISOString(),
      rounds: this.settings.rounds,
      workSeconds: this.settings.workSeconds
    };
    this.logger.info('Workout saved', workout);
    const workouts = this.getStoredWorkouts();
    workouts.unshift(workout); // newest first
    localStorage.setItem('tabataWorkouts', JSON.stringify(workouts));
    this.previousWorkouts = workouts;
  }

  loadPreviousWorkouts() {
    this.previousWorkouts = this.getStoredWorkouts();
  }

  getStoredWorkouts(): PreviousWorkout[] {
    const str = localStorage.getItem('tabataWorkouts');
    return str ? JSON.parse(str) : [];
  }

  applySettings() {
    this.logger.info('Tabata settings applied', this.settings);
    this.resetTimer();
    this.snackBar.open('Settings applied!', 'Close', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }
}
