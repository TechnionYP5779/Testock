import {Injectable, Injector} from '@angular/core';
import {AngularFireFunctions} from '@angular/fire/functions';
import {Planet} from './entities/planet';
import {UserData} from '../entities/user';

export enum Rewards {
  SCAN_UPLOAD
}

@Injectable({
  providedIn: 'root'
})
export class GamificationService {
  planets: Planet[];

  constructor(private fns: AngularFireFunctions, private injector: Injector) {
    this.planets = this.injector.get<Planet[]>('Planets' as any);
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

  public getUsersByWorld(planetId: number, limit = 3): Promise<any> {
    const planet = this.planets[planetId];

    const callable = this.fns.httpsCallable('getUsersByPoints');
    return callable({
      min_points: planet.min_points,
      max_points: planet.max_points,
      limit: limit }).toPromise();
  }
}
