import { Injectable } from '@angular/core';
import {AngularFireFunctions} from '@angular/fire/functions';

export enum Rewards {
  SCAN_UPLOAD,
  TOPIC_CREATION
}

@Injectable({
  providedIn: 'root'
})
export class GamificationService {
  constructor(private fns: AngularFireFunctions) { }

  public reward (reward: Rewards) {
    let pointsDelta = 0;
    switch (reward) {
      case Rewards.SCAN_UPLOAD:
        pointsDelta = 100;
        break;
      case Rewards.TOPIC_CREATION:
        pointsDelta = 10;
        break;
      default:
        pointsDelta = 0;
    }
    const callable = this.fns.httpsCallable('addPointsToUser');
    return callable({ pointsDelta: pointsDelta });
  }
}
