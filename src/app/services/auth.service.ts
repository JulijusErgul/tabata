import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user, User as FirebaseUser } from '@angular/fire/auth';

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

  constructor(private router: Router, private auth: Auth) {
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
      } else {
        this.currentUserSubject.next(null);
      }
    });
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

      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        credentials.email,
        credentials.password
      );

      // Update display name
      if (userCredential.user) {
        await (userCredential.user as any).updateProfile({
          displayName: credentials.username
        });
      }

      return { success: true, message: 'Registration successful!' };
    } catch (error: any) {
      console.error('Registration error:', error);
      
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
    try {
      // For Firebase Auth, we'll use email for login
      // You might want to store username-email mappings in Firestore for username login
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        credentials.usernameOrEmail, // Assuming this is an email
        credentials.password
      );

      if (userCredential.user) {
        return { success: true, message: 'Login successful!' };
      } else {
        return { success: false, message: 'Invalid email or password' };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
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
    try {
      await signOut(this.auth);
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }
}
