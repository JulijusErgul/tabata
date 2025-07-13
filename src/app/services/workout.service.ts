import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, orderBy, collectionData, deleteDoc, doc, getDocs } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable, of, switchMap } from 'rxjs';

export interface PreviousWorkout {
  date: string;
  rounds: number;
  workSeconds: number;
}

@Injectable({ providedIn: 'root' })
export class WorkoutService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  private getUserWorkoutsCollection() {
    const user = this.auth.currentUser;
    if (!user) throw new Error('User not authenticated');
    return collection(this.firestore, `users/${user.uid}/workouts`);
  }

  async addWorkout(workout: PreviousWorkout) {
    const col = this.getUserWorkoutsCollection();
    await addDoc(col, workout);
  }

  getWorkouts(): Observable<PreviousWorkout[]> {
    return new Observable(subscriber => {
      const unsub = this.auth.onAuthStateChanged(async user => {
        if (!user) {
          subscriber.next([]);
          return;
        }
        const col = collection(this.firestore, `users/${user.uid}/workouts`);
        const q = query(col, orderBy('date', 'desc'));
        collectionData(q, { idField: 'id' }).subscribe(data => {
          subscriber.next(data as PreviousWorkout[]);
        });
      });
      return { unsubscribe: unsub };
    });
  }

  async clearWorkouts() {
    const col = this.getUserWorkoutsCollection();
    const docs = await getDocs(col);
    for (const d of docs.docs) {
      await deleteDoc(d.ref);
    }
  }
} 