import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user, User as FirebaseUser, updateProfile, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { LoggerService } from './logger.service';

export interface User {
  uid: string;
  email: string | null;
  displayName?: string | null;
  photoURL?: string | null;
}

export interface LoginCredentials {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  public user$: Observable<FirebaseUser | null>;

  constructor(private router: Router, private auth: Auth, private logger: LoggerService) {
    this.user$ = user(this.auth);
    this.user$.subscribe((firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const user: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL
        };
        this.currentUserSubject.next(user);
        this.logger.info('User authenticated', user);
      } else {
        this.currentUserSubject.next(null);
        this.logger.info('User signed out or not authenticated');
      }
    });
  }

  async register(credentials: RegisterCredentials): Promise<{ success: boolean; message: string }> {
    this.logger.info('Attempting registration', credentials);
    try {
      // Validate passwords match
      if (credentials.password !== credentials.confirmPassword) {
        return { success: false, message: 'Passwords do not match' };
      }

      // Validate password strength
      if (credentials.password.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters long' };
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(credentials.email)) {
        return { success: false, message: 'Please enter a valid email address' };
      }

      // Validate username
      if (credentials.username.length < 3) {
        return { success: false, message: 'Username must be at least 3 characters long' };
      }

      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        credentials.email,
        credentials.password
      );
      this.logger.info('Registration successful', { email: credentials.email });
      // Save username-email mapping to localStorage
      this.saveUsernameEmailMapping(credentials.username, credentials.email);

      // Update display name
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: credentials.username
        });
        this.logger.info('Display name set after registration', { displayName: credentials.username });
      }

      return { success: true, message: 'Registration successful!' };
    } catch (error: any) {
      this.logger.error('Registration error', error, JSON.stringify(error), String(error));
      
      // Handle Firebase Auth errors
      if (error.code === 'auth/email-already-in-use') {
        return { success: false, message: 'Email already exists' };
      } else if (error.code === 'auth/weak-password') {
        return { success: false, message: 'Password is too weak' };
      } else if (error.code === 'auth/invalid-email') {
        return { success: false, message: 'Invalid email address' };
      }
      
      return { success: false, message: 'An error occurred during registration' };
    }
  }

  async login(credentials: LoginCredentials): Promise<{ success: boolean; message: string }> {
    this.logger.info('Attempting login', credentials);
    try {
      let email = credentials.usernameOrEmail;
      if (!this.isEmail(email)) {
        // Try to look up email by username
        const foundEmail = this.getEmailByUsername(email);
        if (!foundEmail) {
          this.logger.warn('Login failed: Username not found');
          return { success: false, message: 'Username not found' };
        }
        email = foundEmail;
      }
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        credentials.password
      );
      if (userCredential.user) {
        this.logger.info('Login successful', { email: userCredential.user.email });
        return { success: true, message: 'Login successful!' };
      } else {
        this.logger.warn('Login failed: Invalid email or password');
        return { success: false, message: 'Invalid email or password' };
      }
    } catch (error: any) {
      this.logger.error('Login error', error, JSON.stringify(error), String(error));
      
      // Handle Firebase Auth errors
      if (error.code === 'auth/user-not-found') {
        return { success: false, message: 'User not found' };
      } else if (error.code === 'auth/wrong-password') {
        return { success: false, message: 'Invalid password' };
      } else if (error.code === 'auth/invalid-email') {
        return { success: false, message: 'Invalid email address' };
      }
      
      return { success: false, message: 'An error occurred during login' };
    }
  }

  async logout(): Promise<void> {
    this.logger.info('Attempting logout');
    try {
      await signOut(this.auth);
      this.logger.info('Logout successful');
      this.router.navigate(['/login']);
    } catch (error) {
      this.logger.error('Logout error', error, JSON.stringify(error), String(error));
    }
  }

  async signInWithGoogle(): Promise<{ success: boolean; message: string }> {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      if (result.user) {
        this.logger.info('Google sign-in successful', { email: result.user.email });
        return { success: true, message: 'Login successful!' };
      } else {
        this.logger.warn('Google sign-in failed: No user');
        return { success: false, message: 'Google sign-in failed' };
      }
    } catch (error: any) {
      this.logger.error('Google sign-in error', error, JSON.stringify(error), String(error));
      return { success: false, message: 'An error occurred during Google sign-in' };
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  private saveUsernameEmailMapping(username: string, email: string) {
    const key = 'tabataUsernames';
    const arr = JSON.parse(localStorage.getItem(key) || '[]');
    // Remove any previous mapping for this username
    const filtered = arr.filter((entry: any) => entry.username !== username);
    filtered.push({ username, email });
    localStorage.setItem(key, JSON.stringify(filtered));
    this.logger.info('Saved username-email mapping', { username, email });
  }

  private getEmailByUsername(username: string): string | null {
    const key = 'tabataUsernames';
    const arr = JSON.parse(localStorage.getItem(key) || '[]');
    const found = arr.find((entry: any) => entry.username === username);
    return found ? found.email : null;
  }

  private isEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }
}
