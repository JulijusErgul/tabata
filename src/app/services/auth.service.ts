import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
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

  constructor(private router: Router) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
      } catch (error) {
        localStorage.removeItem('currentUser');
      }
    }
  }

  async register(credentials: RegisterCredentials): Promise<{ success: boolean; message: string }> {
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

      // Check if user already exists
      const existingUser = await this.checkUserExists(credentials.username, credentials.email);
      if (existingUser) {
        return { success: false, message: existingUser };
      }

      // Hash password and create user
      const hashedPassword = await this.hashPassword(credentials.password);
      const user = await this.createUser({
        username: credentials.username,
        email: credentials.email,
        password: hashedPassword
      });

      if (user) {
        this.currentUserSubject.next(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        return { success: true, message: 'Registration successful!' };
      } else {
        return { success: false, message: 'Failed to create user' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'An error occurred during registration' };
    }
  }

  async login(credentials: LoginCredentials): Promise<{ success: boolean; message: string }> {
    try {
      const user = await this.authenticateUser(credentials.usernameOrEmail, credentials.password);

      if (user) {
        this.currentUserSubject.next(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        return { success: true, message: 'Login successful!' };
      } else {
        return { success: false, message: 'Invalid username/email or password' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'An error occurred during login' };
    }
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  // Database methods (these would be implemented with actual SQLite)
  private async checkUserExists(username: string, email: string): Promise<string | null> {
    // Simulate database check
    const users = this.getStoredUsers();
    if (users.find(u => u.username === username)) {
      return 'Username already exists';
    }
    if (users.find(u => u.email === email)) {
      return 'Email already exists';
    }
    return null;
  }

  private async createUser(userData: { username: string; email: string; password: string }): Promise<User | null> {
    // Simulate database creation
    const users = this.getStoredUsers();
    const newUser: User = {
      id: Date.now(),
      username: userData.username,
      email: userData.email,
      created_at: new Date().toISOString()
    };

    users.push({
      ...newUser,
      password: userData.password
    });

    this.storeUsers(users);
    return newUser;
  }

  private async authenticateUser(usernameOrEmail: string, password: string): Promise<User | null> {
    // Simulate database authentication
    const users = this.getStoredUsers();
    const user = users.find(u =>
      (u.username === usernameOrEmail || u.email === usernameOrEmail) &&
      u.password === password
    );

    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    }

    return null;
  }

  private async hashPassword(password: string): Promise<string> {
    // In a real implementation, you would use bcrypt
    // For now, we'll use a simple hash for demonstration
    return btoa(password); // Base64 encoding (not secure, just for demo)
  }

  // Local storage methods for demo purposes
  private getStoredUsers(): any[] {
    const usersStr = localStorage.getItem('users');
    return usersStr ? JSON.parse(usersStr) : [];
  }

  private storeUsers(users: any[]): void {
    localStorage.setItem('users', JSON.stringify(users));
  }
}
