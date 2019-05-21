import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import * as firebase from 'firebase';
import {User} from 'firebase';
import {AngularFirestore} from '@angular/fire/firestore';
import {Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {flatMap, map, switchMap} from 'rxjs/operators';
import {UserData} from '../entities/user';
import {Course} from '../entities/course';
import {Question} from '../entities/question';
import {MsGraphService} from './msgraph.service';
import {AngularFireStorage} from '@angular/fire/storage';
import UserCredential = firebase.auth.UserCredential;
import OAuthCredential = firebase.auth.OAuthCredential;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authState: User = null;
  user$: Observable<UserData>;

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore, private storage: AngularFireStorage,
              private msgraph: MsGraphService, private router: Router) {
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

  loginWithCampus(): Promise<firebase.auth.UserCredential|void> {
    const provider = new firebase.auth.OAuthProvider('microsoft.com');
    provider.setCustomParameters({
      tenant: 'f1502c4c-ee2e-411c-9715-c855f6753b84'
    });
    return this.afAuth.auth.signInWithPopup(provider)
      .then((cred) => {
        if (!cred.user.email.endsWith('technion.ac.il')) {
          this.signOut();
        }
        if (cred.additionalUserInfo.isNewUser) {
          return this.createNewUser(cred);
        }
      });
  }

  signOut(): void {
    this.afAuth.auth.signOut();
    this.router.navigate(['/']);
  }

  private createNewUser(cred: UserCredential): Promise<any> {
    const user = cred.user;
    const accessToken = (cred.credential as OAuthCredential).accessToken;
    const getFacultyPromise: Promise<any> =  this.msgraph.getFaculty(accessToken).toPromise().catch(() => null);

    const uploadProfilePicturePromise: Promise<string> = this.msgraph.selfProfilePicture(accessToken).toPromise()
      .then(blob => this.storage.ref(`users/${user.uid}/profile.jpg`).put(blob))
      .then(us => us.ref.getDownloadURL())
      .then(url => Promise.all([user.updateProfile({photoURL: url}), Promise.resolve(url)])).then(res => res[1])
      .catch(() => null);

    return Promise.all([getFacultyPromise, uploadProfilePicturePromise]).then(results => {
      const ref = this.db.doc<UserData>(`users/${user.uid}`); // Endpoint on firebase
      const data: UserData = {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        microsoftId: user.providerData[0].uid,
        roles: {
          user: true
        },
        points: 100,
        faculty: results[0] ? (results[0] as any).department : null,
        photoUrl: results[1] ? results[1] : `https://ui-avatars.com/api/?name=${user.displayName}`,
        favoriteCourses: []
      };

      return ref.set(data);
    }).catch(console.log);
  }

  get isAdmin(): Observable<boolean> {
    return this.user$.pipe(map(user => user && user.roles.admin));
  }

  isAdminOfFaculty(faculty: string): Observable<boolean> {
    return this.user$.pipe(map(user => user && user.roles.faculty_admin && user.roles.faculty_admin.includes(faculty)));
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
