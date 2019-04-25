import { Injectable } from '@angular/core';
import {AngularFireFunctions} from '@angular/fire/functions';

export enum Rewards {
  SCAN_UPLOAD
}

@Injectable({
  providedIn: 'root'
})
export class GamificationService {
  constructor(private fns: AngularFireFunctions) { }

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
}
