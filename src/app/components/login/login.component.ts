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
import { AuthService, LoginCredentials } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  credentials: LoginCredentials = {
    usernameOrEmail: '',
    password: ''
  };

  isLoading = false;
  showPassword = false;
  private userSub?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private logger: LoggerService
  ) {}

  async onSubmit(): Promise<void> {
    this.logger.info('Login form submitted', this.credentials);
    if (!this.credentials.usernameOrEmail || !this.credentials.password) {
      this.logger.warn('Login form incomplete');
      this.showMessage('Please fill in all fields', 'error');
      return;
    }

    this.isLoading = true;

    try {
      const result = await this.authService.login(this.credentials);

      if (result.success) {
        this.logger.info('Login successful, navigating to /timer');
        this.showMessage(result.message, 'success');
        this.userSub = this.authService.user$.subscribe(user => {
          if (user) {
            this.router.navigate(['/timer']);
            this.userSub?.unsubscribe();
          }
        });
      } else {
        this.logger.warn('Login failed', result);
        this.showMessage(result.message, 'error');
      }
    } catch (error) {
      this.logger.error('Login error', error);
      this.showMessage('An error occurred during login', 'error');
    } finally {
      this.isLoading = false;
    }
  }

  async loginWithGoogle(): Promise<void> {
    this.isLoading = true;
    try {
      const result = await this.authService.signInWithGoogle();
      if (result.success) {
        this.logger.info('Google login successful, waiting for user observable');
        this.showMessage(result.message, 'success');
        this.userSub = this.authService.user$.subscribe(user => {
          if (user) {
            this.router.navigate(['/timer']);
            this.userSub?.unsubscribe();
          }
        });
      } else {
        this.logger.warn('Google login failed', result);
        this.showMessage(result.message, 'error');
      }
    } catch (error) {
      this.logger.error('Google login error', error);
      this.showMessage('An error occurred during Google login', 'error');
    } finally {
      this.isLoading = false;
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  private showMessage(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: type === 'success' ? ['success-snackbar'] : ['error-snackbar']
    });
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }
}
