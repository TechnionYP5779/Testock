import {Injectable, Injector} from '@angular/core';
import {AngularFireFunctions} from '@angular/fire/functions';
import {Planet} from './entities/planet';
import {UserData} from '../entities/user';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Question} from '../entities/question';
@Injectable({
  providedIn: 'root'
})
export class GamificationService {
  planets: Planet[];
  private usersCollection: AngularFirestoreCollection<UserData>;

  constructor(private fns: AngularFireFunctions, private afs: AngularFirestore, private injector: Injector) {
    this.planets = this.injector.get<Planet[]>('Planets' as any);
    this.usersCollection = afs.collection<UserData>('users');
  }

  public reward (reward: Rewards): Promise<void> {
    let pointsDelta = 0;
    switch (reward) {
      case Rewards.SCAN_UPLOAD:
        pointsDelta = 15;
        break;
      default:
        pointsDelta = 0;
    }
    const callable = this.fns.httpsCallable('addPointsToUser');
    return callable({ pointsDelta: pointsDelta }).toPromise();
  }

  public getUsersByWorld(planetId: number, limit = 5): Observable<UserData[]> {
    const planet = this.planets[planetId];

    const qureies = r =>
      r.where('points', '>=', planet.min_points)
        .where('points', '<=', planet.max_points)
        .orderBy('points', 'desc')
        .limit(limit);

    return this.afs.collection<UserData>('users', qureies).valueChanges();
  }
}

import {Observable} from 'rxjs';

export enum Rewards {
  SCAN_UPLOAD
}
