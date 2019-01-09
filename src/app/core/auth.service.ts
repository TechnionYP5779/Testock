import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {User} from 'firebase';
import AuthProvider = firebase.auth.AuthProvider;
import * as firebase from 'firebase';
import FacebookAuthProvider = firebase.auth.FacebookAuthProvider;
import {AngularFirestore} from '@angular/fire/firestore';
import {Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {flatMap, map, switchMap} from 'rxjs/operators';
import {UserData} from './entities/user';
import {Course} from './entities/course';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authState: User = null;
  user$: Observable<UserData>;

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore, private router: Router) {
    afAuth.user.subscribe((user) => {
      this.authState = user;
    });
    this.user$ = this.afAuth.authState.pipe(switchMap(user => {
      if (user) {
        return this.db.doc<UserData>(`users/${user.uid}`).valueChanges();
      } else {
        return of(null);
      }
    }));
  }

  get state(): Observable<User|null> {
    return this.afAuth.user;
  }

  get authenticated(): boolean {
    return this.authState !== null;
  }

  // Returns current user
  get currentUser(): User {
    return this.authenticated ? this.authState : null;
  }

// Returns current user UID
  get currentUserId(): string {
    return this.authenticated ? this.authState.uid : '';
  }

  get currentUserDisplayName(): string {
    return this.authenticated ? this.authState.displayName : '';
  }

  loginWithFacebook(): Promise<firebase.auth.UserCredential|void> {
    return this.socialSignIn(new FacebookAuthProvider());
  }

  signOut(): void {
    this.afAuth.auth.signOut();
    this.router.navigate(['/']);
  }

  private socialSignIn(provider: AuthProvider): Promise<firebase.auth.UserCredential|void>  {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((cred) => { this.updateUserData(cred.user); })
      .catch(error => console.log(error));
  }

  private updateUserData(user: User): Promise<void> {
    const ref = this.db.doc<UserData>(`users/${user.uid}`); // Endpoint on firebase
    const data: UserData = {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      fbId: user.providerData[0].uid,
      roles: {
        user: true
      }
    };

   return ref.set(data, { merge: true });
  }

  get fbId(): Observable<string> {
    // In the current nature of our app, this should be the facebook id
    return this.afAuth.user.pipe(map(u => u ? u.providerData[0].uid : ''));
  }

  fbPhotoUrl(width: number, height: number): Observable<string> {
    return this.fbId.pipe(map(id => {
      if (id === '') {
        return '';
      }
      return `https://graph.facebook.com/${id}/picture?height=${height}&width=${width}`;
    }));
  }

  get isAdmin(): Observable<boolean> {
    return this.user$.pipe(map(user => user && user.roles.admin));
  }

  isAdminOfFaculty(faculty: string): Observable<boolean> {
    return this.user$.pipe(map(user => user && user.roles.faculty_admin.includes(faculty)));
  }

  isAdminForCourse(id: number): Observable<boolean> {
    return this.db.doc<Course>(`courses/${id}`).valueChanges()
      .pipe(flatMap(course => this.isAdminOfFaculty(course.faculty)));
  }
}
