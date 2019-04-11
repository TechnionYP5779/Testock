import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {User} from 'firebase';
import AuthProvider = firebase.auth.AuthProvider;
import * as firebase from 'firebase';
import {AngularFirestore} from '@angular/fire/firestore';
import {Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {flatMap, map, switchMap} from 'rxjs/operators';
import {UserData} from './entities/user';
import {Course} from './entities/course';
import {Question} from './entities/question';
import OAuthCredential = firebase.auth.OAuthCredential;

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

  get msToken(): Promise<String> {
    if (sessionStorage.getItem('ms-access-token')) {
      return Promise.resolve(sessionStorage.getItem('ms-access-token'));
    } else {
      return this.loginWithCampus().then(() => {
        if (sessionStorage.getItem('ms-access-token')) {
          return sessionStorage.getItem('ms-access-token');
        } else {
          return null;
        }
      });
    }
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

  loginWithCampus(): Promise<firebase.auth.UserCredential|void> {
    // @ts-ignore
    const provider = new firebase.auth.OAuthProvider('microsoft.com');
    return this.socialSignIn(provider);
  }

  signOut(): void {
    sessionStorage.removeItem('ms-access-token');
    this.afAuth.auth.signOut();
    this.router.navigate(['/']);
  }

  private socialSignIn(provider: AuthProvider): Promise<firebase.auth.UserCredential|void>  {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((cred) => {
        if (!cred.user.email.endsWith('technion.ac.il')) {
          this.signOut();
        }
        sessionStorage.setItem('ms-access-token', (cred.credential as OAuthCredential).accessToken);
        if (cred.additionalUserInfo.isNewUser) {
          return this.createNewUser(cred.user);
        }
      })
      .catch(error => console.log(error));
  }

  private createNewUser(user: User): Promise<void> {
    const ref = this.db.doc<UserData>(`users/${user.uid}`); // Endpoint on firebase
    const data: UserData = {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      microsoftId: user.providerData[0].uid,
      roles: {
        user: true
      },
      points: 0
    };

   return ref.set(data);
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

  isAdminForQuestion(id: string): Observable<boolean> {
    return this.db.doc<Question>(`questions/${id}`).valueChanges()
      .pipe(flatMap(q => this.isAdminForCourse(q.course)));
  }
}
