import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import * as firebase from 'firebase';
import {User} from 'firebase';
import {AngularFirestore} from '@angular/fire/firestore';
import {Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {map, switchMap, take} from 'rxjs/operators';
import {UserData} from '../entities/user';
import {Course} from '../entities/course';
import {Question, QuestionId} from '../entities/question';
import {MsGraphService} from './msgraph.service';
import {AngularFireStorage} from '@angular/fire/storage';
import {firestore} from 'firebase/app';
import {NgxSpinnerService} from 'ngx-spinner';
import {Contribution, ContributionType} from '../entities/contribution';
import {SolutionId} from '../entities/solution';
import UserCredential = firebase.auth.UserCredential;
import OAuthCredential = firebase.auth.OAuthCredential;
import Timestamp = firestore.Timestamp;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authState: User = null;
  readonly user$: Observable<UserData>;

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore, private storage: AngularFireStorage,
              private msgraph: MsGraphService, private router: Router, private spinner: NgxSpinnerService) {
    afAuth.user.subscribe((user) => {
      this.authState = user;
    });
    this.user$ = this.afAuth.user.pipe(switchMap(user => {
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

  async login() {
    await this.spinner.show();
    try {
      await this.loginWithCampus();
    } finally {
      await this.spinner.hide();
    }
  }

  private loginWithCampus(): Promise<firebase.auth.UserCredential|void> {
    const provider = new firebase.auth.OAuthProvider('microsoft.com');
    provider.setCustomParameters({
      tenant: 'f1502c4c-ee2e-411c-9715-c855f6753b84'
    });
    return this.afAuth.auth.signInWithPopup(provider)
      .then((cred) => {
        if (!cred.user.email.endsWith('technion.ac.il')) {
          return this.signOut();
        }
        if (cred.additionalUserInfo.isNewUser) {
          return this.createNewUser(cred);
        }
      });
  }

  async signOut() {
    await this.router.navigate(['/']);
    await this.afAuth.auth.signOut();
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
        created: Timestamp.now(),
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
      .pipe(switchMap(course => this.isAdminOfFaculty(course.faculty)));
  }

  isAdminForQuestion(id: string): Observable<boolean> {
    return this.db.doc<Question>(`questions/${id}`).valueChanges()
      .pipe(switchMap(q => this.isAdminForCourse(q.course)));
  }

  updateFavoriteCourse(course: number, favorite: boolean): Promise<void> {
    return this.user$.pipe(take(1)).toPromise().then(user => {
      let newFavorites = user.favoriteCourses;
      if (favorite) {
        if (newFavorites.includes(course) === false) {
          newFavorites.push(course);
        }
      } else {
        newFavorites = newFavorites.filter(c => c !== course);
      }
      return this.db.doc<UserData>(`users/${user.uid}`).update({
        favoriteCourses: newFavorites
      });
    });
  }

  private addContribution(contribution: Contribution) {
    return this.user$.pipe(take(1)).toPromise().then(user => {
      return this.db.collection('users/' + user.uid + '/contributions').add(contribution);
    });
  }

  addSolutionContribution(q: QuestionId, sol: SolutionId) {
    return this.addContribution({
      type: ContributionType.SOLUTION,
      questionId: q.id,
      course: q.course,
      qNumber: q.number,
      moed: q.moed,
      solutionId: sol.id,
      created: Timestamp.now()
    });
  }

  getContributionsByType(type: ContributionType): Observable<Contribution[]> {
    const ref = r => r.where('type', '==', type).orderBy('created', 'desc');
    return this.user$.pipe(switchMap(user => {
      if (!user) {
        return of([]);
      } else {
        return this.db.collection<Contribution>(`users/${user.uid}/contributions`, ref).valueChanges();
      }
    }));
  }

}
