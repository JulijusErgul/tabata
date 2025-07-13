import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService, RegisterCredentials } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  credentials: RegisterCredentials = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;
  private userSub?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private logger: LoggerService
  ) {}

  async onSubmit(): Promise<void> {
    this.logger.info('Registration form submitted', this.credentials);
    if (!this.validateForm()) {
      this.logger.warn('Registration form validation failed');
      return;
    }

    this.isLoading = true;

    try {
      const result = await this.authService.register(this.credentials);

      if (result.success) {
        this.logger.info('Registration successful, navigating to /timer');
        this.showMessage(result.message, 'success');
        localStorage.setItem('showWelcomeSnackbar', 'true');
        this.userSub = this.authService.user$.subscribe(user => {
          if (user) {
            this.router.navigate(['/timer']);
            this.userSub?.unsubscribe();
          }
        });
      } else {
        this.logger.warn('Registration failed', result);
        this.showMessage(result.message, 'error');
      }
    } catch (error) {
      this.logger.error('Registration error', error);
      this.showMessage('An error occurred during registration', 'error');
    } finally {
      this.isLoading = false;
    }
  }

  async registerWithGoogle(): Promise<void> {
    this.isLoading = true;
    try {
      const result = await this.authService.signInWithGoogle();
      if (result.success) {
        this.logger.info('Google registration successful, waiting for user observable');
        this.showMessage(result.message, 'success');
        this.userSub = this.authService.user$.subscribe(user => {
          if (user) {
            this.router.navigate(['/timer']);
            this.userSub?.unsubscribe();
          }
        });
      } else {
        this.logger.warn('Google registration failed', result);
        this.showMessage(result.message, 'error');
      }
    } catch (error) {
      this.logger.error('Google registration error', error);
      this.showMessage('An error occurred during Google registration', 'error');
    } finally {
      this.isLoading = false;
    }
  }

  private validateForm(): boolean {
    if (!this.credentials.username || !this.credentials.email ||
        !this.credentials.password || !this.credentials.confirmPassword) {
      this.showMessage('Please fill in all fields', 'error');
      return false;
    }

    if (this.credentials.username.length < 3) {
      this.showMessage('Username must be at least 3 characters long', 'error');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.credentials.email)) {
      this.showMessage('Please enter a valid email address', 'error');
      return false;
    }

    if (this.credentials.password.length < 6) {
      this.showMessage('Password must be at least 6 characters long', 'error');
      return false;
    }

    if (this.credentials.password !== this.credentials.confirmPassword) {
      this.showMessage('Passwords do not match', 'error');
      return false;
    }

    return true;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  private showMessage(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: type === 'success' ? ['success-snackbar'] : ['error-snackbar']
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  getPasswordStrength(): string {
    const password = this.credentials.password;
    if (!password) return '';

    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) return 'weak';
    if (strength <= 4) return 'medium';
    return 'strong';
  }

  getPasswordStrengthColor(): string {
    const strength = this.getPasswordStrength();
    switch (strength) {
      case 'weak': return '#f44336';
      case 'medium': return '#ff9800';
      case 'strong': return '#4caf50';
      default: return '#ccc';
    }
  }
}
