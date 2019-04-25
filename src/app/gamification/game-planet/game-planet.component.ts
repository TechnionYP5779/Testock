import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Planet} from '../entities/planet';
import {AuthService} from '../../users/auth.service';

@Component({
  selector: 'app-game-planet',
  templateUrl: './game-planet.component.html',
  styleUrls: ['./game-planet.component.scss']
})
export class GamePlanetComponent implements OnInit {
  @Input() planet: Planet;
  planet_users: any[];
  @Output() planetClosed = new EventEmitter();
  constructor(private auth: AuthService) {
    this.planet_users = [1, 2, 3, 4];
    this.auth.user$.subscribe(user => {
      for (let i = 0; i < this.planet.monsters.length; ++i) {
        const monster = this.planet.monsters[i];
        const monsterStep = (this.planet.max_points - this.planet.min_points) / this.planet.monsters.length;
        if (user.points >= this.planet.min_points + (i * monsterStep)) {
          monster.owned = true;
        }
      }
    });
  }

  ngOnInit() {
  }

  public closePlanet() {
    this.planetClosed.emit(this.planet.order);
  }

}
