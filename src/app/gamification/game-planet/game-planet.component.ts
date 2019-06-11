import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Planet} from '../entities/planet';
import {AuthService} from '../../users/auth.service';
import {GamificationService} from '../gamification.service';
import {UserData} from '../../entities/user';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-game-planet',
  templateUrl: './game-planet.component.html',
  styleUrls: ['./game-planet.component.scss']
})
export class GamePlanetComponent implements OnInit {
  @Input() planet: Planet;
  planetUsers$: Observable<UserData[]>;
  pointsForNextMonster = -1;
  @Output() planetClosed = new EventEmitter();

  constructor(private auth: AuthService, private gamification: GamificationService) { }

  ngOnInit() {
    this.auth.user$.subscribe(user => {
      if (user.points < this.planet.min_points) { // past planet
        return;
      } else if (user.points > this.planet.max_points) { // future planet
        for (let i = 0; i < this.planet.monsters.length; ++i) {
          this.planet.monsters[i].owned = true;
        }
        return;
      } else { // current planet
        const monsterStep = Math.floor((this.planet.max_points - this.planet.min_points) / this.planet.monsters.length);
        this.pointsForNextMonster = this.planet.min_points + monsterStep;
        for (let i = 0; i < this.planet.monsters.length; ++i) {
          const monster = this.planet.monsters[i];
          const currentMonsterStep = this.planet.min_points + ((i + 1) * monsterStep);
          if (user.points >= currentMonsterStep) {
            monster.owned = true;
            this.pointsForNextMonster += monsterStep;
          }
        }
      }
    });

    this.planetUsers$ = this.gamification.getUsersByWorld(this.planet.order);
  }

  public closePlanet() {
    this.planetClosed.emit(this.planet.order);
  }

}
