import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {User} from 'firebase';
import AuthProvider = firebase.auth.AuthProvider;
import * as firebase from 'firebase';
import FacebookAuthProvider = firebase.auth.FacebookAuthProvider;
import {AngularFirestore} from '@angular/fire/firestore';
import {Router} from '@angular/router';
import UserCredential = firebase.auth.UserCredential;
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authState: User = null;

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore, private router: Router) {
    afAuth.user.subscribe((user) => {
      this.authState = user;
    });
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
      .then((cred) => this.updateUserData(cred))
      .catch(error => console.log(error));
  }

  private updateUserData(cred: UserCredential): void {
    this.authState = cred.user;
    const path = `users/${this.currentUserId}`; // Endpoint on firebase
    console.log(path);
    const data = {
      name: this.currentUser.displayName,
      email: this.currentUser.email,
    };

    this.db.doc(path).set(data)
      .catch(error => console.log(error));

  }

}
