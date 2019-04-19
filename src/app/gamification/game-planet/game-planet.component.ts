import {Component, Input, OnInit} from '@angular/core';
import {Planet} from '../entities/planet';

@Component({
  selector: 'app-game-planet',
  templateUrl: './game-planet.component.html',
  styleUrls: ['./game-planet.component.scss']
})
export class GamePlanetComponent implements OnInit {
  @Input() planet: Planet;
  planet_users: any[];
  constructor() {
    this.planet_users = [1, 2, 3, 4];
  }

  ngOnInit() {
  }

}
